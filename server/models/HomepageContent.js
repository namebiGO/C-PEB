import mongoose from 'mongoose';

const homepageContentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true }, // e.g. 'HERO', 'WHY_US', 'TESTIMONIALS', 'FAQ'
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true,
  }
);

const HomepageContent = mongoose.model('HomepageContent', homepageContentSchema);

export default HomepageContent;
