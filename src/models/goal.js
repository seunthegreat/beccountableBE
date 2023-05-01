const mongoose = require('mongoose');

const keyResultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date
  },
  submissionDate: {
    type: Date
  },
  submissionLinks: [{
    link: {
      type: String,
    }
  }],
  submissionFiles: [{
    file: {
      type: String,
    },
    type: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'mp4']
      }
    }]
})

const okrSchema = new mongoose.Schema({
  objective: {
    type: String,
    required: true
  },
  keyResults: {
    type: [keyResultSchema],
    required: true,
    default: []
  }
});

const partnerSchema = new mongoose.Schema({
  name: {
  type: String,
    required: true
  },
  avi: {
    type: String,
    default: null
  },
  memberId: {
    type: String,
    default: null
  },
  agreed: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    required: true
  }
});

const goalSchema = new mongoose.Schema({
  memberId: {
    type: String,
  },
  avi: {
    type: String,
    default: null
  },
  name: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
  },
  okrs: {
    type: [okrSchema],
    default: []
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'Technology', 'Health', 'Career'],
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  stake: {
    type: String,
    enum: ['money', 'reputation'],
  },  
  status: {
    type: String,
    enum: ['ongoing', 'pending','completed', 'in-review', 'forfeited'] ,
    default: 'in-review'
  },
  partner: partnerSchema,
});


const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
