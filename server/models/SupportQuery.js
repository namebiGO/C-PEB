import mongoose from 'mongoose';

// A support/query ticket raised by a user
const supportQuerySchema = new mongoose.Schema(
  {
    // Submitter details (no auth required — public form)
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    // If the query is about a specific creator/influencer
    relatedCreatorSlug: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['INFLUENCER_PROFILE', 'COLLABORATION', 'BILLING', 'TECHNICAL', 'GENERAL', 'OTHER'],
      default: 'GENERAL',
    },
    // Initial message from the user
    initialMessage: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    // Admin assigned to handle this
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Resolution notes
    resolutionNote: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

supportQuerySchema.index({ status: 1 });
supportQuerySchema.index({ priority: 1 });
supportQuerySchema.index({ createdAt: -1 });
supportQuerySchema.index({ email: 1 });

const SupportQuery = mongoose.model('SupportQuery', supportQuerySchema);

export default SupportQuery;
