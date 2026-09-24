import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Influencer from './server/models/Influencer.js';
import Service from './server/models/Service.js';

dotenv.config({ path: './server/.env' });

async function fixImagesHighRes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Super high quality, professional editorial portraits
    const infUrls = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=90', // Priya (Fashion)
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=90', // Rohan (Gaming)
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90', // Anika (Beauty)
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=90'  // Vikram (Lifestyle)
    ];

    const infs = await Influencer.find().sort({ _id: 1 });
    for (let i = 0; i < infs.length; i++) {
      if (infUrls[i]) {
        infs[i].profileImage = infUrls[i];
        await infs[i].save();
      }
    }

    // Super high quality service images
    const srvUrls = [
      'https://images.unsplash.com/photo-1579362758151-512fb9471166?auto=format&fit=crop&w=800&q=90', // Instagram Reel
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=90', // YouTube
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=90', // Brand Ambassadorship
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=90'  // Product Photo
    ];

    const srvs = await Service.find().sort({ _id: 1 });
    for (let i = 0; i < srvs.length; i++) {
      if (srvUrls[i]) {
        srvs[i].image = srvUrls[i];
        await srvs[i].save();
      }
    }

    console.log('High-res images fixed!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
fixImagesHighRes();
