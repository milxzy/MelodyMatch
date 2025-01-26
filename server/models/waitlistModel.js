import mongoose from "mongoose"

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['waiting', 'approved', 'rejected'],
    default: 'waiting',
  },
});

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;
