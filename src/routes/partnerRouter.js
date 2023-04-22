const express = require('express');
const router = express.Router();

const { createPartnerRequest, getPartnerRequests, acceptPartnerRequest, getPendingPartnerRequests,
  declinePartnerRequest , deletePartnerRequest, getSentRequests} = require("../controllers/partnerRequestController");
const { getReportingTo, getMembersUserReports } = require('../controllers/partnerController');

router.post('/partner-request', createPartnerRequest); 
router.get('/partner-requests/:memberId', getPartnerRequests);
router.get('/sent-requests/:memberId', getSentRequests);
router.get('/pending-requests/:memberId', getPendingPartnerRequests);
router.put('/partner-requests/:memberId/accept/:requestId', acceptPartnerRequest);
router.put('/partner-requests/:requestId/decline', declinePartnerRequest);
router.delete('/partner-requests/:requestId/delete', deletePartnerRequest);

router.get('/:memberId/members-reporting-to', getReportingTo);
router.get('/:memberId/members-user-reports', getMembersUserReports);

module.exports = router;