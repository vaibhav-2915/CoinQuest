const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  criteria: { type: String, default: '' }
});

module.exports = mongoose.model('Badge', badgeSchema);
