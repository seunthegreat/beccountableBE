const Partner = require('../models/partners');
const User = require("../models/user");

const getReportingTo = async (req, res) => {
    const { memberId } = req.params;
  
    try {
      // Find all partner requests where sender.memberId matches the memberId parameter
      const partners = await Partner.find({ 'sender.memberId': memberId });
  
      // Get the lastSeen for each user and add it to the response
      const partnerWithUpdatedLastSeen = await Promise.all(partners.map(async (request) => {
        const recipientUser = await User.findOne({ memberId: request.recipient.memberId });
  
        return {
          _id: request._id,
          memberId: recipientUser.memberId,
          name: recipientUser.name,
          email: recipientUser.email,
          avi: recipientUser.avi,
          interests: recipientUser.interests,
          lastSeen: recipientUser.lastSeen,
          relationship: request.relationship,
          createdAt: request.createdAt,
        };
      }));
  
      // Send the partner requests with lastSeen as a response
      res.status(200).json({
        success: true, 
        message: "List of all members user reports to",
        data: partnerWithUpdatedLastSeen
      });
    } catch (error) {
      // Send an error response if something goes wrong
      res.status(500).json({ error: error.message });
    }
  };
  
  

module.exports = { getReportingTo }