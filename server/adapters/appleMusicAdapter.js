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
    
    // Handle both full URLs (from pagination) and relative endpoints
    let url;
    if (endpoint.startsWith('http')) {
      // Full URL from pagination
      url = endpoint;
    } else {
      // Relative path - just add to base URL
      url = `${this.apiBaseUrl}${endpoint}`;
    }
    
    const headers = {
      'Authorization': `Bearer ${developerToken}`,
      'Music-User-Token': userToken,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    console.log(`[Apple Music API] Requesting: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorDetail = error.errors?.[0]?.detail || error.errors?.[0]?.title || response.statusText;
      console.error(`[Apple Music API] Error ${response.status}: ${errorDetail}`);
      throw new Error(`Apple Music API error: ${response.status} - ${errorDetail}`);
    }
    
    return await response.json();
  }

  /**
   * Get user's storefront (region) and basic profile info
   * @param {string} userToken - User's music token
   * @returns {Promise<object>} User storefront data
   */
  async getUserStorefront(userToken) {
    try {
      const data = await this.makeRequest('/me/storefront', userToken);
      return data.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching Apple Music storefront:', error);
      throw error;
    }
  }

  /**
   * Extract next URL from pagination response
   * @param {string} nextUrl - Next URL from Apple Music API
   * @returns {string|null} Processed URL or null
   */
  extractNextUrl(nextUrl) {
    if (!nextUrl) return null;
    
    // If it's a full URL (starts with http), parse and extract path
    if (nextUrl.startsWith('http')) {
      try {
        const url = new URL(nextUrl);
        // Remove /v1 prefix if present to avoid duplication
        const path = url.pathname.replace(/^\/v1/, '');
        return path + url.search;
      } catch (e) {
        console.error('[Apple Music] Error parsing next URL:', e);
        return null;
      }
    }
    
    // If it's a relative path, just strip /v1 prefix if present
    return nextUrl.replace(/^\/v1/, '');
  }

  /**
   * Fetch user's library artists by extracting from songs and albums
   * @param {string} userToken - User's music token
   * @returns {Promise<Array<string>>} Array of artist names
   */
  async fetchUserArtists(userToken) {
    try {
      const artists = new Set(); // Use Set for automatic deduplication
      
      // 1. Extract artists from library songs (with pagination)
      console.log('[Apple Music] Fetching artists from library songs...');
      let nextSongsUrl = '/me/library/songs?limit=100';
      let songsPageCount = 0;
      const MAX_PAGES = 50; // Safety limit: 5000 songs max
      
      while (nextSongsUrl && songsPageCount < MAX_PAGES) {
        try {
          const songsData = await this.makeRequest(nextSongsUrl, userToken);
          
          if (songsData.data) {
            songsData.data.forEach(song => {
              const artistName = song.attributes?.artistName;
              if (artistName) artists.add(artistName);
            });
          }
          
          // Handle pagination
          nextSongsUrl = this.extractNextUrl(songsData.next);
          songsPageCount++;
          
          if (songsPageCount % 5 === 0) {
            console.log(`[Apple Music] Processed ${songsPageCount} pages of songs, found ${artists.size} unique artists so far...`);
          }
        } catch (error) {
          if (error.message.includes('404')) {
            console.log('[Apple Music] No more songs found in library (404)');
            break;
          }
          throw error;
        }
      }
      
      console.log(`[Apple Music] Extracted ${artists.size} artists from ${songsPageCount} pages of songs`);
      
      // 2. Also extract artists from library albums (better coverage)
      console.log('[Apple Music] Fetching artists from library albums...');
      let nextAlbumsUrl = '/me/library/albums?limit=100';
      let albumsPageCount = 0;
      
      while (nextAlbumsUrl && albumsPageCount < MAX_PAGES) {
        try {
          const albumsData = await this.makeRequest(nextAlbumsUrl, userToken);
          
          if (albumsData.data) {
            albumsData.data.forEach(album => {
              const artistName = album.attributes?.artistName;
              if (artistName) artists.add(artistName);
            });
          }
          
          // Handle pagination
          nextAlbumsUrl = this.extractNextUrl(albumsData.next);
          albumsPageCount++;
        } catch (error) {
          if (error.message.includes('404')) {
            console.log('[Apple Music] No more albums found in library (404)');
            break;
          }
          throw error;
        }
      }
      
      console.log(`[Apple Music] Extracted ${artists.size} total unique artists from ${songsPageCount} pages of songs and ${albumsPageCount} pages of albums`);
      return Array.from(artists);
    } catch (error) {
      console.error('Error fetching Apple Music artists:', error);
      // Return empty array on error instead of throwing
      return [];
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
      
      // Get genres from ALL library songs with pagination
      console.log('[Apple Music] Fetching genres from library songs...');
      let nextSongsUrl = '/me/library/songs?limit=100';
      let songsPageCount = 0;
      const MAX_PAGES = 50; // Safety limit: 5000 songs max
      
      while (nextSongsUrl && songsPageCount < MAX_PAGES) {
        try {
          const songsData = await this.makeRequest(nextSongsUrl, userToken);
          
          if (songsData.data) {
            songsData.data.forEach(song => {
              const genreNames = song.attributes?.genreNames || [];
              genreNames.forEach(g => genres.add(g));
            });
          }
          
          // Handle pagination
          nextSongsUrl = this.extractNextUrl(songsData.next);
          songsPageCount++;
          
          if (songsPageCount % 5 === 0) {
            console.log(`[Apple Music] Processed ${songsPageCount} pages of songs, found ${genres.size} unique genres so far...`);
          }
        } catch (error) {
          if (error.message.includes('404')) {
            console.log('[Apple Music] No more songs found in library (404)');
            break;
          }
          throw error;
        }
      }
      
      console.log(`[Apple Music] Extracted ${genres.size} genres from ${songsPageCount} pages of songs`);
      
      // Also get genres from ALL albums with pagination
      console.log('[Apple Music] Fetching genres from library albums...');
      let nextAlbumsUrl = '/me/library/albums?limit=100';
      let albumsPageCount = 0;
      
      while (nextAlbumsUrl && albumsPageCount < MAX_PAGES) {
        try {
          const albumsData = await this.makeRequest(nextAlbumsUrl, userToken);
          
          if (albumsData.data) {
            albumsData.data.forEach(album => {
              const genreNames = album.attributes?.genreNames || [];
              genreNames.forEach(g => genres.add(g));
            });
          }
          
          // Handle pagination
          nextAlbumsUrl = this.extractNextUrl(albumsData.next);
          albumsPageCount++;
        } catch (error) {
          if (error.message.includes('404')) {
            console.log('[Apple Music] No more albums found in library (404)');
            break;
          }
          throw error;
        }
      }
      
      console.log(`[Apple Music] Fetched ${genres.size} total unique genres from ${songsPageCount} pages of songs and ${albumsPageCount} pages of albums`);
      return Array.from(genres);
    } catch (error) {
      console.error('Error fetching Apple Music genres:', error);
      // Return empty array on error instead of throwing
      return [];
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

  /**
   * Alias for fetchUserArtists (for compatibility)
   * @param {string} userToken - User's music token
   * @returns {Promise<Array<string>>} Array of artist names
   */
  async getTopArtists(userToken) {
    return this.fetchUserArtists(userToken);
  }

  /**
   * Alias for fetchUserGenres (for compatibility)
   * @param {string} userToken - User's music token
   * @returns {Promise<Array<string>>} Array of genre names
   */
  async getTopGenres(userToken) {
    return this.fetchUserGenres(userToken);
  }
}

export default AppleMusicAdapter;
