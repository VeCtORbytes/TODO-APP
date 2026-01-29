const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:boardId', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ boardId: req.params.boardId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { boardId, title, description, priority, dueDate } = req.body;
    if (!boardId || !title) return res.status(400).json({ error: 'Missing fields' });
    const todo = new Todo({ boardId, userId: req.userId, title, description, priority, dueDate });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;