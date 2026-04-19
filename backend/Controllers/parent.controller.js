const User = require('../Models/User');
const Wallet = require('../Models/Wallet');
const Mission = require('../Models/Mission');
const UserMission = require('../Models/UserMission');
const Transaction = require('../Models/Transaction');
const UserProgress = require('../Models/UserProgress');

exports.getChildren = async (req, res) => {
  try {
    const children = await User.find({ parentId: req.user.id, role: 'child' }).populate('badges');
    
    // Attach wallet balance for each child
    const results = await Promise.all(children.map(async (child) => {
      const wallet = await Wallet.findOne({ userId: child._id });
      return {
        id: child._id,
        name: child.name,
        email: child.email,
        level: child.level,
        points: child.points,
        balance: wallet ? wallet.balance : 0,
        badges: child.badges
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChildAnalytics = async (req, res) => {
  try {
    const childId = req.params.id;
    // ensure child belongs to parent
    const child = await User.findOne({ _id: childId, parentId: req.user.id });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const recentActivity = await Transaction.find({ userId: childId }).sort({ date: -1 }).limit(10);
    const completedLearning = await UserProgress.find({ userId: childId }).populate('learningModuleId');
    const missions = await UserMission.find({ userId: childId }).populate('missionId');

    res.json({
      child: { name: child.name, points: child.points, level: child.level },
      recentActivity,
      learningProgress: completedLearning,
      missions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignMission = async (req, res) => {
  try {
    const { childId, title, description, rewardPoints, type } = req.body;

    const child = await User.findOne({ _id: childId, parentId: req.user.id });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    // Create mission assigned by parent
    const mission = await Mission.create({
      title,
      description,
      rewardPoints,
      type: type || 'custom',
      icon: '✨',
      assignedByParentId: req.user.id
    });

    // Assign to child
    await UserMission.create({
      userId: childId,
      missionId: mission._id
    });

    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
