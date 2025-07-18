const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get progress for a user in a room
router.get('/:userId/:roomId', async (req, res) => {
  try {
    const { userId, roomId } = req.params;
    const progress = await Progress.findOne({ user: userId, room: roomId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update progress for a user in a room
router.post('/', async (req, res) => {
  try {
    const { user, room, streak, stats } = req.body;
    let progress = await Progress.findOne({ user, room });
    if (!progress) {
      progress = new Progress({ user, room, streak, stats });
    } else {
      if (streak !== undefined) progress.streak = streak;
      if (stats !== undefined) progress.stats = stats;
    }
    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all progress for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ user: userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 