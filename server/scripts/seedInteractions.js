#!/usr/bin/env node

// Bot interaction seeding script - Creates likes and matches between bots

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
import { calculateMusicCompatibility } from '../utils/matchingAlgorithm.js';

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    likes: 0,
    matches: 0,
    weighted: false,
    clear: false,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--likes':
        options.likes = parseInt(args[++i], 10);
        break;
      case '--matches':
        options.matches = parseInt(args[++i], 10);
        break;
      case '--weighted':
        options.weighted = true;
        break;
      case '--clear':
        options.clear = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
      default:
        if (arg.startsWith('--')) {
          console.error(`Unknown option: ${arg}`);
          console.log('Use --help for usage information');
          process.exit(1);
        }
    }
  }
  
  return options;
}

// Print help message
function printHelp() {
  console.log(`
🤝 MelodyMatch Interaction Seeder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: node seedInteractions.js [options]

Options:
  --likes <number>              Number of random likes to create
  --matches <number>            Number of mutual matches to create
  --weighted                    Weight likes by compatibility score
  --clear                       Clear all bot interactions before seeding
  --verbose                     Show detailed output
  --help                        Show this help message

Examples:
  # Create 100 random likes
  npm run seed:interactions -- --likes 100

  # Create 50 weighted likes (based on compatibility)
  npm run seed:interactions -- --weighted --likes 50

  # Create 20 mutual matches
  npm run seed:interactions -- --matches 20

  # Clear and create likes + matches
  npm run seed:interactions -- --clear --likes 80 --matches 15

  # Verbose output
  npm run seed:interactions -- --verbose --likes 50 --matches 10

Notes:
  - Likes are one-way (User A likes User B)
  - Matches are mutual likes (User A ↔ User B)
  - Weighted mode uses compatibility scores to create more realistic likes
  - Only works with bot users (isBot: true)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

// Print configuration
function printConfig(options, botCount) {
  console.log(`\n🤝 MelodyMatch Interaction Seeder`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Configuration:`);
  console.log(`  Mode: ${options.weighted ? 'Weighted likes + Matches' : 'Random likes + Matches'}`);
  console.log(`  Likes to create: ${options.likes}`);
  console.log(`  Matches to create: ${options.matches}`);
  console.log(`  Clear existing: ${options.clear ? 'Yes' : 'No'}`);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`📊 Found ${botCount} bot users in database\n`);
}

// Clear bot interactions
async function clearInteractions(verbose) {
  if (verbose) {
    console.log(`🗑️  Clearing bot interactions...`);
  }
  
  // Get all bot user IDs
  const bots = await User.find({ isBot: true }, '_id');
  const botIds = bots.map(b => b._id);
  
  // Clear likedUsers and likedBy arrays
  await User.updateMany(
    { isBot: true },
    { $set: { likedUsers: [], likedBy: [] } }
  );
  
  // Delete matches involving bots
  const matchResult = await Match.deleteMany({
    $or: [
      { users: { $in: botIds } }
    ]
  });
  
  if (verbose) {
    console.log(`✅ Cleared interactions for ${bots.length} bots`);
    console.log(`✅ Deleted ${matchResult.deletedCount} matches\n`);
  }
}

// Create random likes
async function createRandomLikes(bots, count, verbose) {
  if (verbose) {
    console.log(`🎲 Creating ${count} random likes...\n`);
  }
  
  const created = [];
  const maxAttempts = count * 3; // Prevent infinite loop
  let attempts = 0;
  
  while (created.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Pick two random bots
    const liker = bots[Math.floor(Math.random() * bots.length)];
    const liked = bots[Math.floor(Math.random() * bots.length)];
    
    // Skip if same user or already liked
    if (liker._id.equals(liked._id)) continue;
    if (liker.likedUsers.some(id => id.equals(liked._id))) continue;
    
    // Create like
    await User.findByIdAndUpdate(liker._id, {
      $push: { likedUsers: liked._id }
    });
    
    await User.findByIdAndUpdate(liked._id, {
      $push: { likedBy: liker._id }
    });
    
    // Update local copy
    liker.likedUsers.push(liked._id);
    liked.likedBy.push(liker._id);
    
    created.push({ liker, liked, compatibility: null });
    
    if (verbose && created.length % 10 === 0) {
      console.log(`  ✓ Created ${created.length}/${count} likes...`);
    }
  }
  
  if (verbose && created.length > 0) {
    console.log(`✅ Created ${created.length} likes\n`);
  }
  
  return created;
}

