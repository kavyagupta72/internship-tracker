const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/profile', authorize, userController.getProfile);
router.put('/change-password', authorize, userController.changePassword);

module.exports = router;