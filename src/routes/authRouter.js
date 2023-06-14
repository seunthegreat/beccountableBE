const express = require('express');
const router = express.Router();
const { 
  handleUserLogin, 
  handleUserSignUp, 
  handleUserLogout,
  getStarted,
  verifyOTP,
  resendOTP,
} = require("../controllers/authController");
const { handleRefreshToken } = require("../controllers/refreshTokenController");

router.post('/signup', handleUserSignUp);
router.post('/get-started', getStarted);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

router.post('/login', handleUserLogin);
router.get('/logout', handleUserLogout);
router.get('/refresh', handleRefreshToken);


module.exports = router;