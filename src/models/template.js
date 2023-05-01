const mongoose = require('mongoose');
//const  goalSchema = require('./goal'); // import the goalSchema from the goal.js file


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
});

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

const requirementSchema = new mongoose.Schema({
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
  submissionDate: {
    type: Date
  }, 
})

const templateSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    required: true,
  },
  creatorAvi: {
    type: String,
    default: null,
  },
  creatorName: {
    type: String,
    required: true,
  },
  displayImage: {
    type: String,
    default: null,
  },
  price: {
    type: mongoose.Schema.Types.Mixed,
    enum: ['Free', Number],
    default: 'Free',
    required: true,
  },
  goal: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    requirements: {
      type: [requirementSchema],
      default: []
    },
    okrs: {
      type: [okrSchema],
      default: [],
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['General', 'Technology', 'Health', 'Career'],
      default: 'General'
    },
  }
});

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;