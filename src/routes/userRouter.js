const express = require('express');
const router = express.Router();
const { deleteUser, updateUser, getAllUsers, addCreator, getUserProfile } = require('../controllers/userController');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles'); 


router.get('/all-users', getAllUsers);
router.get('/profile', getUserProfile);
router.put('/update-profile/:id', updateUser);
router.post('/add-creator',verifyRoles(ROLES_LIST.Admin), addCreator);
router.delete('/delete-user/:memberId',verifyRoles(ROLES_LIST.Admin), deleteUser);


module.exports = router;