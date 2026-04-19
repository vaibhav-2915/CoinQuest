const Wallet = require('../Models/Wallet');
const Transaction = require('../Models/Transaction');

exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      type: 'deposit',
      amount: amount,
      description: description || 'Deposit'
    });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient funds' });

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      type: 'withdrawal',
      amount: amount,
      description: description || 'Withdrawal'
    });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyInterest = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const interestRate = 0.05; // 5%
    const interest = wallet.balance * interestRate;
    
    if (interest > 0) {
      wallet.balance += interest;
      wallet.lastInterestApplied = Date.now();
      await wallet.save();

      await Transaction.create({
        userId: req.user.id,
        type: 'interest',
        amount: interest,
        description: 'Interest applied (5%)'
      });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
