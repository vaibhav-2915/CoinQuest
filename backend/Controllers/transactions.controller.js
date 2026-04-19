const Transaction = require('../Models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(20);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
