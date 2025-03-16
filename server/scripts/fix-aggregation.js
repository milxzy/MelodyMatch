/**
 * One-time script to aggregate existing platformData into aggregatedArtists/Genres
 * Run this to fix users who connected before aggregation was properly implemented
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import MusicPlatformService from '../services/musicPlatformService.js';
import User from '../models/user.js';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function fixAggregation() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.CONNECTION_STRING;
    if (!mongoUri) {
      console.error('CONNECTION_STRING environment variable not set');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Get user ID from command line or use default
    const userId = process.argv[2] || '679560722e304b773348f213';
    console.log(`\nFixing aggregation for user: ${userId}`);
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    
    console.log(`\nUser: ${user.email || user.display_name}`);
    console.log(`Connected platforms: ${user.connectedPlatforms.join(', ')}`);
    
    // Show current state
    console.log('\n=== BEFORE AGGREGATION ===');
    console.log('aggregatedArtists:', user.aggregatedArtists?.length || 0);
    console.log('aggregatedGenres:', user.aggregatedGenres?.length || 0);
    
    if (user.platformData) {
      for (const [platform, data] of Object.entries(user.platformData)) {
        console.log(`\n${platform}:`);
        console.log(`  artists: ${data.artists?.length || 0}`);
        console.log(`  genres: ${data.genres?.length || 0}`);
        if (data.artists?.length > 0) {
          console.log(`  sample artists: ${data.artists.slice(0, 3).join(', ')}...`);
        }
      }
    }
    
    // Run aggregation
    console.log('\n=== RUNNING AGGREGATION ===');
    const aggregated = await MusicPlatformService.mergeUserMusicData(userId);
    
    console.log('\n=== AFTER AGGREGATION ===');
    console.log(`✅ Aggregated ${aggregated.artists.length} artists`);
    console.log(`✅ Aggregated ${aggregated.genres.length} genres`);
    
    if (aggregated.artists.length > 0) {
      console.log(`\nSample artists: ${aggregated.artists.slice(0, 5).join(', ')}...`);
    }
    
    if (aggregated.genres.length > 0) {
      console.log(`Sample genres: ${aggregated.genres.slice(0, 5).join(', ')}...`);
    }
    
    console.log('\n✅ Aggregation complete!');
    console.log('The user profile should now display the correct artist and genre counts.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

fixAggregation();
