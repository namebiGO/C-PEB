import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    // Wizard step 1
    identity: {
      type: String,
      enum: ['Brand', 'Creator', 'Startup'],
      required: [true, 'Identity is required'],
    },
    // Wizard step 2
    goal: {
      type: String,
      required: [true, 'Goal is required'],
    },
    // Wizard step 3
    budget: {
      type: String,
      required: [true, 'Budget is required'],
    },
    // Wizard step 4
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    // Internal tracking
    status: {
      type: String,
      enum: ['new', 'in-progress', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
