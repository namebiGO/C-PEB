import mongoose from 'mongoose';

const socialAccountSchema = new mongoose.Schema(
  {
    creatorProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreatorProfile',
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['Instagram', 'YouTube', 'Facebook', 'TikTok', 'LinkedIn', 'X', 'Other'],
    },
    username: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      required: true,
    },
    followers: {
      type: String,
      default: '0',
    },
    averageViews: {
      type: String,
      default: '',
    },
    engagementRate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);

export default SocialAccount;
