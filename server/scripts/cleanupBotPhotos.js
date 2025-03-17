#!/usr/bin/env node

// Script to clean up unnecessary photo fields from bot users
// Keeps only profile_pic and pictures array with 1 photo

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

async function cleanupBotPhotos() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;
    if (!mongoUri) {
      throw new Error('MONGO_URI or CONNECTION_STRING not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find all bot users
    console.log('Finding bot users...');
    const bots = await User.find({ isBot: true });

    console.log(`Found ${bots.length} bot users\n`);

    if (bots.length === 0) {
      console.log('✓ No bot users found!');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    for (const bot of bots) {
      try {
        // Clear the legacy 'pic' field (set to undefined to remove it)
        bot.pic = undefined;
        
        await bot.save();
        
        console.log(`✓ Cleaned ${bot.email}:`);
        console.log(`  Removed legacy 'pic' field`);
        console.log(`  profile_pic: ${bot.profile_pic ? 'PRESENT' : 'MISSING'}`);
        console.log(`  pictures: ${bot.pictures?.length || 0} photo(s)`);
        console.log('');
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to clean ${bot.email || bot._id}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✓ Successfully cleaned: ${successCount}`);
    if (failCount > 0) {
      console.log(`✗ Failed to clean: ${failCount}`);
    }
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  }
}

// Run the script
cleanupBotPhotos();
