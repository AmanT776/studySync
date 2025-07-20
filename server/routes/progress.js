const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Progress = require('../models/Progress');

// Get progress for a user in a room
router.get('/:userId/:roomId', async (req, res) => {
  const { userId, roomId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid userId or roomId' });
  }
  try {
    const progress = await Progress.findOne({ user: userId, room: roomId });
    res.json(progress);
  } catch (err) {
    console.error('Error fetching progress for user/room:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update progress for a user in a room (push quiz marks or accumulate stats)
router.post('/', async (req, res) => {
  const { user, room, streak, stats, score, total, quizId } = req.body;
  console.log(req.body)
  if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(room)) {
    return res.status(400).json({ message: 'Invalid user or room ObjectId' });
  }
  try {
    let progress = await Progress.findOne({ user, room });
    if (!progress) {
      progress = new Progress({ user, room, streak, stats });
    } else {
      if (streak !== undefined) progress.streak = streak;
      // If score and total are provided, push to quizResults
      if (typeof score === 'number' && typeof total === 'number') {
        progress.quizResults = progress.quizResults || [];
        progress.quizResults.push({ quizId, score, total, date: new Date() });
        progress.lastActivity = new Date();
      }
      // Legacy: accumulate stats if provided
      if (stats !== undefined) {
        progress.stats = progress.stats || {};
        for (const key in stats) {
          if (typeof stats[key] === 'number') {
            progress.stats[key] = (progress.stats[key] || 0) + stats[key];
          } else {
            progress.stats[key] = stats[key];
          }
        }
      }
    }
    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all progress for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  // Log raw input
  console.log('[Progress Route] Fetching progress for userId:', userId);

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.warn('[Progress Route] Invalid ObjectId:', userId);
    return res.status(400).json({
      message: 'Invalid userId format',
      userId,
      isValid: false
    });
  }

  try {
    const progress = await Progress.find({ user: userId });
    console.log(progress)
    if (!progress || progress.length === 0) {
      console.info('[Progress Route] No progress found for user:', userId);
      return res.status(404).json({
        message: 'No progress records found for this user.',
        userId
      });
    }

    // Success response
    console.log('[Progress Route] Progress records found:', progress.length);
    res.status(200).json(progress);

  } catch (error) {
    console.error('[Progress Route] Server error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});
module.exports = router; 