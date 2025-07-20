const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: false },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  streak: { type: Number, default: 0 },
  lastActivity: { type: Date, default: null },
  quizResults: [QuizResultSchema],
  stats: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema); 