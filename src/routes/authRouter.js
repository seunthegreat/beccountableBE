const express = require('express');
const router = express.Router();
const { handleUserLogin, handleUserSignUp, handleUserLogout} = require("../controllers/authController");
const { handleRefreshToken } = require("../controllers/refreshTokenController");

router.post('/signup', handleUserSignUp);

router.post('/login', handleUserLogin);
router.get('/logout', handleUserLogout);
router.get('/refresh', handleRefreshToken);

module.exports = router;