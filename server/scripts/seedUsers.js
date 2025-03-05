#!/usr/bin/env node

// Main bot user seeding script with CLI interface

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

import User from '../models/user.js';
import { generateUsers } from './generators/userGenerator.js';
import { clusters } from './data/genres.js';

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    count: 20,
    strategy: 'realistic',
    clear: false,
    customArtists: null,
    customGenres: null,
    dryRun: false,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--count':
        options.count = parseInt(args[++i], 10);
        break;
      case '--strategy':
        options.strategy = args[++i];
        break;
      case '--clear':
        options.clear = true;
        break;
      case '--customArtists':
        options.customArtists = parseCustomMap(args[++i]);
        break;
      case '--customGenres':
        options.customGenres = parseCustomMap(args[++i]);
        break;
      case '--dryRun':
        options.dryRun = true;
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

// Parse custom artist/genre maps like "Taylor Swift:40,Drake:30"
function parseCustomMap(str) {
  if (!str) return null;
  
  const map = {};
  const pairs = str.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    if (key && value) {
      map[key.trim()] = parseInt(value.trim(), 10);
    }
  }
  
  return Object.keys(map).length > 0 ? map : null;
}

// Print help message
function printHelp() {
  console.log(`
🎵 MelodyMatch Bot User Seeder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: node seedUsers.js [options]

Options:
  --count <number>              Number of bot users to create (default: 20)
  --strategy <type>             Music distribution strategy (default: realistic)
                                Options: diverse, clustered, realistic, custom
  --clear                       Delete all existing bot users before seeding
  --customArtists <string>      Custom artists with prevalence percentages
                                Format: "Artist1:40,Artist2:30,Artist3:20"
  --customGenres <string>       Custom genres with prevalence percentages
                                Format: "pop:50,hip-hop:40,indie:30"
  --dryRun                      Preview users without creating them
  --verbose                     Show detailed output
  --help                        Show this help message

Examples:
  # Create 20 users with realistic distribution
  npm run seed

  # Create 50 users with diverse distribution
  npm run seed -- --count 50 --strategy diverse

  # Create 30 users with clustered distribution
  npm run seed -- --count 30 --strategy clustered

  # Clear and create 40 users with custom artists
  npm run seed -- --clear --count 40 --strategy custom \\
    --customArtists "Taylor Swift:60,Drake:50,Billie Eilish:40"

  # Dry run to preview
  npm run seed -- --dryRun --verbose --count 10

Strategies:
  diverse    - Evenly distributed across all genres
  clustered  - Creates 4 distinct music communities
  realistic  - Mirrors real-world listening patterns
  custom     - User-defined with artist/genre prevalence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

// Print configuration
function printConfig(options) {
  console.log(`\n🎵 MelodyMatch Bot User Seeder`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Configuration:`);
  console.log(`  Strategy: ${options.strategy}`);
  console.log(`  Count: ${options.count} users`);
  console.log(`  Clear existing: ${options.clear ? 'Yes' : 'No'}`);
  
  if (options.customArtists) {
    console.log(`  Custom artists: ${Object.keys(options.customArtists).length} specified`);
  }
  if (options.customGenres) {
    console.log(`  Custom genres: ${Object.keys(options.customGenres).length} specified`);
  }
  if (options.dryRun) {
    console.log(`  Mode: DRY RUN (no database changes)`);
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// Clear existing bot users
async function clearBots(verbose) {
  if (verbose) {
    console.log(`🗑️  Clearing existing bot users...`);
  }
  
  const result = await User.deleteMany({ isBot: true });
  
  if (verbose) {
    console.log(`✅ Deleted ${result.deletedCount} existing bot users\n`);
  }
  
  return result.deletedCount;
}

// Create bot users
async function createBots(users, verbose) {
  if (verbose) {
    console.log(`🎨 Generating ${users.length} bot users...\n`);
  }
  
  // Insert users in batch
  const createdUsers = await User.insertMany(users);
  
  return createdUsers;
}

// Print user details (for verbose mode)
function printUser(user, index, total) {
  console.log(`👤 User ${index}/${total}: ${user.name} (${user.email})`);
  console.log(`   Age: ${user.age} | Gender: ${user.gender} | Country: ${user.country}`);
  console.log(`   Genres: ${user.genres.slice(0, 4).join(', ')}${user.genres.length > 4 ? '...' : ''}`);
  console.log(`   Artists: ${user.artists.slice(0, 3).join(', ')}${user.artists.length > 3 ? ` (+${user.artists.length - 3} more)` : ''}`);
  console.log(`   Profile pic: ${user.profile_pic ? 'Yes' : 'No'}`);
  console.log();
}

// Print statistics
function printStats(users, options) {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`✅ Successfully ${options.dryRun ? 'generated' : 'created'} ${users.length} bot users!\n`);
  console.log(`📊 Summary:`);
  console.log(`  Total users: ${users.length}`);
  console.log(`  Strategy: ${options.strategy}`);
  
  // Gather statistics
  const uniqueGenres = new Set();
  const uniqueArtists = new Set();
  const genderCounts = { male: 0, female: 0, 'non-binary': 0 };
  const withPics = users.filter(u => u.profile_pic).length;
  
  users.forEach(user => {
    user.genres.forEach(g => uniqueGenres.add(g));
    user.artists.forEach(a => uniqueArtists.add(a));
    genderCounts[user.gender]++;
  });
  
  console.log(`  Unique genres: ${uniqueGenres.size}`);
  console.log(`  Unique artists: ${uniqueArtists.size}`);
  console.log(`  With profile pics: ${withPics} (${Math.round(withPics / users.length * 100)}%)`);
  console.log(`\n  Gender distribution:`);
  console.log(`    Male: ${genderCounts.male} (${Math.round(genderCounts.male / users.length * 100)}%)`);
  console.log(`    Female: ${genderCounts.female} (${Math.round(genderCounts.female / users.length * 100)}%)`);
  console.log(`    Non-binary: ${genderCounts['non-binary']} (${Math.round(genderCounts['non-binary'] / users.length * 100)}%)`);
  
  // Strategy-specific stats
  if (options.strategy === 'clustered') {
    console.log(`\n  Cluster distribution:`);
    const clusterNames = Object.keys(clusters);
    const usersPerCluster = Math.ceil(users.length / clusterNames.length);
    clusterNames.forEach((clusterKey, index) => {
      const cluster = clusters[clusterKey];
      const count = Math.min(usersPerCluster, users.length - (index * usersPerCluster));
      console.log(`    ${cluster.name}: ${count} users (${Math.round(count / users.length * 100)}%)`);
    });
  }
  
  console.log(`\n🔐 Bot Credentials:`);
  console.log(`  Format: bot{N}@melodymatch.test`);
  console.log(`  Password: TestPass123!`);
  console.log(`  Range: bot1 to bot${users.length}`);
  
  if (!options.dryRun) {
    console.log(`\n💡 Test the bots:`);
    console.log(`  - Login at /backendlogin with any bot credentials`);
    console.log(`  - View user list: GET /getUsers?userId={any_bot_id}`);
    console.log(`  - Check matching: All bots are ready for likes/matches`);
    console.log(`  - Seed interactions: npm run seed:interactions`);
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// Main function
async function main() {
  try {
    // Parse arguments
    const options = parseArgs();
    
    // Validate
    if (options.count < 0) {
      console.error('Error: Count must be a positive number');
      process.exit(1);
    }
    
    if (!['diverse', 'clustered', 'realistic', 'custom'].includes(options.strategy)) {
      console.error(`Error: Invalid strategy "${options.strategy}"`);
      console.error('Valid strategies: diverse, clustered, realistic, custom');
      process.exit(1);
    }
    
    if (options.strategy === 'custom' && !options.customArtists && !options.customGenres) {
      console.error('Error: Custom strategy requires --customArtists or --customGenres');
      process.exit(1);
    }
    
    // Print configuration
    printConfig(options);
    
    // Generate users
    const users = generateUsers(options.count, options.strategy, {
      customArtists: options.customArtists,
      customGenres: options.customGenres
    });
    
    // If dry run, just print and exit
    if (options.dryRun) {
      if (options.verbose) {
        users.forEach((user, index) => printUser(user, index + 1, users.length));
      }
      printStats(users, options);
      return;
    }
    
    // Connect to database
    if (!process.env.CONNECTION_STRING) {
      console.error('Error: CONNECTION_STRING not found in environment variables');
      process.exit(1);
    }
    
    console.log('📡 Connecting to database...');
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('✅ Connected to database\n');
    
    // Clear existing bots if requested
    if (options.clear) {
      await clearBots(options.verbose);
    }
    
    // Create bots
    const createdUsers = await createBots(users, options.verbose);
    
    // Print verbose output if requested
    if (options.verbose) {
      createdUsers.forEach((user, index) => printUser(user, index + 1, createdUsers.length));
    }
    
    // Print statistics
    printStats(createdUsers, options);
    
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
