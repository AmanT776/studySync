const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// List quizzes for a room
router.get('/:roomId/quiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ room: req.params.roomId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a quiz to a room
router.post('/', async (req, res) => {
  try {
    const { questions, room, createdBy } = req.body;
    if (!questions || !room || !createdBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const quiz = new Quiz({ questions, room, createdBy });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 