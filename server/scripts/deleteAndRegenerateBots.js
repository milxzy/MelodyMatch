#!/usr/bin/env node

/**
 * Delete all bot users and regenerate with new bio and HD pictures
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/user.js';
import { generateUsers } from './generators/userGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const CONNECTION_STRING = process.env.CONNECTION_STRING;

if (!CONNECTION_STRING) {
  console.error('❌ CONNECTION_STRING not found in environment variables');
  process.exit(1);
}

async function deleteAndRegenerateBots() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(CONNECTION_STRING);
    console.log('✅ Connected to MongoDB');

    // Step 1: Delete all bot users
    console.log('\n🗑️  Deleting all existing bot users...');
    const deleteResult = await User.deleteMany({ isBot: true });
    console.log(`✅ Deleted ${deleteResult.deletedCount} bot users`);

    // Step 2: Generate new bot users
    const botCount = 50; // Adjust this number as needed
    const strategy = 'realistic'; // Options: 'diverse', 'clustered', 'realistic', 'custom'
    
    console.log(`\n🤖 Generating ${botCount} new bot users with HD pictures and bios...`);
    const botUsers = generateUsers(botCount, strategy);
    
    // Step 3: Insert bot users
    console.log('💾 Inserting bot users into database...');
    const insertResult = await User.insertMany(botUsers);
    console.log(`✅ Successfully created ${insertResult.length} bot users`);

    // Step 4: Show summary
    console.log('\n📊 Summary:');
    console.log(`   • Total bot users: ${insertResult.length}`);
    console.log(`   • Strategy used: ${strategy}`);
    console.log(`   • HD pictures: 3-5 per user`);
    console.log(`   • Bios: ✓`);
    console.log(`   • Music preferences: ✓`);

    // Show sample bot
    const sampleBot = insertResult[0];
    console.log('\n📝 Sample bot user:');
    console.log(`   • Name: ${sampleBot.name}`);
    console.log(`   • Age: ${sampleBot.age}`);
    console.log(`   • Gender: ${sampleBot.gender}`);
    console.log(`   • Country: ${sampleBot.country}`);
    console.log(`   • Bio: ${sampleBot.bio?.substring(0, 50)}...`);
    console.log(`   • Pictures: ${sampleBot.pictures?.length || 0}`);
    console.log(`   • Genres: ${sampleBot.genres?.length || 0}`);
    console.log(`   • Artists: ${sampleBot.artists?.length || 0}`);

    console.log('\n✨ Bot regeneration complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the script
deleteAndRegenerateBots();
