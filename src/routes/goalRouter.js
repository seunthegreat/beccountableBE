const express = require('express');
const router = express.Router();

const { createGoal, deleteGoal, forfeitGoal, getGoalsByStatus, 
    updateGoal, checkPartnerExistence, getRecommendedPartners } = require('../controllers/goalController');

router.post('/create-goal', createGoal);
router.delete('/delete-goal/:id', deleteGoal);
router.put('/forfeit-goal/:id', forfeitGoal);
router.get('/get-goals', getGoalsByStatus);
router.put('/edit-goal/:id', updateGoal);
router.get('/check-partner/:id', checkPartnerExistence);
router.get('/recommend-partners', getRecommendedPartners);

module.exports = router;