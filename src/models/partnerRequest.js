const mongoose = require('mongoose');

const partnerRequestSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  recipientId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PartnerRequest = mongoose.model('Partner_Request', partnerRequestSchema);

module.exports = PartnerRequest;
