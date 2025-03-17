#!/usr/bin/env node

// Script to fix bot users profile pictures to match their gender
// Updates profile_pic URLs to use gender-specific avatars

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

function generateGenderSpecificProfilePic(botNumber, gender) {
  // 70% of bots get profile pictures, 30% get null
  // But for fixing existing bots, we'll give everyone a picture
  
  // Use randomuser.me API for gender-specific avatars
  const genderParam = gender === 'male' ? 'men' : gender === 'female' ? 'women' : 'lego';
  return `https://randomuser.me/api/portraits/${genderParam}/${(botNumber % 99) + 1}.jpg`;
}

async function fixBotProfilePictures() {
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
    const bots = await User.find({ isBot: true }).sort({ email: 1 });

    console.log(`Found ${bots.length} bot users\n`);

    if (bots.length === 0) {
      console.log('✓ No bot users found!');
      process.exit(0);
    }

    // Update each bot user
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      
      try {
        // Extract bot number from email (e.g., bot1@melodymatch.test -> 1)
        const botNumber = parseInt(bot.email.match(/bot(\d+)@/)?.[1] || i + 1);
        
        if (!bot.gender) {
          console.log(`⚠ Skipping ${bot.email}: no gender set`);
          skippedCount++;
          continue;
        }

        const newProfilePic = generateGenderSpecificProfilePic(botNumber, bot.gender);
        const oldProfilePic = bot.profile_pic;
        
        bot.profile_pic = newProfilePic;
        await bot.save();
        
        console.log(`✓ Updated ${bot.email}:`);
        console.log(`  Gender: ${bot.gender}`);
        console.log(`  Old PFP: ${oldProfilePic || 'none'}`);
        console.log(`  New PFP: ${newProfilePic}`);
        console.log('');
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to update ${bot.email || bot._id}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✓ Successfully updated: ${successCount}`);
    if (skippedCount > 0) {
      console.log(`⚠ Skipped (no gender): ${skippedCount}`);
    }
    if (failCount > 0) {
      console.log(`✗ Failed to update: ${failCount}`);
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
fixBotProfilePictures();
