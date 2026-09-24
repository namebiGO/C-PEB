import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['ADMIN', 'CUSTOMER'],
    default: 'ADMIN'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const supportRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  requirement: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN REVIEW', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  prioritySupport: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  adminNotes: {
    type: String,
    default: ''
  },
  replies: [replySchema]
});

const advisorySubscriptionSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    businessName: {
      type: String,
      required: [true, 'Business or startup name is required'],
      trim: true
    },
    requirement: {
      type: String,
      required: [true, 'Requirement details are required'],
      trim: true
    },
    plan: {
      type: String,
      enum: ['ONE_MONTH', 'THREE_MONTHS'],
      required: true
    },
    planTitle: {
      type: String,
      default: 'Starter Advisory (1 Month)'
    },
    amount: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      default: '1 Month'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'FAILED'],
      default: 'PAID'
    },
    paymentMethod: {
      type: String,
      default: 'Direct / UPI'
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    prioritySupport: {
      type: Boolean,
      default: true
    },
    supportStatus: {
      type: String,
      enum: ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED'],
      default: 'ACTIVE'
    },
    requests: [supportRequestSchema],
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Method to check and update expiration status
advisorySubscriptionSchema.methods.updateStatusBasedOnDate = function () {
  const now = new Date();
  const daysRemaining = Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24));
  if (daysRemaining <= 0) {
    this.supportStatus = 'EXPIRED';
  } else if (daysRemaining <= 7) {
    this.supportStatus = 'EXPIRING_SOON';
  } else {
    this.supportStatus = 'ACTIVE';
  }
};

const AdvisorySubscription = mongoose.model('AdvisorySubscription', advisorySubscriptionSchema);

export default AdvisorySubscription;
