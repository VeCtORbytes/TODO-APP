const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  color: { type: String, default: '#3B82F6' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', boardSchema);