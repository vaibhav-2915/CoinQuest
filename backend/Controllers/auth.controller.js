const User = require('../Models/User');
const Wallet = require('../Models/Wallet');
const Mission = require('../Models/Mission');
const UserMission = require('../Models/UserMission');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, name, parentId) => {
  return jwt.sign({ id, role, name, parentId }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, parentId, adminSecret } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Admin security check
    if (role === 'admin') {
      const globalAdminSecret = process.env.ADMIN_SECRET || 'coinquest_admin_2024';
      if (adminSecret !== globalAdminSecret) {
        return res.status(403).json({ message: 'Invalid Admin Secret Key' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'child',
      parentId: parentId || null
    });

    if (user.role === 'child') {
      await Wallet.create({ userId: user._id, balance: 0 });
      // Assign default missions
      const defaultMissions = await Mission.find({ assignedByParentId: null }).limit(5);
      const userMissions = defaultMissions.map(m => ({ userId: user._id, missionId: m._id }));
      if (userMissions.length > 0) {
        await UserMission.insertMany(userMissions);
      }
    }

    res.status(201).json({
      token: generateToken(user._id, user.role, user.name, user.parentId),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        parentId: user.parentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      res.json({
        token: generateToken(user._id, user.role, user.name, user.parentId),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          parentId: user.parentId,
          points: user.points,
          level: user.level
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash').populate('badges');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
