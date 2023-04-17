const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  memberId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avi: {
    type: String,
    default: null
  },
  referralCode: {
    type: String,
    unique: true
  },
  bio: {
    type: String,
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  interests: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
