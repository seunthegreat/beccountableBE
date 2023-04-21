const express = require('express');
const router = express.Router();

const { createPartnerRequest, getPartnerRequests, acceptPartnerRequest, 
  declinePartnerRequest , deletePartnerRequest} = require("../controllers/partnerRequestController");
const { getReportingTo, getMembersUserReports } = require('../controllers/partnerController');

router.post('/partner-request', createPartnerRequest); 
router.get('/partner-requests/:memberId', getPartnerRequests);
router.put('/partner-requests/:requestId/accept', acceptPartnerRequest);
router.put('/partner-requests/:requestId/decline', declinePartnerRequest);
router.delete('/partner-requests/:requestId/delete', deletePartnerRequest);

router.get('/:memberId/members-reporting-to', getReportingTo);
router.get('/:memberId/members-user-reports', getMembersUserReports);

module.exports = router;