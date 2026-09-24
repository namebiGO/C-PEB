import mongoose from 'mongoose';

const creatorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      default: '',
    },
    displayName: {
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
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    languages: {
      type: [String],
      default: [],
    },
    primaryCategory: {
      type: String,
      default: '',
    },
    secondaryCategories: {
      type: [String],
      default: [],
    },
    contentTypes: {
      type: [String],
      default: [],
    },
    collaborationInterests: {
      type: [String],
      default: [],
    },
    primaryPlatform: {
      type: String,
      default: '',
    },
    audienceLocation: {
      type: String,
      default: '',
    },
    audienceAgeRange: {
      type: String,
      default: '',
    },
    accuracyConsent: {
      type: Boolean,
      default: false,
    },
    // New fields for Admin Management
    priority: {
      type: Number,
      default: 999, // default low priority
    },
    featured: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['VISIBLE', 'HIDDEN'],
      default: 'HIDDEN', // Default to hidden until explicitly made visible
    },
    imagePosition: {
      type: String,
      default: 'center',
    },
    followersExact: {
      type: Number,
      default: 0,
    },
    followersDisplay: {
      type: String,
      default: '',
    },
    followersUpdatedAt: {
      type: Date,
      default: null,
    },
    // Status tracking
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'],
      default: 'DRAFT',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    // Timestamps for audit
    submittedAt: {
      type: Date,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);

export default CreatorProfile;
