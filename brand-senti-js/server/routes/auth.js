// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Manual login
router.post('/login', authController.login);

// Google login via Firebase ID token
router.post('/google-login', authController.googleLogin);

module.exports = router;
