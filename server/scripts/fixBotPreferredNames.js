#!/usr/bin/env node

// Script to fix bot users that are missing preferred_name field
// Sets preferred_name = name for all bot users that don't have it

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

async function fixBotPreferredNames() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;
    if (!mongoUri) {
      throw new Error('MONGO_URI or CONNECTION_STRING not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find all bot users without preferred_name
    console.log('Finding bot users without preferred_name...');
    const botsWithoutPreferredName = await User.find({
      isBot: true,
      $or: [
        { preferred_name: { $exists: false } },
        { preferred_name: null },
        { preferred_name: '' }
      ]
    });

    console.log(`Found ${botsWithoutPreferredName.length} bot users without preferred_name\n`);

    if (botsWithoutPreferredName.length === 0) {
      console.log('✓ All bot users already have preferred_name set!');
      process.exit(0);
    }

    // Update each bot user
    let successCount = 0;
    let failCount = 0;

    for (const bot of botsWithoutPreferredName) {
      try {
        // Use name, spotify_display_name, or fallback
        const preferredName = bot.name || bot.spotify_display_name || `Bot User ${bot._id}`;
        
        bot.preferred_name = preferredName;
        await bot.save();
        
        console.log(`✓ Updated ${bot.email || bot._id}: preferred_name = "${preferredName}"`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to update ${bot.email || bot._id}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✓ Successfully updated: ${successCount}`);
    if (failCount > 0) {
      console.log(`✗ Failed to update: ${failCount}`);
    }
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    // Also check for any real users without preferred_name
    console.log('Checking for real users without preferred_name...');
    const realUsersWithoutPreferredName = await User.find({
      $or: [{ isBot: { $exists: false } }, { isBot: false }],
      $or: [
        { preferred_name: { $exists: false } },
        { preferred_name: null },
        { preferred_name: '' }
      ]
    });

    if (realUsersWithoutPreferredName.length > 0) {
      console.log(`\nFound ${realUsersWithoutPreferredName.length} real users without preferred_name:`);
      for (const user of realUsersWithoutPreferredName) {
        const fallbackName = user.name || user.spotify_display_name || 'Unknown';
        console.log(`  - ${user.email || user._id}: will fallback to "${fallbackName}"`);
      }
      console.log('\nNote: Real users should set their preferred_name through the profile settings.');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed.');
    process.exit(0);
  }
}

// Run the script
fixBotPreferredNames();
