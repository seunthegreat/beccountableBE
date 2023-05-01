const express = require('express');
const router = express.Router();

const { createTemplate, deleteTemplate, updateTemplate, getTemplates } = require('../controllers/templateController');

router.post('/create-template', createTemplate);
router.get('/get-templates', getTemplates);
router.patch('/edit-template/:id', updateTemplate);
router.delete('/delete-template/:id', deleteTemplate);

module.exports = router;