const express = require('express');
const { getModules, getModuleWithQuiz, submitQuiz } = require('../Controllers/learning.controller');
const { protect } = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/modules', getModules);
router.get('/modules/:id', getModuleWithQuiz);
router.post('/modules/:id/quiz', submitQuiz);

module.exports = router;
