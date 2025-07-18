const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number // index of the correct option
  }],
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema); 