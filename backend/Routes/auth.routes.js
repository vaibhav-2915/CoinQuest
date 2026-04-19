const express = require('express');
const { register, login, getMe } = require('../Controllers/auth.controller');
const { protect } = require('../Middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
