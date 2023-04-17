const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  sender: {
    memberId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    avi: {
      type: String,
      default: null
    },
    interests: {
      type: String
    },
    lastSeen: {
      type: Date,
    }
  },
  recipient: {
    memberId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    avi: {
      type: String,
      default: null
    },
    interests: {
      type: String
    },
    lastSeen: {
      type: Date,
    }
  },
  relationship: {
    type: String,
    required: true,
    default: function() {
      return `${this.sender.name} reports to ${this.recipient.name}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
