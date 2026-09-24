import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Influencer from './server/models/Influencer.js';
import Service from './server/models/Service.js';

dotenv.config({ path: './server/.env' });

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const infUrls = [
      'https://randomuser.me/api/portraits/women/10.jpg',
      'https://randomuser.me/api/portraits/men/11.jpg',
      'https://randomuser.me/api/portraits/women/22.jpg',
      'https://randomuser.me/api/portraits/men/33.jpg'
    ];

    const infs = await Influencer.find().sort({ _id: 1 });
    for (let i = 0; i < infs.length; i++) {
      if (infUrls[i]) {
        infs[i].profileImage = infUrls[i];
        await infs[i].save();
      }
    }

    const srvUrls = [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600'
    ];

    const srvs = await Service.find().sort({ _id: 1 });
    for (let i = 0; i < srvs.length; i++) {
      if (srvUrls[i]) {
        srvs[i].image = srvUrls[i];
        await srvs[i].save();
      }
    }

    console.log('Images fixed!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
fixImages();
