const express = require('express');
const router = express.Router();
const model = require('./endpoint');

module.exports = (io) => {
  function broadcastTasks() {
    const tasks = model.getTasks();
    io.emit('tasks', tasks);
  }

  router.get('/tasks', (req, res) => {
    try {
      const tasks = model.getTasks();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    try {
      const result = model.addTask(title, description);
      broadcastTasks();
      const createdTask = {
        id: result.lastInsertRowid,
        title,
        description,
        status: 'pending',
      };
      io.emit('newTask', createdTask);
      res.status(201).json(createdTask);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    try {
      const result = model.deleteTask(id);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      broadcastTasks();
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    try {
      const result = model.updateTaskStatus(id, status);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      broadcastTasks();
      res.json({ message: 'Task status updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
