import mongoose from 'mongoose';

const creatorPortfolioSchema = new mongoose.Schema(
  {
    creatorProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreatorProfile',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    campaignType: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CreatorPortfolio = mongoose.model('CreatorPortfolio', creatorPortfolioSchema);

export default CreatorPortfolio;
