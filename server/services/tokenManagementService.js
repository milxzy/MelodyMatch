import crypto from 'crypto';
import UserMusicPlatform from '../models/userMusicPlatform.js';

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

/**
 * Token Management Service
 * Handles encryption, decryption, storage, and refresh of platform tokens
 */

/**
 * Encrypts sensitive token data
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted text with IV and auth tag
 */
export function encryptToken(text) {
  if (!text) return null;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts encrypted token data
 * @param {string} encryptedText - Encrypted text with IV and auth tag
 * @returns {string} - Decrypted plain text
 */
export function decryptToken(encryptedText) {
  if (!encryptedText) return null;
  
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }
  
  const [ivHex, authTagHex, encryptedData] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Stores platform tokens securely
 * @param {string} userId - User ID
 * @param {string} platform - Platform name (apple_music, youtube_music, spotify)
 * @param {Object} tokenData - Token data object
 * @param {string} tokenData.platformUserId - User ID from the platform
 * @param {string} tokenData.platformDisplayName - Display name from platform (optional)
 * @returns {Promise<Object>} - Stored platform connection
 */
export async function storeTokens(userId, platform, tokenData) {
  console.log('[storeTokens] Called with:', {
    userId,
    platform,
    hasAccessToken: !!tokenData.accessToken,
    platformUserId: tokenData.platformUserId,
    platformDisplayName: tokenData.platformDisplayName
  });

  if (!tokenData.platformUserId) {
    throw new Error('platformUserId is required in tokenData');
  }

  const encryptedAccessToken = encryptToken(tokenData.accessToken);
  const encryptedRefreshToken = tokenData.refreshToken 
    ? encryptToken(tokenData.refreshToken) 
    : null;
  
  const tokenExpiry = tokenData.expiresIn 
    ? new Date(Date.now() + tokenData.expiresIn * 1000)
    : null;
  
  // Find existing connection or create new one
  let platformConnection = await UserMusicPlatform.findOne({
    userId,
    platform
  });
  
  if (platformConnection) {
    // Update existing connection
    platformConnection.accessToken = encryptedAccessToken;
    platformConnection.refreshToken = encryptedRefreshToken;
    platformConnection.tokenExpiry = tokenExpiry;
    platformConnection.platformUserId = tokenData.platformUserId;
    platformConnection.platformDisplayName = tokenData.platformDisplayName || platformConnection.platformDisplayName;
    platformConnection.isActive = true;
    platformConnection.lastSynced = new Date();
  } else {
    // Create new connection
    platformConnection = new UserMusicPlatform({
      userId,
      platform,
      platformUserId: tokenData.platformUserId,
      platformDisplayName: tokenData.platformDisplayName || null,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiry: tokenExpiry,
      isActive: true,
      lastSynced: new Date()
    });
  }
  
  await platformConnection.save();
  return platformConnection;
}

/**
 * Retrieves decrypted tokens for a platform
 * @param {string} userId - User ID
 * @param {string} platform - Platform name
 * @returns {Promise<Object>} - Decrypted token data
 */
export async function getTokens(userId, platform) {
  const platformConnection = await UserMusicPlatform.findOne({
    userId,
    platform,
    isActive: true
  }).select('+accessToken +refreshToken');
  
  if (!platformConnection) {
    return null;
  }
  
  // Check if token is expired
  if (platformConnection.tokenExpiry && platformConnection.tokenExpiry < new Date()) {
    // Token expired, attempt refresh
    const refreshed = await refreshTokenIfNeeded(userId, platform);
    if (!refreshed) {
      return null;
    }
    // Fetch the refreshed tokens
    return getTokens(userId, platform);
  }
  
  return {
    accessToken: decryptToken(platformConnection.accessToken),
    refreshToken: platformConnection.refreshToken 
      ? decryptToken(platformConnection.refreshToken) 
      : null,
    tokenExpiry: platformConnection.tokenExpiry,
    scopes: platformConnection.scopes
  };
}

/**
 * Refreshes access token if expired or about to expire
 * @param {string} userId - User ID
 * @param {string} platform - Platform name
 * @returns {Promise<boolean>} - Whether refresh was successful
 */
export async function refreshTokenIfNeeded(userId, platform) {
  const platformConnection = await UserMusicPlatform.findOne({
    userId,
    platform,
    isActive: true
  }).select('+accessToken +refreshToken');
  
  if (!platformConnection || !platformConnection.refreshToken) {
    return false;
  }
  
  // Check if token needs refresh (expired or expires in < 5 minutes)
  const needsRefresh = !platformConnection.tokenExpiry || 
    platformConnection.tokenExpiry < new Date(Date.now() + 5 * 60 * 1000);
  
  if (!needsRefresh) {
    return true;
  }
  
  try {
    const refreshToken = decryptToken(platformConnection.refreshToken);
    let newTokenData;
    
    switch (platform) {
      case 'youtube_music':
        newTokenData = await refreshYouTubeMusicToken(refreshToken);
        break;
      case 'spotify':
        newTokenData = await refreshSpotifyToken(refreshToken);
        break;
      case 'apple_music':
        // Apple Music user tokens cannot be refreshed server-side
        // User must re-authenticate
        console.warn('Apple Music tokens cannot be refreshed. User must re-authenticate.');
        return false;
      default:
        console.error(`Unknown platform for token refresh: ${platform}`);
        return false;
    }
    
    // Store new tokens
    await storeTokens(userId, platform, newTokenData);
    return true;
    
  } catch (error) {
    console.error(`Failed to refresh token for ${platform}:`, error);
    return false;
  }
}

/**
 * Refreshes YouTube Music access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New token data
 */
async function refreshYouTubeMusicToken(refreshToken) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  
  if (!response.ok) {
    throw new Error(`YouTube Music token refresh failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: refreshToken, // Refresh token doesn't change
    expiresIn: data.expires_in,
    scopes: data.scope ? data.scope.split(' ') : []
  };
}

/**
 * Refreshes Spotify access token (legacy support)
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New token data
 */
async function refreshSpotifyToken(refreshToken) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });
  
  if (!response.ok) {
    throw new Error(`Spotify token refresh failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in,
    scopes: data.scope ? data.scope.split(' ') : []
  };
}

/**
 * Revokes platform connection
 * @param {string} userId - User ID
 * @param {string} platform - Platform name
 * @returns {Promise<boolean>} - Whether revocation was successful
 */
export async function revokeConnection(userId, platform) {
  const platformConnection = await UserMusicPlatform.findOne({
    userId,
    platform
  });
  
  if (!platformConnection) {
    return false;
  }
  
  // Mark as inactive instead of deleting (for audit trail)
  platformConnection.isActive = false;
  await platformConnection.save();
  
  return true;
}

/**
 * Gets all active platform connections for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of active platform connections
 */
export async function getUserPlatforms(userId) {
  const platforms = await UserMusicPlatform.find({
    userId,
    isActive: true
  }).select('platform lastSynced tokenExpiry');
  
  return platforms;
}

export default {
  encryptToken,
  decryptToken,
  storeTokens,
  getTokens,
  refreshTokenIfNeeded,
  revokeConnection,
  getUserPlatforms
};
