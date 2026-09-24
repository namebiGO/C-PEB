import mongoose from 'mongoose';

const advisoryPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String, // e.g., '1 Month', '3 Months'
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    prioritySupport: {
      type: Boolean,
      default: true,
    },
    features: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    displayOrder: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const AdvisoryPlan = mongoose.model('AdvisoryPlan', advisoryPlanSchema);

export default AdvisoryPlan;