// Create weighted likes (based on compatibility)
async function createWeightedLikes(bots, count, verbose) {
  if (verbose) {
    console.log(`🎲 Creating ${count} weighted likes (based on compatibility)...\n`);
  }
  
  const created = [];
  const maxAttempts = count * 3;
  let attempts = 0;
  
  while (created.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Pick a random liker
    const liker = bots[Math.floor(Math.random() * bots.length)];
    
    // Calculate compatibility with all other bots
    const candidates = bots
      .filter(b => !b._id.equals(liker._id))
      .filter(b => !liker.likedUsers.some(id => id.equals(b._id)))
      .map(b => ({
        user: b,
        compatibility: calculateMusicCompatibility(liker, b)
      }))
      .sort((a, b) => b.compatibility.score - a.compatibility.score);
    
    if (candidates.length === 0) continue;
    
    // Weighted random selection (higher compatibility = higher chance)
    const totalWeight = candidates.reduce((sum, c) => sum + c.compatibility.score, 0);
    let random = Math.random() * totalWeight;
    
    let liked = null;
    let compatibility = null;
    
    for (const candidate of candidates) {
      random -= candidate.compatibility.score;
      if (random <= 0) {
        liked = candidate.user;
        compatibility = candidate.compatibility;
        break;
      }
    }
    
    if (!liked) continue;
    
    // Create like
    await User.findByIdAndUpdate(liker._id, {
      $push: { likedUsers: liked._id }
    });
    
    await User.findByIdAndUpdate(liked._id, {
      $push: { likedBy: liker._id }
    });
    
    // Update local copy
    liker.likedUsers.push(liked._id);
    liked.likedBy.push(liker._id);
    
    created.push({ liker, liked, compatibility });
    
    if (verbose) {
      console.log(`  ✓ ${liker.name} → ${liked.name} (${compatibility.percentage}% compatibility)`);
    }
  }
  
  if (verbose) {
    console.log(`\n✅ Created ${created.length} weighted likes\n`);
  }
  
  return created;
}

// Create mutual matches
async function createMatches(bots, count, verbose) {
  if (verbose) {
    console.log(`❤️  Creating ${count} mutual matches...\n`);
  }
  
  const created = [];
  const maxAttempts = count * 3;
  let attempts = 0;
  
  while (created.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Pick two random bots
    const user1 = bots[Math.floor(Math.random() * bots.length)];
    const user2 = bots[Math.floor(Math.random() * bots.length)];
    
    // Skip if same user
    if (user1._id.equals(user2._id)) continue;
    
    // Skip if already matched
    if (user1.likedUsers.some(id => id.equals(user2._id)) && 
        user2.likedUsers.some(id => id.equals(user1._id))) {
      continue;
    }
    
    // Calculate compatibility
    const compatibility = calculateMusicCompatibility(user1, user2);
    
    // Create mutual likes
    await User.findByIdAndUpdate(user1._id, {
      $addToSet: { likedUsers: user2._id, likedBy: user2._id }
    });
    
    await User.findByIdAndUpdate(user2._id, {
      $addToSet: { likedUsers: user1._id, likedBy: user1._id }
    });
    
    // Create match document
    const match = new Match({
      users: [user1._id, user2._id]
    });
    await match.save();
    
    // Update local copies
    if (!user1.likedUsers.some(id => id.equals(user2._id))) {
      user1.likedUsers.push(user2._id);
    }
    if (!user2.likedUsers.some(id => id.equals(user1._id))) {
      user2.likedUsers.push(user1._id);
    }
    
    created.push({ user1, user2, compatibility });
    
    if (verbose) {
      console.log(`  ✓ Match: ${user1.name} ↔ ${user2.name} (${compatibility.percentage}% compatibility)`);
    }
  }
  
  if (verbose) {
    console.log(`\n✅ Created ${created.length} mutual matches\n`);
  }
  
  return created;
}

