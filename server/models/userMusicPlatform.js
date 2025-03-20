import mongoose from 'mongoose';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const { Schema } = mongoose;

const userMusicPlatformSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  platform: {
    type: String,
    enum: ['apple_music', 'youtube_music', 'spotify'],
    required: true
  },
  
  platformUserId: {
    type: String,
    required: true
  },
  
  platformDisplayName: {
    type: String,
    required: false
  },
  
  // Encrypted tokens
  accessToken: {
    type: String,
    required: false,
    select: false // Don't include in queries by default
  },
  
  refreshToken: {
    type: String,
    required: false,
    select: false
  },
  
  tokenExpiry: {
    type: Date,
    required: false
  },
  
  // Music data from this platform
  artists: {
    type: [String],
    default: []
  },
  
  genres: {
    type: [String],
    default: []
  },
  
  topTracks: {
    type: Array,
    default: []
  },
  
  playlists: {
    type: Array,
    default: []
  },
  
  // Platform status
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastSynced: {
    type: Date,
    default: Date.now
  },
  
  syncStatus: {
    type: String,
    enum: ['pending', 'syncing', 'completed', 'failed'],
    default: 'pending'
  },
  
  syncError: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Compound index - one user can have one entry per platform
userMusicPlatformSchema.index({ userId: 1, platform: 1 }, { unique: true });
userMusicPlatformSchema.index({ userId: 1, isActive: 1 });
userMusicPlatformSchema.index({ lastSynced: -1 });

// Encryption key from environment
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

// Method to encrypt token before saving
userMusicPlatformSchema.methods.encryptToken = function(token) {
  if (!token) return null;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return iv + authTag + encrypted (all hex)
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};

// Method to decrypt token
userMusicPlatformSchema.methods.decryptToken = function(encryptedToken) {
  if (!encryptedToken) return null;
  
  try {
    const parts = encryptedToken.split(':');
    if (parts.length !== 3) return null;
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    logger.error('Token decryption failed:', error);
    return null;
  }
};

// Method to check if token needs refresh (15 min before expiry)
userMusicPlatformSchema.methods.needsTokenRefresh = function() {
  if (!this.tokenExpiry) return true;
  
  const fifteenMinutes = 15 * 60 * 1000;
  const expiryTime = new Date(this.tokenExpiry).getTime();
  const now = Date.now();
  
  return (expiryTime - now) < fifteenMinutes;
};

const UserMusicPlatform = mongoose.model('UserMusicPlatform', userMusicPlatformSchema);

export default UserMusicPlatform;
