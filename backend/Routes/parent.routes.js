const express = require('express');
const { getChildren, getChildAnalytics, assignMission } = require('../Controllers/parent.controller');
const { protect, parent } = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(parent);

router.get('/children', getChildren);
router.get('/children/:id/analytics', getChildAnalytics);
router.post('/missions', assignMission);

module.exports = router;
