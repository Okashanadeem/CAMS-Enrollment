import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Manual env parsing since we might not have dotenv in devDependencies yet
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.match(/MONGODB_URI=(.*)/)?.[1]?.trim();

async function test() {
  if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
    console.error("❌ ERROR: You haven't replaced <username> or <password> in .env.local yet!");
    process.exit(1);
  }

  console.log("Connecting to:", MONGODB_URI.replace(/:([^:@]{1,})@/, ':****@')); 
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ SUCCESS: Connection to MongoDB Atlas established!");
    process.exit(0);
  } catch (err) {
    console.error("❌ CONNECTION FAILED!");
    console.error("Message:", err.message);
    console.log("\n--- Troubleshooting Tips ---");
    console.log("1. Check if the password contains special characters (@, #, etc). If so, URL-encode them.");
    console.log("   Example: '@' -> '%40', '#' -> '%23'");
    console.log("2. Ensure the user has 'Atlas Admin' or 'ReadWriteAnyDatabase' permissions in Atlas.");
    console.log("3. Verify that your IP is still whitelisted in the Atlas 'Network Access' tab.");
    process.exit(1);
  }
}

test();
