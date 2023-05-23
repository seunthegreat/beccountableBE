const express = require('express');
const router = express.Router();
const { 
  createTemplate, 
  deleteTemplate, 
  updateTemplate, 
  getTemplates,
  getTemplateSummary,
  getTemplatesByCreatorId } = require('../controllers/templateController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles'); 

router.post('/create-template',verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Creator), createTemplate);
router.get('/get-templates', getTemplates);
router.get('/get-templates-summary', getTemplateSummary);
router.get('/templates/:creatorId', getTemplatesByCreatorId);
router.patch('/edit-template/:id', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Creator), updateTemplate);
router.delete('/delete-template/:id', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Creator), deleteTemplate);

module.exports = router;