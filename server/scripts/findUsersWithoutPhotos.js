#!/usr/bin/env node

// Script to find users without photos

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

async function findUsersWithoutPhotos() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;
    if (!mongoUri) {
      throw new Error('MONGO_URI or CONNECTION_STRING not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find users without profile_pic
    const usersWithoutProfilePic = await User.find({
      $or: [
        { profile_pic: { $exists: false } },
        { profile_pic: null },
        { profile_pic: '' }
      ]
    });

    console.log(`Users without profile_pic: ${usersWithoutProfilePic.length}`);
    
    if (usersWithoutProfilePic.length > 0) {
      console.log('\nDetails:');
      usersWithoutProfilePic.forEach((user) => {
        console.log(`  - ${user.email} (${user.isBot ? 'BOT' : 'REAL USER'})`);
      });
    }

    // Find users without pictures array or empty pictures
    const usersWithoutPictures = await User.find({
      $or: [
        { pictures: { $exists: false } },
        { pictures: null },
        { pictures: [] }
      ]
    });

    console.log(`\nUsers without pictures array: ${usersWithoutPictures.length}`);
    
    if (usersWithoutPictures.length > 0) {
      console.log('\nDetails:');
      usersWithoutPictures.slice(0, 10).forEach((user) => {
        console.log(`  - ${user.email} (${user.isBot ? 'BOT' : 'REAL USER'}) - profile_pic: ${user.profile_pic ? 'YES' : 'NO'}`);
      });
      if (usersWithoutPictures.length > 10) {
        console.log(`  ... and ${usersWithoutPictures.length - 10} more`);
      }
    }

    // Check all users summary
    const allUsers = await User.countDocuments();
    const botsCount = await User.countDocuments({ isBot: true });
    const realUsersCount = allUsers - botsCount;

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total users: ${allUsers}`);
    console.log(`  - Bots: ${botsCount}`);
    console.log(`  - Real users: ${realUsersCount}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

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
findUsersWithoutPhotos();
