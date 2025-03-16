import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.CONNECTION_STRING || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/melodymatch';

/**
 * Migration script to fix allowedAccess field that was incorrectly set as array
 */
async function fixAllowedAccess() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users with array allowedAccess
    const usersWithArrayAccess = await usersCollection.find({
      allowedAccess: { $type: 'array' }
    }).toArray();

    console.log(`Found ${usersWithArrayAccess.length} users with array allowedAccess`);

    if (usersWithArrayAccess.length === 0) {
      console.log('No users need fixing');
      await mongoose.connection.close();
      return;
    }

    // Fix each user
    for (const user of usersWithArrayAccess) {
      const arrayValue = user.allowedAccess;
      let booleanValue = false;

      // Convert array to boolean
      if (Array.isArray(arrayValue) && arrayValue.length > 0) {
        booleanValue = arrayValue[0] === true || arrayValue[0] === 'true';
      }

      console.log(`Fixing user ${user._id}: ${JSON.stringify(arrayValue)} -> ${booleanValue}`);

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { allowedAccess: booleanValue } }
      );
    }

    console.log('✓ Successfully fixed all users');
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error fixing allowedAccess:', error);
    process.exit(1);
  }
}

// Run the migration
fixAllowedAccess();
