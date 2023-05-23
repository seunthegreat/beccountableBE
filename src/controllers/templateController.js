const Template = require('../models/template');

const createTemplate = async (req, res) => {
  try {
    const { creatorId, goal } = req.body;
    const existingTemplate = await Template.findOne({ creatorId, 'goal.title': goal.title });
  
    if (existingTemplate) {
      return res.status(409).json({
        success: false,
        message: 'Template already exists',
      });
    }
  
    const template = new Template(req.body);
    const savedTemplate = await template.save();

      res.status(201).json({
        success: true,
        message: `New template was created by ${creatorId}`,
        goal: savedTemplate,
      });
  
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Something went wrong',
        error: error
      });
  }
};

const updateTemplate = async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Missing template Id',
        });
      }
  
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing request body',
        });
      }
  
      const updatedTemplate = await Template.findByIdAndUpdate(
        id, { $set: req.body }, { new: true });
  
      if (!updatedTemplate) {
        return res.status(404).json({
          success: false,
          message: 'Template not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Template updated successfully',
        template: updatedTemplate,
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error,
      });
    }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({});
    res.status(200).json({
      success: true,
      message: 'Templates fetched successfully',
      templates,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error,
      });
    }
};

const getTemplateSummary = async (req, res) => {
  try {
    const templates = await Template.find({});
    const templateSummary = templates.map((template, index) => {
      return {
        id: index + 1, 
        creatorName: template.creatorName,
        creatorId: template.creatorId,
        goal: template.goal.title,
        results: template.goal.keyResults.length,
        requirements: template.goal.requirements.length,
        duration: template.goal.duration
      };
    });
     res.status(200).json({
      success: true,
      message: 'Template summary fetched successfully',
      templateSummary,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error,
      });
    }
};

const getTemplatesByCreatorId = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const templates = await Template.find({ creatorId });
    res.status(200).json({
      success: true,
      message: 'Templates fetched successfully',
      templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};
  
const deleteTemplate = async (req, res) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete(req.params.id);
    if (!deletedTemplate) {
      return res.status(404).send({
        success: false,
        message: 'Template not found'
      });
    }
    res.json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
};

module.exports = { 
  createTemplate, 
  deleteTemplate,
  updateTemplate, 
  getTemplates,
  getTemplateSummary,
  getTemplatesByCreatorId
}
