# 🎵 MelodyMatch Bot User Seeding System

Comprehensive bot user generation and interaction seeding for testing the MelodyMatch application.

## Overview

This system allows you to quickly generate realistic bot users with diverse music tastes and simulate user interactions (likes and matches) for comprehensive testing of all MelodyMatch features.

## Table of Contents

- [Quick Start](#quick-start)
- [Bot User Seeding](#bot-user-seeding)
- [Interaction Seeding](#interaction-seeding)
- [Music Diversity Strategies](#music-diversity-strategies)
- [Custom Artist/Genre Prevalence](#custom-artistgenre-prevalence)
- [NPM Scripts Reference](#npm-scripts-reference)
- [Bot User Structure](#bot-user-structure)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Create Bot Users

```bash
# Navigate to server directory
cd server

# Create 20 bot users with realistic music distribution
npm run seed

# Create 50 bot users with clustered distribution
npm run seed:clustered
```

### 2. Create Interactions

```bash
# Create 100 random likes between bots
npm run seed:likes

# Create 30 mutual matches
npm run seed:matches

# Create weighted likes + matches
npm run seed:interactions -- --weighted --likes 80 --matches 20
```

### 3. Test with Bots

```bash
# Login credentials
Email: bot1@melodymatch.test (or bot2, bot3, etc.)
Password: TestPass123!

# Login endpoint
POST /backendlogin
{
  "email": "bot1@melodymatch.test",
  "password": "TestPass123!"
}
```

---

## Bot User Seeding

### Command

```bash
node scripts/seedUsers.js [options]
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--count <number>` | number | 20 | Number of bot users to create |
| `--strategy <type>` | string | realistic | Music distribution strategy |
| `--clear` | flag | false | Delete all existing bot users first |
| `--customArtists <string>` | string | - | Custom artists with prevalence |
| `--customGenres <string>` | string | - | Custom genres with prevalence |
| `--dryRun` | flag | false | Preview without creating |
| `--verbose` | flag | false | Show detailed output |
| `--help` | flag | - | Show help message |

### Strategies

Available strategies: `diverse`, `clustered`, `realistic`, `custom`

See [Music Diversity Strategies](#music-diversity-strategies) section for details.

### Examples

```bash
# Basic usage (20 users, realistic strategy)
npm run seed

# 50 users with diverse music tastes
npm run seed -- --count 50 --strategy diverse

# Clear all bots and create 30 new ones
npm run seed -- --clear --count 30

# Verbose output
npm run seed -- --verbose --count 20

# Dry run (preview without creating)
npm run seed -- --dryRun --count 10 --verbose
```

---

## Interaction Seeding

### Command

```bash
node scripts/seedInteractions.js [options]
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--likes <number>` | number | 0 | Number of one-way likes to create |
| `--matches <number>` | number | 0 | Number of mutual matches to create |
| `--weighted` | flag | false | Weight likes by compatibility score |
| `--clear` | flag | false | Clear all bot interactions first |
| `--verbose` | flag | false | Show detailed output |
| `--help` | flag | - | Show help message |

### Interaction Types

**Likes (One-Way)**
- User A likes User B (not mutual)
- Updates `likedUsers` and `likedBy` arrays
- Can be random or weighted by compatibility

**Matches (Mutual)**
- User A ↔ User B (both like each other)
- Creates Match document in database
- Enables messaging between users

**Weighted Mode**
- Uses compatibility algorithm to calculate match percentage
- Higher compatibility = higher probability of like
- Creates more realistic interaction patterns

### Examples

```bash
# Create 100 random likes
npm run seed:interactions -- --likes 100

# Create 50 weighted likes
npm run seed:interactions -- --weighted --likes 50

# Create 20 mutual matches
npm run seed:interactions -- --matches 20

# Full setup: clear + likes + matches
npm run seed:interactions -- --clear --weighted --likes 80 --matches 15 --verbose
```

---

## Music Diversity Strategies

### 1. Diverse Distribution

**When to use:** General testing, ensures all match compatibility levels are represented

**Behavior:**
- Evenly distributed across all 20+ genres
- Each user gets 3-5 random genres
- 10-15 artists per user from various genres
- Tests full spectrum of matching (0-100% compatibility)

```bash
npm run seed:diverse
# or
npm run seed -- --strategy diverse --count 30
```

### 2. Clustered Distribution

**When to use:** Testing high compatibility matching, "perfect match" scenarios

**Behavior:**
- Creates 4 distinct music communities:
  - **Indie/Alternative** (25% of users)
  - **Hip-Hop/R&B** (25% of users)
  - **Rock/Metal** (25% of users)
  - **Pop/Electronic** (25% of users)
- Users within same cluster have 60-90% compatibility
- Users across clusters have 10-40% compatibility
- 2-3 primary genres + 1-2 secondary genres per user
- 12-18 artists per user (more focused)

```bash
npm run seed:clustered
# or
npm run seed -- --strategy clustered --count 40
```

### 3. Realistic Distribution

**When to use:** Production-like testing environment, realistic user base

**Behavior:**
- Mirrors real-world Spotify listening patterns
- Popular genres get more representation:
  - Pop: 30% probability
  - Hip-Hop: 25% probability
  - Rock: 20% probability
  - Electronic: 15% probability
  - Other genres: 10% probability
- 3-5 genres per user (weighted selection)
- 10-15 artists per user
- Some genre overlap for medium compatibility

```bash
npm run seed:realistic
# or
npm run seed -- --strategy realistic --count 50
```

### 4. Custom Distribution

**When to use:** Targeted testing, specific matching scenarios

**Behavior:**
- User defines exact artists/genres with prevalence weights
- Percentage indicates how many users should have this artist/genre
- Allows overlap (users can have multiple custom items)
- Remaining slots filled with related artists from same genres

```bash
npm run seed -- --strategy custom --count 40 \
  --customArtists "Taylor Swift:60,Drake:50,Billie Eilish:40" \
  --customGenres "pop:70,hip-hop:50,indie:30"
```

---

## Custom Artist/Genre Prevalence

### Format

```
"Item1:percentage,Item2:percentage,Item3:percentage"
```

### How It Works

**Artist Prevalence:**
- Percentage = how many users get this artist
- Example: `"Drake:60"` with 50 users = 30 users (60%) will have Drake
- Multiple artists can be assigned to same user (overlap allowed)
- Remaining artist slots filled with artists from user's genres

**Genre Prevalence:**
- Percentage = how many users get this genre as primary genre
- Example: `"pop:80"` with 50 users = 40 users (80%) will have pop
- Users get 3-5 total genres (primary + related)
- Secondary genres added based on cluster relationships

### Examples

```bash
# Test Taylor Swift fans matching with Drake fans
npm run seed -- --strategy custom --count 50 \
  --customArtists "Taylor Swift:40,Drake:40" \
  --customGenres "pop:50,hip-hop:50"

# Create indie music community
npm run seed -- --strategy custom --count 30 \
  --customArtists "Tame Impala:70,Mac DeMarco:60,Clairo:50" \
  --customGenres "indie:90,alternative:60"

# Test niche genre matching
npm run seed -- --strategy custom --count 20 \
  --customGenres "jazz:100,classical:50,ambient:30"
```

### Prevalence Calculation

Given: 50 users, `"Artist:60"` (60% prevalence)

1. Calculate threshold: 60 / 100 = 0.6
2. For each user, generate random number (0-1)
3. If random < 0.6, assign artist to user
4. Result: ~30 users will have this artist

**Note:** Due to randomness, actual count may vary slightly (±2-3 users)

---

## NPM Scripts Reference

### User Seeding

```bash
npm run seed                 # 20 users, realistic strategy
npm run seed:clear           # Clear all bots
npm run seed:diverse         # 30 users, diverse strategy
npm run seed:clustered       # 40 users, clustered strategy
npm run seed:realistic       # 50 users, realistic strategy
```

### Interaction Seeding

```bash
npm run seed:interactions    # Interactive mode (requires args)
npm run seed:likes           # 100 random likes
npm run seed:matches         # 30 mutual matches
```

### Cleanup

```bash
npm run clear:bots           # Delete all bot users and interactions
```

### Custom Commands

```bash
# Pass custom arguments to seed script
npm run seed -- [options]

# Pass custom arguments to interaction script
npm run seed:interactions -- [options]
```

---

## Bot User Structure

### Database Schema Fields

```javascript
{
  // Credentials
  email: "bot1@melodymatch.test",
  password: "TestPass123!",  // bcrypt hashed automatically
  
  // Profile
  name: "Emma Rodriguez",
  age: "24",
  gender: "female",  // male, female, non-binary
  country: "US",
  
  // Spotify-like data
  spotify_id: "bot_spotify_001",
  spotify_display_name: "Emma Rodriguez",
  profile_pic: "https://i.pravatar.cc/300?img=1",  // or null
  
  // Music preferences
  genres: ["indie", "alternative", "indie pop", "bedroom pop"],
  artists: ["Clairo", "Mac DeMarco", "Tame Impala", ...],
  
  // Access control
  allowedAccess: true,
  isEmailVerified: true,
  isBot: true,  // Easy filtering
  
  // Relationships (empty by default)
  likedUsers: [],
  likedBy: [],
  blockedUsers: [],
  
  // Metadata
  preferences: {},
  isDeleted: false,
  lastActive: Date
}
```

### Characteristics

- **Email:** Sequential format `bot{N}@melodymatch.test`
- **Password:** All bots use `TestPass123!`
- **Spotify ID:** Format `bot_spotify_{N}` (3-digit padded)
- **Profile Pictures:** 70% have pictures, 30% are null (tests UI fallback)
- **Gender Distribution:** Equal (33% male, 33% female, 33% non-binary)
- **Age Range:** 18-45 years old (weighted toward younger users)
- **Countries:** Primarily US (60%), CA/UK/AU (30%), Others (10%)

---

## Examples

### Complete Workflow

```bash
# 1. Create 40 bot users with clustered music tastes
cd server
npm run seed:clustered

# 2. Create realistic interactions
npm run seed:interactions -- --weighted --likes 80 --matches 20

# 3. Test with a bot user
# Login as bot1@melodymatch.test / TestPass123!
# Browse matches at GET /getMatches/:userId
```

### Targeted Testing Scenarios

**Test High Compatibility Matches:**
```bash
npm run seed -- --strategy clustered --count 30
npm run seed:interactions -- --weighted --likes 50 --matches 15
```

**Test Low Compatibility Scenarios:**
```bash
npm run seed -- --strategy diverse --count 40
npm run seed:interactions -- --likes 100
```

**Test Specific Artist Communities:**
```bash
npm run seed -- --strategy custom --count 50 \
  --customArtists "Taylor Swift:80,Ariana Grande:70,Billie Eilish:60" \
  --customGenres "pop:90"
npm run seed:interactions -- --weighted --likes 100 --matches 30
```

**Test Niche Genres:**
```bash
npm run seed -- --strategy custom --count 20 \
  --customGenres "jazz:60,classical:40,ambient:30"
```

### Reset and Start Fresh

```bash
# Clear everything and rebuild
npm run clear:bots
npm run seed:realistic
npm run seed:interactions -- --likes 80 --matches 20
```

---

## Troubleshooting

### Issue: "CONNECTION_STRING not found"

**Solution:** Ensure `.env` file exists in `server/` directory with valid MongoDB connection string:

```env
CONNECTION_STRING=mongodb+srv://...
```

### Issue: "No bot users found in database"

**Solution:** Run user seeding first before interaction seeding:

```bash
npm run seed
npm run seed:interactions -- --likes 50
```

### Issue: Script hangs during seeding

**Solution:** Check MongoDB connection. Ensure database is accessible and credentials are correct.

```bash
# Test connection
cd server
node -e "import('./models/user.js')"
```

### Issue: Duplicate key error

**Solution:** Clear existing bots before seeding:

```bash
npm run seed -- --clear --count 30
```

### Issue: Can't login with bot credentials

**Solution:** 
1. Verify bot was created: Check MongoDB for users with `isBot: true`
2. Verify password: All bots use `TestPass123!`
3. Use backend login endpoint: `POST /backendlogin` (not Spotify OAuth)

### Issue: Not enough matches created

**Solution:** Increase interaction attempts or ensure enough bots exist:

```bash
# Need at least 2x bot users as desired matches
npm run seed -- --count 60
npm run seed:interactions -- --matches 30
```

### Filtering Bots in Database

```javascript
// Find all bots
db.users.find({ isBot: true })

// Find only real users
db.users.find({ isBot: { $ne: true } })

// Count bots
db.users.countDocuments({ isBot: true })

// Delete all bots
db.users.deleteMany({ isBot: true })
```

---

## Technical Details

### File Structure

```
server/scripts/
├── README.md                    # This file
├── seedUsers.js                 # Main user seeding script
├── seedInteractions.js          # Interaction seeding script
├── data/
│   ├── artists.js              # ~250 artists by genre
│   ├── genres.js               # 20+ genre definitions
│   └── demographics.js         # Names, ages, countries
└── generators/
    ├── userGenerator.js        # User object assembly
    ├── musicGenerator.js       # Music taste strategies
    └── nameGenerator.js        # Name/email/ID generation
```

### Music Data

- **Artists:** ~250 curated artists across 20+ genres
- **Genres:** Pop, Hip-Hop, Rock, Electronic, R&B, Indie, Metal, Country, Jazz, Classical, Latin, Punk, Folk, Soul, Reggae, Blues, Funk, Disco, Ambient, Experimental, Alternative
- **Subgenres:** Each genre has 3-6 subgenres for realism

### Matching Algorithm

Bot interactions use the same matching algorithm as the main app:

```javascript
// Compatibility = (genreSimilarity * 0.6) + (artistSimilarity * 0.4)
// Similarity = |Intersection| / |Union| (Jaccard coefficient)
```

**Compatibility Levels:**
- 80%+: Perfect Match
- 60-79%: Great Match
- 40-59%: Good Match
- 20-39%: Fair Match
- <20%: Low Match

---

## Support

For issues or questions:
1. Check this README
2. Run scripts with `--help` flag
3. Use `--verbose` flag for detailed output
4. Check server logs for errors

---

**Happy Testing! 🎵**
