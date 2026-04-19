const express = require('express');
const { getGlobalStats, getAllUsers, createModule, deleteModule } = require('../Controllers/admin.controller');
const { protect, admin } = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getGlobalStats);
router.get('/users', getAllUsers);
router.post('/modules', createModule);
router.delete('/modules/:id', deleteModule);

module.exports = router;
