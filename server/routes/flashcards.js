const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');


router.get('/:roomId', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ room: req.params.roomId });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { question, answer, room, createdBy } = req.body;
    if (!question || !answer || !room || !createdBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const flashcard = new Flashcard({ question, answer, room, createdBy });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 