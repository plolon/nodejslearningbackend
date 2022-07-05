const express = require('express');
const path = require('path');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin); 

module.exports = router;