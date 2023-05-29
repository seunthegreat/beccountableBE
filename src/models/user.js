const mongoose = require('mongoose');
const ROLES_LIST = {
  "Admin": 2023,
  "Creator": 2020,
  "User": 1998
};

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
    unique: true,
    sparse: true
  },
  bio: {
    type: String,
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: [Number],
    enum: Object.values(ROLES_LIST),
    default: [ROLES_LIST.User]
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
    type: [String],
  },
  refreshToken: {
    type:String,
  }, 
  category: {
    type: String,
    default: 'General'
  },
  followers: [{
    memberId: {
      type: String,
      required: true
    },
    name: String,
    category: {
      type: String,
      default: 'General'
    },
    avi: String
  }],
  following: [{
    memberId: {
      type: String,
      required: true
    },
    name: String,
    category: {
      type: String,
      default: 'General'
    },
    avi: String
  }],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  totalStakes: { type: Number, default: 0 },
  totalPayouts: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
