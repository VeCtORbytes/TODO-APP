const express = require('express');
const Board = require('../models/Board');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, color } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const board = new Board({ userId: req.userId, title, description, color });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.userId });
    if (!board) return res.status(404).json({ error: 'Not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!board) return res.status(404).json({ error: 'Not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!board) return res.status(404).json({ error: 'Not found' });
    const Todo = require('../models/Todo');
    await Todo.deleteMany({ boardId: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;