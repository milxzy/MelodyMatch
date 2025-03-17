#!/usr/bin/env node

// Script to test the getMatches endpoint

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

async function testMatchesEndpoint() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;
    if (!mongoUri) {
      throw new Error('MONGO_URI or CONNECTION_STRING not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find a real user (non-bot)
    const realUser = await User.findOne({ isBot: { $ne: true } });
    
    if (!realUser) {
      console.log('No real users found. Creating a test with bot1...');
      var testUser = await User.findOne({ email: 'bot1@melodymatch.test' });
    } else {
      var testUser = realUser;
    }

    console.log(`Testing with user: ${testUser.email}`);
    console.log(`User ID: ${testUser._id}\n`);

    // Simulate the getMatches endpoint
    const user = await User.findById(testUser._id).populate('likedUsers').populate('likedBy');
    
    console.log('LikedUsers count:', user.likedUsers.length);
    console.log('LikedBy count:', user.likedBy.length);
    
    const matches = user.likedUsers.filter(likedUser => 
      likedUser.likedUsers.some(likedByUser => likedByUser.equals(testUser._id))
    );
    
    const filteredMatches = matches.filter(match => !match._id.equals(testUser._id));

    console.log('Matches found:', filteredMatches.length);
    console.log('');

    if (filteredMatches.length > 0) {
      console.log('Match details:');
      filteredMatches.forEach((match, index) => {
        console.log(`\nMatch ${index + 1}:`);
        console.log(`  Name: ${match.name}`);
        console.log(`  Email: ${match.email}`);
        console.log(`  IsBot: ${match.isBot}`);
        console.log(`  profile_pic: ${match.profile_pic || 'MISSING!!!'}`);
        console.log(`  pictures: ${match.pictures ? `[${match.pictures.length} photos]` : 'MISSING!!!'}`);
        if (match.pictures && match.pictures.length > 0) {
          console.log(`  pictures[0]: ${match.pictures[0]}`);
        }
      });
    } else {
      console.log('No matches for this user. User needs to have mutual likes.');
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
testMatchesEndpoint();
