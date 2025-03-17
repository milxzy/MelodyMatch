#!/usr/bin/env node

// Script to verify bot photos are correctly set

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';

async function verifyBotPhotos() {
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
    const bots = await User.find({ isBot: true }).limit(5);

    console.log(`Checking first 5 bot users:\n`);

    bots.forEach((bot, index) => {
      console.log(`Bot ${index + 1}:`);
      console.log(`  Email: ${bot.email}`);
      console.log(`  Name: ${bot.name}`);
      console.log(`  Gender: ${bot.gender}`);
      console.log(`  profile_pic: ${bot.profile_pic || 'MISSING'}`);
      console.log(`  pictures array length: ${bot.pictures?.length || 0}`);
      if (bot.pictures && bot.pictures.length > 0) {
        console.log(`  pictures[0]: ${bot.pictures[0]}`);
      }
      console.log('');
    });

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
verifyBotPhotos();
