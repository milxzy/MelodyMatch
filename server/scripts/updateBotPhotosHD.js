#!/usr/bin/env node

// Script to update bot users photos with HD, gender-matched images
// Updates profile_pic with HD image and clears the pictures array (only one photo)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

// Common first names to determine gender
const maleNames = ['james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas', 'charles', 
                   'christopher', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua',
                   'kenneth', 'kevin', 'brian', 'george', 'timothy', 'ronald', 'edward', 'jason', 'jeffrey', 'ryan',
                   'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon',
                   'benjamin', 'samuel', 'raymond', 'gregory', 'frank', 'alexander', 'patrick', 'jack', 'dennis', 'jerry'];

const femaleNames = ['mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan', 'jessica', 'sarah', 'karen',
                     'lisa', 'nancy', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle',
                     'dorothy', 'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia',
                     'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda', 'pamela', 'emma', 'nicole', 'helen',
                     'samantha', 'katherine', 'christine', 'debra', 'rachel', 'carolyn', 'janet', 'catherine', 'maria', 'heather'];

function inferGenderFromName(name) {
  if (!name) return null;
  
  const firstName = name.toLowerCase().split(' ')[0];
  
  if (maleNames.includes(firstName)) return 'male';
  if (femaleNames.includes(firstName)) return 'female';
  
  return null;
}

function generateHDGenderMatchedPhoto(botNumber, gender, name) {
  // Determine gender from field or infer from name
  let finalGender = gender;
  
  if (!finalGender || finalGender === 'non-binary') {
    const inferredGender = inferGenderFromName(name);
    if (inferredGender) {
      finalGender = inferredGender;
    }
  }
  
  // Use high-resolution photo services
  // Using Picsum Photos - a free service that provides high-quality placeholder images
  // Photos are consistently the same per seed number (using botNumber as seed)
  
  if (finalGender === 'male') {
    // Picsum with seed for men - consistent HD photos (1200x1200)
    // Using different number ranges for different genders
    const photoId = (botNumber * 10) + 100; // Range: 110-600
    return `https://picsum.photos/seed/man${photoId}/1200/1200`;
  } else if (finalGender === 'female') {
    // Picsum with seed for women - consistent HD photos (1200x1200)
    const photoId = (botNumber * 10) + 1000; // Range: 1010-1500
    return `https://picsum.photos/seed/woman${photoId}/1200/1200`;
  } else {
    // For non-binary: use neutral seed
    const photoId = (botNumber * 10) + 2000; // Range: 2010-2500
    return `https://picsum.photos/seed/person${photoId}/1200/1200`;
  }
}

async function updateBotPhotosHD() {
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
    let warningCount = 0;

    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      
      try {
        // Extract bot number from email (e.g., bot1@melodymatch.test -> 1)
        const botNumber = parseInt(bot.email.match(/bot(\d+)@/)?.[1] || i + 1);
        
        const currentGender = bot.gender;
        const inferredGender = inferGenderFromName(bot.name);
        const finalGender = currentGender || inferredGender;
        
        if (!finalGender) {
          console.log(`⚠ Warning for ${bot.email}:`);
          console.log(`  Name: ${bot.name}`);
          console.log(`  Gender: ${currentGender || 'not set'}`);
          console.log(`  Could not determine gender - using neutral avatar`);
          console.log('');
          warningCount++;
        }

        const newProfilePic = generateHDGenderMatchedPhoto(botNumber, finalGender, bot.name);
        const oldProfilePic = bot.profile_pic;
        const oldPicturesCount = bot.pictures?.length || 0;
        
        // Update: single HD photo in both profile_pic and pictures array
        bot.profile_pic = newProfilePic;
        bot.pictures = [newProfilePic]; // Set pictures array with one HD photo
        
        await bot.save();
        
        console.log(`✓ Updated ${bot.email}:`);
        console.log(`  Name: ${bot.name}`);
        console.log(`  Gender: ${currentGender || 'not set'}${inferredGender && !currentGender ? ` (inferred: ${inferredGender})` : ''}`);
        console.log(`  Old profile_pic: ${oldProfilePic || 'none'}`);
        console.log(`  Old pictures count: ${oldPicturesCount}`);
        console.log(`  New HD profile_pic: ${newProfilePic}`);
        console.log(`  Resolution: 1200x1200 (Picsum Photos)`);
        console.log(`  New pictures array: 1 photo (same as profile_pic)`);
        console.log('');
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to update ${bot.email || bot._id}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✓ Successfully updated: ${successCount}`);
    if (warningCount > 0) {
      console.log(`⚠ Warnings (gender uncertain): ${warningCount}`);
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
updateBotPhotosHD();
