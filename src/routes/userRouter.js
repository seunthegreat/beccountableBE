const express = require('express');
const router = express.Router();
const { deleteUser, updateUser, getAllUsers, handleUserLogin } = require('../controllers/userController');

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.get('/all-users', getAllUsers)
router.put('/update-profile/:id', updateUser);
router.delete('/delete-user/:id', isAdmin, deleteUser);


module.exports = router;