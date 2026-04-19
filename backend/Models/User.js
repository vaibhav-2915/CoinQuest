const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['child', 'parent', 'admin'], default: 'child' },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
});

module.exports = mongoose.model('User', userSchema);
