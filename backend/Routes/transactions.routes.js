const express = require('express');
const { getTransactions } = require('../Controllers/transactions.controller');
const { protect } = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', getTransactions);

module.exports = router;
