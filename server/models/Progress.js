const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  streak: { type: Number, default: 0 },
  lastActivity: { type: Date, default: null },
  stats: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema); 