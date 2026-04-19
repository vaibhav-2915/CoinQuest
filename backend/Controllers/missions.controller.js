const UserMission = require('../Models/UserMission');
const Mission = require('../Models/Mission');
const User = require('../Models/User');

exports.getMissions = async (req, res) => {
  try {
    const userMissions = await UserMission.find({ userId: req.user.id }).populate('missionId');
    
    // Map to a friendlier format for frontend
    const result = userMissions.map(um => {
      return {
        id: um._id, // UserMission ID
        missionId: um.missionId._id,
        title: um.missionId.title,
        description: um.missionId.description,
        rewardPoints: um.missionId.rewardPoints,
        isCompleted: um.isCompleted,
        icon: um.missionId.icon,
        type: um.missionId.type
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeMission = async (req, res) => {
  try {
    // using userMission id, not mission id
    const userMissionId = req.params.id;
    const userMission = await UserMission.findOne({ _id: userMissionId, userId: req.user.id }).populate('missionId');

    if (!userMission) return res.status(404).json({ message: 'Mission not found' });
    if (userMission.isCompleted) return res.status(400).json({ message: 'Mission already completed' });

    userMission.isCompleted = true;
    userMission.completedAt = Date.now();
    await userMission.save();

    // Reward points
    const user = await User.findById(req.user.id);
    user.points += userMission.missionId.rewardPoints;
    
    // Level up logic (same as C# logic ideally)
    if (user.points >= 1000) user.level = 5;
    else if (user.points >= 600) user.level = 4;
    else if (user.points >= 300) user.level = 3;
    else if (user.points >= 100) user.level = 2;

    await user.save();

    res.json({ message: 'Mission completed', earned: userMission.missionId.rewardPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
