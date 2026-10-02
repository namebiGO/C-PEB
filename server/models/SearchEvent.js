import mongoose from 'mongoose';

// Tracks every meaningful search/discovery event on the public site
const searchEventSchema = new mongoose.Schema(
  {
    // What the user typed
    query: {
      type: String,
      default: '',
      trim: true,
    },
    // Filters applied
    category: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    // If the user clicked a specific profile after searching
    creatorProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreatorProfile',
      default: null,
    },
    // Type of event
    eventType: {
      type: String,
      enum: ['SEARCH', 'PROFILE_VIEW', 'PROFILE_CLICK', 'CATEGORY_BROWSE', 'LOCATION_BROWSE'],
      default: 'SEARCH',
    },
    // Anonymous session tracking (no PII)
    sessionId: {
      type: String,
      default: '',
    },
    // Result count returned
    resultCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast aggregation queries
searchEventSchema.index({ creatorProfileId: 1 });
searchEventSchema.index({ createdAt: -1 });
searchEventSchema.index({ category: 1 });
searchEventSchema.index({ location: 1 });
searchEventSchema.index({ eventType: 1 });

const SearchEvent = mongoose.model('SearchEvent', searchEventSchema);

export default SearchEvent;
