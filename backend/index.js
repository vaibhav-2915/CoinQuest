const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coinquest';

mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  });
});

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Routes
app.use('/api/auth', require('./Routes/auth.routes'));
app.use('/api/wallet', require('./Routes/wallet.routes'));
app.use('/api/transactions', require('./Routes/transactions.routes'));
app.use('/api/missions', require('./Routes/missions.routes'));
app.use('/api/learning', require('./Routes/learning.routes'));
app.use('/api/parent', require('./Routes/parent.routes'));
app.use('/api/admin', require('./Routes/admin.routes'));

// Seed database on startup if empty (optional but recommended for test)
const seedDatabase = require('./seed');
seedDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
