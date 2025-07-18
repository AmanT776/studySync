const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');

// List all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('members', 'username email');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new room
router.post('/', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: 'Name and userId are required' });
    }
    const room = new Room({ name, members: [userId] });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Join a room
router.post('/join', async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 