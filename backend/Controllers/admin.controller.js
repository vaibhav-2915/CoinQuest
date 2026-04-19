const User = require('../Models/User');
const Wallet = require('../Models/Wallet');
const Transaction = require('../Models/Transaction');
const Mission = require('../Models/Mission');
const LearningModule = require('../Models/LearningModule');

exports.getGlobalStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const parents = await User.countDocuments({ role: 'parent' });
    const children = await User.countDocuments({ role: 'child' });
    
    // Aggregate total balance across all wallets
    const wallets = await Wallet.find();
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    const totalTransactions = await Transaction.countDocuments();
    const totalMissions = await Mission.countDocuments();

    res.json({
      stats: {
        totalUsers,
        parents,
        children,
        totalBalance,
        totalTransactions,
        totalMissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ lastLogin: -1 });
    
    // Attach current balance to each user if applicable
    const results = await Promise.all(users.map(async (u) => {
      let balance = 0;
      if (u.role === 'child') {
        const w = await Wallet.findOne({ userId: u._id });
        balance = w ? w.balance : 0;
      }
      return {
        ...u.toJSON(),
        balance
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { title, content, category, orderIndex, rewardPoints, icon, quizQuestions } = req.body;
    
    const newModule = await LearningModule.create({
      title,
      content,
      category,
      orderIndex: orderIndex || 0,
      rewardPoints: rewardPoints || 10,
      icon: icon || '📚',
      quizQuestions
    });

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const deletedModule = await LearningModule.findByIdAndDelete(moduleId);
    if (!deletedModule) return res.status(404).json({ message: 'Module not found' });
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
