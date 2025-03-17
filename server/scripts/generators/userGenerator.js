// Main user object generation

import { generateDemographicProfile } from '../data/demographics.js';
import { 
  generateEmail, 
  generateSpotifyId, 
  generatePassword, 
  generateProfilePicture 
} from './nameGenerator.js';
import { 
  generateDiverseMusic, 
  generateClusteredMusic, 
  generateRealisticMusic, 
  generateCustomMusic,
  getClusterForUser 
} from './musicGenerator.js';
import { generateBio, generateMultiplePictures } from './bioGenerator.js';

/**
 * Generate a complete bot user object
 * @param {number} index - User index (1-based)
 * @param {string} strategy - Music generation strategy
 * @param {object} options - Additional options (customArtists, customGenres, totalUsers)
 */
export function generateUser(index, strategy = 'realistic', options = {}) {
  // Generate demographics
  const demographics = generateDemographicProfile();
  
  // Generate music preferences based on strategy
  let music;
  switch (strategy) {
    case 'diverse':
      music = generateDiverseMusic();
      break;
    case 'clustered':
      const clusterType = getClusterForUser(index - 1, options.totalUsers || 20);
      music = generateClusteredMusic(clusterType);
      break;
    case 'realistic':
      music = generateRealisticMusic();
      break;
    case 'custom':
      music = generateCustomMusic(
        options.customArtists,
        options.customGenres,
        index,
        options.totalUsers || 20
      );
      break;
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
  
  // Generate bio and multiple pictures
  const bio = generateBio(demographics, music);
  const pictures = generateMultiplePictures(index, demographics.gender);
  
  // Assemble complete user object matching User schema
  return {
    // Credentials
    email: generateEmail(index),
    password: generatePassword(),
    
    // Profile info
    name: demographics.name,
    preferred_name: demographics.name, // Add preferred_name for display
    age: demographics.age,
    gender: demographics.gender,
    country: demographics.country,
    bio: bio,
    
    // Spotify-like data
    spotify_id: generateSpotifyId(index),
    spotify_display_name: demographics.name,
    profile_pic: generateProfilePicture(index, demographics.gender), // Pass gender for gender-specific avatars
    pictures: pictures, // Multiple profile pictures for swiping
    
    // Music preferences
    genres: music.genres,
    artists: music.artists,
    
    // Access control
    allowedAccess: true,
    isEmailVerified: true,
    isBot: true,
    
    // Empty relationship arrays
    likedUsers: [],
    likedBy: [],
    blockedUsers: [],
    
    // Metadata
    preferences: {
      interestedIn: [] // Empty preferences for bots
    },
    isDeleted: false,
    lastActive: new Date()
  };
}

/**
 * Generate multiple users
 * @param {number} count - Number of users to generate
 * @param {string} strategy - Music generation strategy
 * @param {object} options - Additional options
 */
export function generateUsers(count, strategy = 'realistic', options = {}) {
  const users = [];
  const totalUsers = count;
  
  for (let i = 1; i <= count; i++) {
    const user = generateUser(i, strategy, { ...options, totalUsers });
    users.push(user);
  }
  
  return users;
}
