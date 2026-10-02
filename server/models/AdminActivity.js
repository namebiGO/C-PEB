import mongoose from 'mongoose';

// General admin audit trail — records every important admin action
const adminActivitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminName: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true,
      // e.g. APPROVED_CREATOR, REJECTED_CREATOR, RESOLVED_QUERY, UPDATED_SETTINGS
    },
    entityType: {
      type: String,
      enum: ['CREATOR_PROFILE', 'CREATOR_APPLICATION', 'INFLUENCER', 'QUERY', 'LEAD', 'USER', 'SETTINGS', 'SYSTEM'],
      required: true,
    },
    entityId: {
      type: String, // can be ObjectId stringified or any ID
      default: '',
    },
    entityName: {
      type: String,
      default: '',
    },
    // Additional context (reason, note, etc.)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

adminActivitySchema.index({ adminId: 1 });
adminActivitySchema.index({ createdAt: -1 });
adminActivitySchema.index({ entityType: 1 });

const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);

export default AdminActivity;
