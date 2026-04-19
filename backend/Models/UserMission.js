const mongoose = require('mongoose');

const userMissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('UserMission', userMissionSchema);
