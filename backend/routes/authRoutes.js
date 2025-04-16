const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.get('/check/:address', authController.isUserRegistered);

module.exports = router;
