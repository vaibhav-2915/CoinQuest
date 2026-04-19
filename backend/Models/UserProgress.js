const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learningModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule', required: true },
  isCompleted: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
