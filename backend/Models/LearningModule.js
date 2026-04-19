const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  correctOption: { type: String, required: true, enum: ['A', 'B', 'C'] }
});

const learningModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: '' },
  orderIndex: { type: Number, default: 0 },
  icon: { type: String, default: '📚' },
  rewardPoints: { type: Number, default: 10 },
  quizQuestions: [quizQuestionSchema]
});

module.exports = mongoose.model('LearningModule', learningModuleSchema);
