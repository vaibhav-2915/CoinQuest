const mongoose = require('mongoose');
const Badge = require('./Models/Badge');
const Mission = require('./Models/Mission');
const LearningModule = require('./Models/LearningModule');
const User = require('./Models/User');

const seedDatabase = async () => {
  try {
    const badgeCount = await Badge.countDocuments();
    if (badgeCount > 0) {
      // already seeded
      return;
    }
    
    console.log('Seeding initial data...');

    await Badge.insertMany([
      { name: 'First Deposit', description: 'Make your first deposit', icon: '🏦' },
      { name: 'Super Saver', description: 'Reach 500 balance', icon: '💰' },
      { name: 'Quiz Master', description: 'Complete all modules', icon: '🎓' },
      { name: 'Mission Hero', description: 'Complete 5 missions', icon: '🦸' },
      { name: 'Interest Earner', description: 'Apply interest', icon: '📈' }
    ]);

    await Mission.insertMany([
      { title: 'Save for a new toy', description: 'Deposit 100 into your account.', rewardPoints: 20, type: 'save', icon: '🧸' },
      { title: 'Apply Interest', description: 'Earn free money by applying interest.', rewardPoints: 10, type: 'learn', icon: '📈' },
      { title: 'Learn about Banks', description: 'Complete the "What is a Bank?" module.', rewardPoints: 15, type: 'learn', icon: '🏦' },
      { title: 'First Withdrawal', description: 'Make a withdrawal to buy something.', rewardPoints: 5, type: 'spend', icon: '🛒' },
      { title: 'Reach Level 2', description: 'Earn 100 points to level up.', rewardPoints: 50, type: 'custom', icon: '⭐' }
    ]);

    await LearningModule.insertMany([
      {
        title: 'What is a Bank?',
        content: 'A bank is a safe place to keep your money. They protect it so it does not get lost or stolen.',
        category: 'Basics',
        orderIndex: 0,
        rewardPoints: 10,
        quizQuestions: [
          { questionText: 'What is a bank?', optionA: 'A toy store', optionB: 'A safe place for money', optionC: 'A restaurant', correctOption: 'B' },
          { questionText: 'Why do we put money in a bank?', optionA: 'To keep it safe', optionB: 'To make it disappear', optionC: 'To paint it', correctOption: 'A' },
          { questionText: 'Who works at a bank?', optionA: 'A chef', optionB: 'A pilot', optionC: 'A banker', correctOption: 'C' }
        ]
      },
      {
        title: 'How to Save',
        content: 'Saving means not spending your money right away, so you can buy something bigger later.',
        category: 'Habits',
        orderIndex: 1,
        rewardPoints: 15,
        quizQuestions: [
          { questionText: 'What does saving mean?', optionA: 'Spending it all', optionB: 'Keeping it for later', optionC: 'Losing it', correctOption: 'B' }
        ]
      }
    ]);

    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seeding error: ', err);
  }
};

module.exports = seedDatabase;
