import logger from '../utils/logger.js';

/**
 * Spotify Adapter - Legacy support (read-only)
 * Spotify API access is no longer available due to 250k MAU requirement
 * This adapter exists only for backward compatibility with migrated data
 */
class SpotifyAdapter {
  constructor() {
    logger.warn('Spotify adapter is deprecated. Spotify API access requires 250k MAU.');
  }

  /**
   * Fetch user artists - NOT SUPPORTED
   * @throws {Error} Spotify API no longer accessible
   */
  async fetchUserArtists(token) {
    throw new Error('Spotify API is no longer accessible. Please connect Apple Music or YouTube Music.');
  }

  /**
   * Fetch user genres - NOT SUPPORTED
   * @throws {Error} Spotify API no longer accessible
   */
  async fetchUserGenres(token) {
    throw new Error('Spotify API is no longer accessible. Please connect Apple Music or YouTube Music.');
  }

  /**
   * Fetch user library - NOT SUPPORTED
   * @throws {Error} Spotify API no longer accessible
   */
  async fetchUserLibrary(token) {
    throw new Error('Spotify API is no longer accessible. Please connect Apple Music or YouTube Music.');
  }

  /**
   * Refresh token - NOT SUPPORTED
   * @throws {Error} Spotify API no longer accessible
   */
  async refreshToken(refreshToken) {
    throw new Error('Spotify API is no longer accessible. Please connect Apple Music or YouTube Music.');
  }

  /**
   * Validate token - Always returns false
   * @returns {Promise<boolean>} Always false
   */
  async validateToken(token) {
    return false;
  }
}

export default SpotifyAdapter;
