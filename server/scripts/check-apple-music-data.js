import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

mongoose.connect(process.env.CONNECTION_STRING).then(async () => {
  const user = await User.findOne({ email: 'milescollins9@gmail.com' });
  
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  
  console.log('\n=== Platform Data ===');
  if (user.platformData?.apple_music) {
    console.log('Apple Music artists:', user.platformData.apple_music.artists?.length || 0);
    console.log('Apple Music genres:', user.platformData.apple_music.genres?.length || 0);
    console.log('Last synced:', user.platformData.apple_music.lastSyncedAt);
    
    if (user.platformData.apple_music.artists?.length > 0) {
      console.log('\nFirst 10 artists:', user.platformData.apple_music.artists.slice(0, 10));
    } else {
      console.log('\n⚠️ Artists array is empty!');
    }
    
    if (user.platformData.apple_music.genres?.length > 0) {
      console.log('\nFirst 10 genres:', user.platformData.apple_music.genres.slice(0, 10));
    } else {
      console.log('\n⚠️ Genres array is empty!');
    }
  } else {
    console.log('No Apple Music platform data found');
  }
  
  console.log('\n=== Aggregated Data ===');
  console.log('Aggregated artists:', user.aggregatedArtists?.length || 0);
  console.log('Aggregated genres:', user.aggregatedGenres?.length || 0);
  
  console.log('\n=== Connected Platforms ===');
  console.log('Connected:', user.connectedPlatforms);
  console.log('Primary:', user.primaryPlatform);
  console.log('Migration complete:', user.hasCompletedMigration);
  
  mongoose.disconnect();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
