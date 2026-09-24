import mongoose from 'mongoose';

const creatorApplicationSchema = new mongoose.Schema(
  {
    // ── Required fields ────────────────────────────
    creatorName: {
      type: String,
      required: true,
      trim: true,
    },
    instagram: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Optional fields ────────────────────────────
    email: {
      type: String,
      default: '',
      trim: true,
    },
    youtube: {
      type: String,
      default: '',
      trim: true,
    },
    otherSocial: {
      type: String,
      default: '',
      trim: true,
    },

    // ── Status ─────────────────────────────────────
    status: {
      type: String,
      enum: ['PENDING_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'],
      default: 'PENDING_REVIEW',
    },

    // ── Admin notes ────────────────────────────────
    adminNotes: {
      type: String,
      default: '',
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CreatorApplication = mongoose.model('CreatorApplication', creatorApplicationSchema);

export default CreatorApplication;
