const Goal = require("../models/goal");
const Partner = require('../models/partners');

const createGoal = async (req, res) => {
  try {
    const { name, memberId } = req.body;

    const existingGoal = await Goal.findOne({ name, memberId });
      if (existingGoal) {
        return res.status(409).json({
          success: false,
          message: 'Goal already exists',
        });
      }

    const goal = new Goal(req.body);
    const savedGoal = await goal.save();
    res.status(201).json({
      success: true,
      message: `New goal was created by ${memberId}`,
      goal: savedGoal
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Something went wrong',
      error: error
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
  
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    if (goal.status === 'ongoing') {
      return res.status(400).json({
        success: false,
        message: 'Goal is ongoing and cannot be deleted',
      });
    }
  
    else if (goal.status === 'in-review' || goal.status === 'pending' || goal.status === 'forfeited') {
      await Goal.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: 'Goal has been successfully deleted',
      });
    }
   
  } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error,
    });
  }
};

const forfeitGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
  
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
  
    if (goal.status === 'ongoing') {
      goal.status = 'forfeited';
      await goal.save();
      return res.status(200).json({
        success: true,
        message: 'Goal forfeited successfully',
        goal: goal,
      });
    }
  
    return res.status(400).json({
      success: false,
      message: 'Goal cannot be forfeited',
    });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error,
      });
  }
};

const getGoalsByStatus = async (req, res) => {
    try {
      const { memberId, status } = req.query;
    
      // validate status parameter
      if (!status || !['ongoing', 'pending', 'completed', 'in-review', 'forfeited'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing status query parameter',
        });
      }
    
      let query = { status: status };
    
      // add memberId to query if provided
      if (memberId) {
        query.memberId = memberId;
      }
    
      const goals = await Goal.find(query);
    
      return res.status(200).json({
        success: true,
        message: 'Goals retrieved successfully',
        goals: goals,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
};
  

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing goal id',
      });
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update fields provided',
      });
    }
  
    const allowedUpdates = ['title', 'description', 'start', 'end', 'stake', 'category', 'okrs'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid update field',
      });
    }
    
    const goal = await Goal.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      goal: goal,
    });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error,
      });
    }
};

const checkPartnerExistence = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
      
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
      
    if (!goal.partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    return res.status(404).json({
        success: true,
        message: 'User has an existing partner',
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error,
      });
    }
};
  

const getRecommendedPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
  
    return res.status(200).json({
      success: true,
      message: 'Recommended partners retrieved successfully',
      partners: partners,
    });
    } catch (error) {
      return res.status(500).json({
      success: false,
        message: 'Something went wrong',
        error: error,
      });
    }
};
  
module.exports = { createGoal, deleteGoal, forfeitGoal, getGoalsByStatus, 
  updateGoal, getRecommendedPartners, checkPartnerExistence }