import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './server/models/User.js';

dotenv.config({ path: './server/.env' });

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const adminExists = await User.findOne({ email: 'admin@c-peb.com' });
    if (adminExists) {
      console.log('Admin already exists. The credentials are:');
      console.log('Email: admin@c-peb.com');
      console.log('Password: password123'); // assuming standard
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      await User.create({
        name: 'Site Admin',
        email: 'admin@c-peb.com',
        passwordHash,
        role: 'ADMIN',
      });
      console.log('Admin seeded successfully!');
      console.log('Email: admin@c-peb.com');
      console.log('Password: password123');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
seedAdmin();
