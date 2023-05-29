const express = require('express');
const router = express.Router();
const { 
  deleteUser, 
  updateUser,
  getAllUsers, 
  addCreator, 
  getUserProfile,
  followUser,
  unfollowUser,
  recommendUsers,
  getFollowers,
  getFollowing,
} = require('../controllers/userController');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles'); 


router.get('/all-users', getAllUsers);
router.get('/profile', getUserProfile);
router.get('/recommendMembers', recommendUsers);
router.get('/followers', getFollowers);
router.get('/following', getFollowing);
router.put('/update-profile/:id', updateUser);
router.post('/add-creator',verifyRoles(ROLES_LIST.Admin), addCreator);
router.delete('/delete-user/:memberId',verifyRoles(ROLES_LIST.Admin), deleteUser);
router.post('/:memberId/follow/:followMemberId', followUser);
router.delete('/:memberId/unfollow/:unfollowMemberId', unfollowUser);


module.exports = router;