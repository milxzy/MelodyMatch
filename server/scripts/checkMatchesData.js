#!/usr/bin/env node

// Script to check what data is returned for matches

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';
import Match from '../models/matches.js';

async function checkMatchesData() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;
    if (!mongoUri) {
      throw new Error('MONGO_URI or CONNECTION_STRING not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find a bot user with matches
    console.log('Finding bot users with matches...');
    const botsWithMatches = await User.find({ 
      isBot: true,
      $expr: { $gt: [{ $size: '$likedUsers' }, 0] }
    }).limit(1);

    if (botsWithMatches.length === 0) {
      console.log('No bots with matches found. Creating some test matches...');
      
      // Get first two bots
      const bots = await User.find({ isBot: true }).limit(2);
      if (bots.length < 2) {
        console.log('Not enough bots to create matches');
        process.exit(0);
      }
      
      // Create mutual likes
      bots[0].likedUsers.push(bots[1]._id);
      bots[1].likedUsers.push(bots[0]._id);
      bots[0].likedBy.push(bots[1]._id);
      bots[1].likedBy.push(bots[0]._id);
      
      await bots[0].save();
      await bots[1].save();
      
      console.log(`Created match between ${bots[0].email} and ${bots[1].email}\n`);
    }

    // Now test the matches endpoint logic
    const testUser = botsWithMatches.length > 0 ? botsWithMatches[0] : await User.findOne({ isBot: true, $expr: { $gt: [{ $size: '$likedUsers' }, 0] } });
    
    console.log(`Testing matches for: ${testUser.email}`);
    console.log(`User ID: ${testUser._id}\n`);

    // Simulate the matches endpoint logic
    const user = await User.findById(testUser._id).populate("likedUsers").populate("likedBy");

    console.log('User likedUsers count:', user.likedUsers.length);
    console.log('User likedBy count:', user.likedBy.length);

    const matches = user.likedUsers.filter((likedUser) =>
      likedUser.likedBy.some((likedByUser) => likedByUser.equals(testUser._id))
    );

    console.log('Matches found:', matches.length);
    console.log('');

    if (matches.length > 0) {
      matches.forEach((match, index) => {
        console.log(`Match ${index + 1}:`);
        console.log(`  Name: ${match.name}`);
        console.log(`  Email: ${match.email}`);
        console.log(`  Profile Pic: ${match.profile_pic || 'MISSING'}`);
        console.log(`  Pictures: ${match.pictures ? `[${match.pictures.length} photos]` : 'MISSING'}`);
        if (match.pictures && match.pictures.length > 0) {
          console.log(`  First picture: ${match.pictures[0]}`);
        }
        console.log('');
      });
    } else {
      console.log('No matches found for this user');
    }

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
checkMatchesData();
