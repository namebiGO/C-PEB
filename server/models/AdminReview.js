import mongoose from 'mongoose';

const adminReviewSchema = new mongoose.Schema(
  {
    creatorProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreatorProfile',
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['APPROVED', 'CHANGES_REQUESTED', 'REJECTED'],
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const AdminReview = mongoose.model('AdminReview', adminReviewSchema);

export default AdminReview;
