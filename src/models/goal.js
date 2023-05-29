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
  memberId: {
    type: String,
  },
  avi: {
    type: String,
  },
  category: {
    type: String,
  },
  agreed: {
    type: Boolean,
    default: false
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
  title: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  starts: {
    type: Date,
    required: true
  },
  ends: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
  },
  keyResults: {
    type: [String],
    required: true
  },
  stakeAmount: {
    type: Number,
    required: true
  },
  status: {
    type: ['drafts','pending', 'ongoing','completed'],
    default: 'drafts'
  },
  partnerSchema: partnerSchema
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
