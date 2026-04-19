const LearningModule = require('../Models/LearningModule');
const UserProgress = require('../Models/UserProgress');
const User = require('../Models/User');

exports.getModules = async (req, res) => {
  try {
    const modules = await LearningModule.find().sort({ orderIndex: 1 }).select('-quizQuestions');
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getModuleWithQuiz = async (req, res) => {
  try {
    const learningModule = await LearningModule.findById(req.params.id);
    if (!learningModule) return res.status(404).json({ message: 'Module not found' });
    
    // Also include user progress
    let progress = await UserProgress.findOne({ userId: req.user.id, learningModuleId: req.params.id });
    
    res.json({
      module: learningModule,
      progress: progress || { isCompleted: false, quizScore: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Map format: { "questionId": "A" } or similar, actually array of answers
    
    const learningModule = await LearningModule.findById(req.params.id);
    if (!learningModule) return res.status(404).json({ message: 'Module not found' });

    let correctCount = 0;
    // Simple logic assuming answers array matches question order
    // In C# it was a dictionary or list, we'll assume it's just an array of answer strings for simplicity
    
    for (let i = 0; i < answers.length; i++) {
        if (learningModule.quizQuestions[i] && learningModule.quizQuestions[i].correctOption === answers[i]) {
            correctCount++;
        }
    }

    const score = Math.round((correctCount / learningModule.quizQuestions.length) * 100);
    const passed = score >= 60;

    let progress = await UserProgress.findOne({ userId: req.user.id, learningModuleId: learningModule._id });
    if (!progress) {
        progress = new UserProgress({
            userId: req.user.id,
            learningModuleId: learningModule._id
        });
    }

    // Only update if it's a first time pass or better score
    if (!progress.isCompleted && passed) {
        progress.isCompleted = true;
        progress.completedAt = Date.now();
        
        // reward points
        const user = await User.findById(req.user.id);
        user.points += learningModule.rewardPoints;
        await user.save();
    }
    
    progress.quizScore = Math.max(progress.quizScore, score);
    await progress.save();

    res.json({
        score: score,
        passed: passed,
        rewardPoints: passed ? learningModule.rewardPoints : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
