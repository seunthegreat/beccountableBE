const User = require('../models/user');
const Partner = require('../models/partners');
const PartnerRequest = require('../models/partnerRequest');

//-- Create a new partner request --//
const createPartnerRequest = async (req, res, next) => {
    try {
      const senderId = req.body.memberId;
      const { recipient } = req.body;
      const recipientUser = await User.findOne({
        $or: [{ username: recipient }, { email: recipient }]
      });
  
      if (!recipientUser) {
        return res.status(404).json({
          success: false,
          message: 'Recipient user not found'
        });
      }
  
      const partnerRequestExists = await PartnerRequest.findOne({
        senderId: senderId,
        recipientId: recipientUser.memberId
      });
  
      if (partnerRequestExists) {
        return res.status(409).json({
          success: false,
          message: 'Partner request already sent'
        });
      }
  
      const partnerRequest = new PartnerRequest({
        senderId: senderId,
        recipientId: recipientUser.memberId
      });
  
      await partnerRequest.save();
  
      res.status(201).json({
        success: true,
        message: 'Partner request created',
        partnerRequest: partnerRequest
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
};

//-- Gets all partner request for a user (by memberId) --//
const getPartnerRequests = async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const requests = await PartnerRequest.find({ recipientId: memberId }).populate('senderId', 'name email');
  
      if (requests.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No partner requests found'
        });
      }
  
      res.status(200).json({
        success: true,
        requests: requests
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
};

const acceptPartnerRequest = async (req, res) => {
  const requestId = req.params.requestId; // Get the ID of the request from the URL parameter
  const { memberId } = req.body; // Get the ID of the user who is accepting the request

  try {
    // Find the request by ID and update its status to "accepted"
    const partnerRequest = await PartnerRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
    );

    if (!partnerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Find the user who is accepting the partner request
    const acceptingUser = await User.findOne({ memberId });

    // Find the user who sent the partner request
    const senderUser = await User.findOne({
      memberId: partnerRequest.senderId,
    });

    // Create a new partner object with information from the sender and recipient of the request
    const newPartner = new Partner({
      sender: {
        memberId: senderUser.memberId,
        name: senderUser.name,
        email: senderUser.email,
        avi: senderUser.avi,
        interests: senderUser.interests,
        lastSeen: senderUser.lastSeen,
      },
      recipient: {
        memberId: acceptingUser.memberId,
        name: acceptingUser.name,
        email: acceptingUser.email,
        avi: acceptingUser.avi,
        interests: acceptingUser.interests,
        lastSeen: acceptingUser.lastSeen,
      },
    });

    // Save the new partner object to the database
    await newPartner.save();

    // Delete the partner request from the database
    await PartnerRequest.findByIdAndDelete(requestId);

    // Send a success response
    res.status(200).json({
      message: `Partner request from ${senderUser.name} has been accepted.`,
      newPartner,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({ error: error.message });
  }
};

  

module.exports = { createPartnerRequest, getPartnerRequests, acceptPartnerRequest }
