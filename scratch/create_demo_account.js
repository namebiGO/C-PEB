import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://itsdevamit_db_user:vy43yhiaHSfQRdTI@c-peb.2arcrq6.mongodb.net/cpeb?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'CREATOR'], default: 'CREATOR' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

async function createDemoUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected.');

    const email = 'creator@cpeb.com';
    const password = 'password123';
    const name = 'Demo Influencer';

    let user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (user) {
      user.passwordHash = passwordHash;
      user.name = name;
      user.role = 'CREATOR';
      await user.save();
      console.log('Updated existing demo account:');
    } else {
      user = await User.create({
        name,
        email,
        passwordHash,
        role: 'CREATOR'
      });
      console.log('Created new demo account:');
    }

    console.log('---------------------------------');
    console.log('Email:    ' + email);
    console.log('Password: ' + password);
    console.log('Role:     ' + user.role);
    console.log('User ID:  ' + user._id);
    console.log('---------------------------------');

    await mongoose.disconnect();
    console.log('Disconnected successfully.');
  } catch (error) {
    console.error('Error creating demo account:', error);
    process.exit(1);
  }
}

createDemoUser();
