import fetch from 'node-fetch';
import logger from '../utils/logger.js';

/**
 * YouTube Music Adapter - Handles YouTube Music API interactions
 * Communicates with Python microservice that uses ytmusicapi
 */
class YouTubeMusicAdapter {
  constructor() {
    this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || process.env.YOUTUBE_MUSIC_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Call Python microservice endpoint
   * @param {string} endpoint - Endpoint path
   * @param {object} data - Request data
   * @param {string} method - HTTP method
   * @returns {Promise<object>} Response data
   */
  async callPythonService(endpoint, data = {}, method = 'GET') {
    const url = `${this.pythonServiceUrl}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (method !== 'GET' && Object.keys(data).length > 0) {
      options.body = JSON.stringify(data);
    }
    
    // Add query params for GET requests
    if (method === 'GET' && Object.keys(data).length > 0) {
      const params = new URLSearchParams(data);
      url = `${url}?${params.toString()}`;
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`YouTube Music service error: ${response.status} - ${error.detail || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error('Python service call failed:', error);
      throw new Error(`Failed to communicate with YouTube Music service: ${error.message}`);
    }
  }

  /**
   * Initiate OAuth flow for YouTube Music
   * @returns {Promise<object>} Object with authorization URL
   */
  async initiateOAuth() {
    return await this.callPythonService('/auth/initiate', {}, 'POST');
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   * @param {string} code - Authorization code from OAuth callback
   * @returns {Promise<object>} Object with access_token, refresh_token, expires_in
   */
  async handleCallback(code) {
    return await this.callPythonService('/auth/callback', { code }, 'POST');
  }

  /**
   * Fetch user's artists from YouTube Music
   * @param {string} token - Access token
   * @returns {Promise<Array<string>>} Array of artist names
   */
  async fetchUserArtists(token) {
    try {
      const response = await this.callPythonService('/user/artists', { token });
      return response.artists || [];
    } catch (error) {
      logger.error('Error fetching YouTube Music artists:', error);
      throw error;
    }
  }

  /**
   * Fetch user's genres from YouTube Music
   * Note: YouTube Music doesn't have explicit genres, so we infer from artists
   * @param {string} token - Access token
   * @returns {Promise<Array<string>>} Array of genre names
   */
  async fetchUserGenres(token) {
    try {
      const response = await this.callPythonService('/user/genres', { token });
      return response.genres || [];
    } catch (error) {
      logger.error('Error fetching YouTube Music genres:', error);
      throw error;
    }
  }

  /**
   * Fetch complete user library from YouTube Music
   * @param {string} token - Access token
   * @returns {Promise<object>} Complete library data
   */
  async fetchUserLibrary(token) {
    try {
      const response = await this.callPythonService('/user/library', { token });
      
      return {
        artists: response.artists || [],
        genres: response.genres || [],
        playlists: response.playlists || [],
        topTracks: response.topTracks || []
      };
    } catch (error) {
      logger.error('Error fetching YouTube Music library:', error);
      throw error;
    }
  }

  /**
   * Refresh YouTube Music access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      const response = await this.callPythonService('/token/refresh', { 
        refresh_token: refreshToken 
      }, 'POST');
      
      return {
        accessToken: response.access_token,
        expiresIn: response.expires_in
      };
    } catch (error) {
      logger.error('Error refreshing YouTube Music token:', error);
      throw error;
    }
  }

  /**
   * Validate if token is still valid
   * @param {string} token - Access token
   * @returns {Promise<boolean>} True if valid
   */
  async validateToken(token) {
    try {
      await this.callPythonService('/user/artists', { token, limit: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Normalize YouTube Music data to standard format
   * @param {object} rawData - Raw data from YouTube Music
   * @returns {object} Normalized data
   */
  normalizeData(rawData) {
    // Convert YouTube Music format to our standard format
    return {
      artists: (rawData.artists || []).map(a => a.name || a),
      genres: rawData.genres || [],
      playlists: (rawData.playlists || []).map(p => ({
        id: p.playlistId || p.id,
        name: p.title || p.name,
        trackCount: p.count || 0
      })),
      topTracks: (rawData.topTracks || []).map(t => ({
        id: t.videoId || t.id,
        name: t.title || t.name,
        artist: t.artists?.[0]?.name || t.artist
      }))
    };
  }

  /**
   * Alias for fetchUserArtists (for compatibility)
   * @param {string} token - Access token
   * @returns {Promise<Array<string>>} Array of artist names
   */
  async getTopArtists(token) {
    return this.fetchUserArtists(token);
  }

  /**
   * Alias for fetchUserGenres (for compatibility)
   * @param {string} token - Access token
   * @returns {Promise<Array<string>>} Array of genre names
   */
  async getTopGenres(token) {
    return this.fetchUserGenres(token);
  }
}

export default YouTubeMusicAdapter;
