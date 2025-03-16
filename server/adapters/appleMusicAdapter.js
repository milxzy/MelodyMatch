import jwt from 'jsonwebtoken';
import fs from 'fs';
import fetch from 'node-fetch';

/**
 * Apple Music Adapter - Handles all Apple Music API interactions
 * Uses MusicKit API for fetching user library data
 */
class AppleMusicAdapter {
  constructor() {
    this.teamId = process.env.APPLE_TEAM_ID;
    this.keyId = process.env.APPLE_KEY_ID;
    this.privateKeyPath = process.env.APPLE_PRIVATE_KEY_PATH;
    this.apiBaseUrl = 'https://api.music.apple.com/v1';
    
    // Cache developer token (valid for 6 months)
    this.developerToken = null;
    this.developerTokenExpiry = null;
  }

  /**
   * Generate Apple Music Developer Token (JWT)
   * @returns {string} Developer token for API requests
   */
  generateDeveloperToken() {
    // Check if cached token is still valid (refresh 1 day before expiry)
    if (this.developerToken && this.developerTokenExpiry) {
      const oneDayFromNow = Date.now() + (24 * 60 * 60 * 1000);
      if (this.developerTokenExpiry > oneDayFromNow) {
        return this.developerToken;
      }
    }

    // Read private key
    const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
    
    // Token expires in 6 months (max allowed by Apple)
    const expiresIn = 6 * 30 * 24 * 60 * 60; // 6 months in seconds
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      iss: this.teamId,
      iat: now,
      exp: now + expiresIn
    };
    
    const options = {
      algorithm: 'ES256',
      keyid: this.keyId
    };
    
    const token = jwt.sign(payload, privateKey, options);
    
    // Cache the token
    this.developerToken = token;
    this.developerTokenExpiry = (now + expiresIn) * 1000; // Convert to milliseconds
    
    return token;
  }

  /**
   * Make authenticated request to Apple Music API
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {string} userToken - User's music token
   * @param {object} options - Additional fetch options
   * @returns {Promise<object>} API response data
   */
  async makeRequest(endpoint, userToken, options = {}) {
    const developerToken = this.generateDeveloperToken();
    
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${developerToken}`,
      'Music-User-Token': userToken,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Apple Music API error: ${response.status} - ${error.errors?.[0]?.detail || response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Fetch user's library artists
   * @param {string} userToken - User's music token
   * @returns {Promise<Array<string>>} Array of artist names
   */
  async fetchUserArtists(userToken) {
    try {
      const artists = [];
      let nextUrl = '/me/library/artists';
      
      // Apple Music API uses pagination
      while (nextUrl) {
        const data = await this.makeRequest(nextUrl, userToken);
        
        if (data.data) {
          const artistNames = data.data.map(artist => 
            artist.attributes?.name
          ).filter(Boolean);
          
          artists.push(...artistNames);
        }
        
        // Check for next page
        nextUrl = data.next ? data.next : null;
        
        // Safety limit: max 500 artists
        if (artists.length >= 500) break;
      }
      
      return artists;
    } catch (error) {
      console.error('Error fetching Apple Music artists:', error);
      throw error;
    }
  }

  /**
   * Fetch user's genres from their library
   * Apple Music doesn't have a direct genres endpoint, so we extract from songs/albums
   * @param {string} userToken - User's music token
   * @returns {Promise<Array<string>>} Array of genre names
   */
  async fetchUserGenres(userToken) {
    try {
      const genres = new Set();
      
      // Get genres from user's library songs
      const songsData = await this.makeRequest('/me/library/songs?limit=100', userToken);
      
      if (songsData.data) {
        songsData.data.forEach(song => {
          const genreNames = song.attributes?.genreNames || [];
          genreNames.forEach(g => genres.add(g));
        });
      }
      
      // Also get genres from albums for better coverage
      const albumsData = await this.makeRequest('/me/library/albums?limit=50', userToken);
      
      if (albumsData.data) {
        albumsData.data.forEach(album => {
          const genreNames = album.attributes?.genreNames || [];
          genreNames.forEach(g => genres.add(g));
        });
      }
      
      return Array.from(genres);
    } catch (error) {
      console.error('Error fetching Apple Music genres:', error);
      throw error;
    }
  }

  /**
   * Fetch complete user library
   * @param {string} userToken - User's music token
   * @returns {Promise<object>} Complete library data
   */
  async fetchUserLibrary(userToken) {
    try {
      // Fetch in parallel for speed
      const [artists, genres, playlists] = await Promise.all([
        this.fetchUserArtists(userToken),
        this.fetchUserGenres(userToken),
        this.fetchUserPlaylists(userToken)
      ]);
      
      return {
        artists,
        genres,
        playlists,
        topTracks: [] // Apple Music doesn't expose "top tracks" in library
      };
    } catch (error) {
      console.error('Error fetching Apple Music library:', error);
      throw error;
    }
  }

  /**
   * Fetch user's playlists
   * @param {string} userToken - User's music token
   * @returns {Promise<Array<object>>} Array of playlist objects
   */
  async fetchUserPlaylists(userToken) {
    try {
      const playlists = [];
      const data = await this.makeRequest('/me/library/playlists?limit=25', userToken);
      
      if (data.data) {
        data.data.forEach(playlist => {
          playlists.push({
            id: playlist.id,
            name: playlist.attributes?.name,
            trackCount: playlist.attributes?.trackCount || 0
          });
        });
      }
      
      return playlists;
    } catch (error) {
      console.error('Error fetching Apple Music playlists:', error);
      return [];
    }
  }

  /**
   * Validate if user token is still valid
   * @param {string} userToken - User's music token
   * @returns {Promise<boolean>} True if valid
   */
  async validateToken(userToken) {
    try {
      // Simple request to check token validity
      await this.makeRequest('/me/library/artists?limit=1', userToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh user token
   * Note: Apple Music user tokens don't have a refresh mechanism
   * Users must re-authenticate when token expires
   * @param {string} refreshToken - Not used for Apple Music
   * @throws {Error} Always throws - Apple Music doesn't support token refresh
   */
  async refreshToken(refreshToken) {
    throw new Error('Apple Music tokens cannot be refreshed. User must re-authenticate.');
  }

  /**
   * Normalize Apple Music data to standard format
   * @param {object} rawData - Raw data from Apple Music API
   * @returns {object} Normalized data
   */
  normalizeData(rawData) {
    // Apple Music data is already in a good format
    // This method exists for consistency with other adapters
    return rawData;
  }
}

export default AppleMusicAdapter;
