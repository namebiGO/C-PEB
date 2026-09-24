import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Influencer from './server/models/Influencer.js';
import Service from './server/models/Service.js';

dotenv.config({ path: './server/.env' });

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const infs = await Influencer.find().limit(4);

    await Service.deleteMany({}); // clear services

    // Add 4 Featured Services
    await Service.create([
      { title: 'Dedicated Instagram Reel', slug: 'dedicated-instagram-reel', category: 'Video', price: 15000, rating: 4.9, reviews: 120, img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600', isFeatured: true, influencerId: infs[0]._id },
      { label: 'Top Rated', title: 'YouTube Integration', slug: 'youtube-integration', category: 'Video', price: 45000, rating: 5.0, reviews: 89, img: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=600', isFeatured: true, influencerId: infs[1]._id },
      { title: 'Brand Ambassadorship', slug: 'brand-ambassadorship', category: 'Campaign', price: 150000, rating: 4.8, reviews: 34, img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', isFeatured: true, influencerId: infs[2]._id },
      { title: 'Product Photography', slug: 'product-photography', category: 'Photo', price: 20000, rating: 4.7, reviews: 56, img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600', isFeatured: true, influencerId: infs[3]._id }
    ]);

    console.log('Services seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
seedServices();