// Print statistics
function printStats(likes, matches) {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`✅ Interaction seeding complete!\n`);
  console.log(`📈 Summary:`);
  console.log(`  Total likes created: ${likes.length}`);
  console.log(`  Mutual matches created: ${matches.length}`);
  
  if (likes.length > 0 && likes[0].compatibility) {
    const avgCompatibility = likes.reduce((sum, l) => sum + l.compatibility.percentage, 0) / likes.length;
    console.log(`  Average like compatibility: ${Math.round(avgCompatibility)}%`);
    
    // Compatibility breakdown
    const perfect = likes.filter(l => l.compatibility.percentage >= 80).length;
    const great = likes.filter(l => l.compatibility.percentage >= 60 && l.compatibility.percentage < 80).length;
    const good = likes.filter(l => l.compatibility.percentage >= 40 && l.compatibility.percentage < 60).length;
    const fair = likes.filter(l => l.compatibility.percentage < 40).length;
    
    console.log(`\n  Like compatibility breakdown:`);
    console.log(`    Perfect Match (80%+): ${perfect} likes`);
    console.log(`    Great Match (60-79%): ${great} likes`);
    console.log(`    Good Match (40-59%): ${good} likes`);
    console.log(`    Fair Match (<40%): ${fair} likes`);
  }
  
  if (matches.length > 0) {
    const avgCompatibility = matches.reduce((sum, m) => sum + m.compatibility.percentage, 0) / matches.length;
    console.log(`\n  Average match compatibility: ${Math.round(avgCompatibility)}%`);
  }
  
  console.log(`\n💡 Test the interactions:`);
  console.log(`  - Login as any bot user`);
  console.log(`  - Check GET /getMatches/:userId for mutual matches`);
  console.log(`  - Test messaging between matched users`);
  console.log(`  - Browse profiles with GET /getUsers?userId={id}`);
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// Main function
async function main() {
  try {
    // Parse arguments
    const options = parseArgs();
    
    // Validate
    if (options.likes < 0 || options.matches < 0) {
      console.error('Error: Likes and matches must be positive numbers');
      process.exit(1);
    }
    
    if (options.likes === 0 && options.matches === 0) {
      console.error('Error: Must specify --likes and/or --matches');
      console.log('Use --help for usage information');
      process.exit(1);
    }
    
    // Connect to database
    if (!process.env.CONNECTION_STRING) {
      console.error('Error: CONNECTION_STRING not found in environment variables');
      process.exit(1);
    }
    
    console.log('📡 Connecting to database...');
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('✅ Connected to database\n');
    
    // Get all bot users
    const bots = await User.find({ isBot: true });
    
    if (bots.length === 0) {
      console.error('Error: No bot users found in database');
      console.log('Run "npm run seed" first to create bot users');
      process.exit(1);
    }
    
    // Print configuration
    printConfig(options, bots.length);
    
    // Clear existing interactions if requested
    if (options.clear) {
      await clearInteractions(options.verbose);
    }
    
    // Create likes
    let likes = [];
    if (options.likes > 0) {
      if (options.weighted) {
        likes = await createWeightedLikes(bots, options.likes, options.verbose);
      } else {
        likes = await createRandomLikes(bots, options.likes, options.verbose);
      }
    }
    
    // Create matches
    let matches = [];
    if (options.matches > 0) {
      matches = await createMatches(bots, options.matches, options.verbose);
    }
    
    // Print statistics
    printStats(likes, matches);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack && process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    // Disconnect from database
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Run main function
main();
