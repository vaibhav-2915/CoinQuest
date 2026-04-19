const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  rewardPoints: { type: Number, required: true },
  targetAmount: { type: Number, default: null },
  type: { type: String, default: 'save' }, // "save", "spend", "learn", "custom"
  icon: { type: String, default: '🎯' },
  assignedByParentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Mission', missionSchema);
