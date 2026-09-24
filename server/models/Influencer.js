import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    instagramUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    tiktokUrl: { type: String, default: '' },
    
    // Stats
    followers: { type: String, default: '0' },
    following: { type: String, default: '0' },
    engagementRate: { type: String, default: '0%' },
    averageReach: { type: String, default: '0' },
    
    // System
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Influencer = mongoose.model('Influencer', influencerSchema);

export default Influencer;
