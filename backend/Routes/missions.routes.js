const express = require('express');
const { getMissions, completeMission } = require('../Controllers/missions.controller');
const { protect } = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', getMissions);
router.post('/:id/complete', completeMission);

module.exports = router;
