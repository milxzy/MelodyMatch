import AppleMusicAdapter from '../adapters/appleMusicAdapter.js';
import YouTubeMusicAdapter from '../adapters/youtubeMusicAdapter.js';
import SpotifyAdapter from '../adapters/spotifyAdapter.js';
import UserMusicPlatform from '../models/userMusicPlatform.js';
import User from '../models/user.js';

/**
 * Music Platform Service - Abstraction layer for all music platforms
 * Provides unified interface for fetching music data regardless of platform
 */
class MusicPlatformService {
  /**
   * Factory method to get the appropriate adapter for a platform
   * @param {string} platform - 'apple_music', 'youtube_music', or 'spotify'
   * @returns {Object} Platform-specific adapter instance
   */
  static getAdapter(platform) {
    switch(platform) {
      case 'apple_music':
        return new AppleMusicAdapter();
      case 'youtube_music':
        return new YouTubeMusicAdapter();
      case 'spotify':
        return new SpotifyAdapter();
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  /**
   * Fetch user's artists from a specific platform
   * @param {string} platform - Platform identifier
   * @param {string} token - Access token for the platform
   * @returns {Promise<Array<string>>} Array of artist names
   */
  static async fetchUserArtists(platform, token) {
    const adapter = this.getAdapter(platform);
    return await adapter.fetchUserArtists(token);
  }

  /**
   * Fetch user's genres from a specific platform
   * @param {string} platform - Platform identifier
   * @param {string} token - Access token
   * @returns {Promise<Array<string>>} Array of genre names
   */
  static async fetchUserGenres(platform, token) {
    const adapter = this.getAdapter(platform);
    return await adapter.fetchUserGenres(token);
  }

  /**
   * Fetch complete user library from a platform
   * @param {string} platform - Platform identifier
   * @param {string} token - Access token
   * @returns {Promise<Object>} Object with artists, genres, topTracks, playlists
   */
  static async fetchUserLibrary(platform, token) {
    const adapter = this.getAdapter(platform);
    return await adapter.fetchUserLibrary(token);
  }

  /**
   * Refresh an expired token
   * @param {string} platform - Platform identifier
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New access token and expiry
   */
  static async refreshToken(platform, refreshToken) {
    const adapter = this.getAdapter(platform);
    return await adapter.refreshToken(refreshToken);
  }

  /**
   * Validate if a token is still valid
   * @param {string} platform - Platform identifier
   * @param {string} token - Access token to validate
   * @returns {Promise<boolean>} True if valid, false otherwise
   */
  static async validateToken(platform, token) {
    const adapter = this.getAdapter(platform);
    return await adapter.validateToken(token);
  }

  /**
   * Merge music data from all connected platforms for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Aggregated artists and genres
   */
  static async mergeUserMusicData(userId) {
    // Get all active platforms for this user
    const platforms = await UserMusicPlatform.find({ 
      userId, 
      isActive: true 
    });

    if (platforms.length === 0) {
      return { artists: [], genres: [] };
    }

    // Aggregate artists and genres
    const aggregatedArtists = this.aggregateArtists(platforms);
    const aggregatedGenres = this.aggregateGenres(platforms);

    // Update user record with aggregated data
    await User.findByIdAndUpdate(userId, {
      aggregatedArtists,
      aggregatedGenres,
      connectedPlatforms: platforms.map(p => p._id)
    });

    return { artists: aggregatedArtists, genres: aggregatedGenres };
  }

  /**
   * Aggregate artists from multiple platforms (deduplicate)
   * @param {Array<Object>} platforms - Array of UserMusicPlatform documents
   * @returns {Array<string>} Unique artist names
   */
  static aggregateArtists(platforms) {
    const allArtists = platforms.flatMap(p => p.artists || []);
    
    // Normalize and deduplicate
    const normalized = allArtists.map(artist => {
      return artist.toLowerCase()
        .replace(/^the\s+/i, '')  // Remove "The" prefix
        .replace(/[^\w\s]/g, '')  // Remove special chars
        .trim();
    });

    // Create map of normalized -> original
    const artistMap = new Map();
    allArtists.forEach((artist, index) => {
      const norm = normalized[index];
      if (!artistMap.has(norm)) {
        artistMap.set(norm, artist); // Keep first occurrence (original form)
      }
    });

    return Array.from(artistMap.values());
  }

  /**
   * Aggregate genres from multiple platforms with smart mapping
   * @param {Array<Object>} platforms - Array of UserMusicPlatform documents
   * @returns {Array<string>} Unique canonical genre names
   */
  static aggregateGenres(platforms) {
    const allGenres = platforms.flatMap(p => p.genres || []);
    
    // Import genre normalizer
    const { normalizeGenre } = require('../utils/genreNormalizer.js');
    
    // Normalize all genres to canonical forms
    const normalized = allGenres.map(genre => normalizeGenre(genre));
    
    // Deduplicate
    return [...new Set(normalized)];
  }

  /**
   * Sync music data for a specific platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform to sync
   * @returns {Promise<Object>} Sync result
   */
  static async syncPlatform(userId, platform) {
    const platformDoc = await UserMusicPlatform.findOne({ 
      userId, 
      platform 
    }).select('+accessToken +refreshToken');

    if (!platformDoc) {
      throw new Error(`Platform ${platform} not connected for user ${userId}`);
    }

    // Check if token needs refresh
    if (platformDoc.needsTokenRefresh()) {
      const decryptedRefreshToken = platformDoc.decryptToken(platformDoc.refreshToken);
      const { accessToken, expiresIn } = await this.refreshToken(platform, decryptedRefreshToken);
      
      platformDoc.accessToken = platformDoc.encryptToken(accessToken);
      platformDoc.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
      await platformDoc.save();
    }

    // Fetch fresh data
    platformDoc.syncStatus = 'syncing';
    await platformDoc.save();

    try {
      const decryptedToken = platformDoc.decryptToken(platformDoc.accessToken);
      const library = await this.fetchUserLibrary(platform, decryptedToken);

      platformDoc.artists = library.artists || [];
      platformDoc.genres = library.genres || [];
      platformDoc.topTracks = library.topTracks || [];
      platformDoc.playlists = library.playlists || [];
      platformDoc.lastSynced = new Date();
      platformDoc.syncStatus = 'completed';
      platformDoc.syncError = null;
      
      await platformDoc.save();

      // Re-aggregate user's music data from all platforms
      await this.mergeUserMusicData(userId);

      return {
        success: true,
        platform,
        artistCount: library.artists?.length || 0,
        genreCount: library.genres?.length || 0
      };
    } catch (error) {
      platformDoc.syncStatus = 'failed';
      platformDoc.syncError = error.message;
      await platformDoc.save();

      throw error;
    }
  }

  /**
   * Sync all connected platforms for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of sync results
   */
  static async syncAllPlatforms(userId) {
    const platforms = await UserMusicPlatform.find({ 
      userId, 
      isActive: true 
    });

    const results = await Promise.allSettled(
      platforms.map(p => this.syncPlatform(userId, p.platform))
    );

    return results.map((result, index) => ({
      platform: platforms[index].platform,
      status: result.status,
      data: result.value,
      error: result.reason?.message
    }));
  }
}

export default MusicPlatformService;
