const express = require('express');
const { getWallet, deposit, withdraw, applyInterest } = require('../Controllers/wallet.controller');
const { protect } = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', getWallet);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/interest', applyInterest);

module.exports = router;
