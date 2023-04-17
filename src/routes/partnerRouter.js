const express = require('express');
const router = express.Router();

const { createPartnerRequest, getPartnerRequests, acceptPartnerRequest} = require("../controllers/partnerRequestController");
const { getReportingTo } = require('../controllers/partnerController');

router.post('/partner-request', createPartnerRequest); 
router.get('/partner-requests/:memberId', getPartnerRequests);
router.put('/partner-requests/:requestId/accept', acceptPartnerRequest);

router.get('/:memberId/reporting-to', getReportingTo);

module.exports = router;