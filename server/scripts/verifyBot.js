#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function verifyBot() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    const bot = await User.findOne({ isBot: true }).lean();
    
    console.log('✅ Sample Bot User:');
    console.log(JSON.stringify({
      name: bot.name,
      age: bot.age,
      gender: bot.gender,
      country: bot.country,
      bio: bot.bio,
      pictureCount: bot.pictures?.length,
      pictures: bot.pictures,
      genreCount: bot.genres?.length,
      artistCount: bot.artists?.length,
      genres: bot.genres?.slice(0, 5),
      artists: bot.artists?.slice(0, 5)
    }, null, 2));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyBot();
