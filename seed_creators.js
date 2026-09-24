import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Influencer from './server/models/Influencer.js';
import CreatorProfile from './server/models/CreatorProfile.js';
import SocialAccount from './server/models/SocialAccount.js';
import User from './server/models/User.js';
import { CREATORS_DATA } from './src/data/creatorsData.js';

dotenv.config({ path: './server/.env' });

async function seedCreators() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const c of CREATORS_DATA) {
      // 1. Ensure or update Influencer record
      await Influencer.findOneAndUpdate(
        { slug: c.slug },
        {
          name: c.name,
          slug: c.slug,
          category: c.category,
          followers: c.followersDisplay,
          location: `${c.city}, ${c.state}`,
          profileImage: c.profileImage,
          bio: c.bio,
          instagramUrl: c.instagramUrl,
          isActive: true,
          isFeatured: true
        },
        { upsert: true, new: true }
      );

      // 2. Ensure mock User for CreatorProfile
      const email = `${c.slug}@c-peb.in`;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: c.name,
          email,
          passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklm', // mock hash
          role: 'CREATOR'
        });
      }

      // 3. Upsert CreatorProfile
      const profile = await CreatorProfile.findOneAndUpdate(
        { slug: c.slug },
        {
          userId: user._id,
          fullName: c.name,
          displayName: c.displayName,
          slug: c.slug,
          bio: c.bio,
          profileImage: c.profileImage,
          email,
          city: c.city,
          state: c.state,
          country: c.country,
          primaryCategory: c.primaryCategory,
          secondaryCategories: c.secondaryCategories,
          primaryPlatform: c.primaryPlatform,
          status: 'APPROVED',
          isPublic: true,
          approvedAt: new Date(c.checkedAt)
        },
        { upsert: true, new: true }
      );

      // 4. Upsert SocialAccount
      await SocialAccount.deleteMany({ creatorProfileId: profile._id });
      await SocialAccount.create({
        creatorProfileId: profile._id,
        platform: 'Instagram',
        username: c.instagramUsername,
        profileUrl: c.instagramUrl,
        followers: c.followersDisplay,
        isVerified: true
      });

      console.log(`Seeded creator: ${c.name} (@${c.instagramUsername})`);
    }

    console.log('All 10 creators seeded successfully in DB!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding creators:', err);
    process.exit(1);
  }
}

seedCreators();
