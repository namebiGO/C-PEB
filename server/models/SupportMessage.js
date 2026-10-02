import mongoose from 'mongoose';

// Individual messages in the conversation thread for a SupportQuery
const supportMessageSchema = new mongoose.Schema(
  {
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportQuery',
      required: true,
    },
    // Either 'USER' or 'ADMIN'
    senderType: {
      type: String,
      enum: ['USER', 'ADMIN'],
      required: true,
    },
    // If admin, reference to who sent it
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminName: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    // Optional: track if user has seen admin reply
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

supportMessageSchema.index({ queryId: 1, createdAt: 1 });

const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);

export default SupportMessage;
