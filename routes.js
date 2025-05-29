import { Router } from 'express';
const router = Router();
import { getTasks, addTask, deleteTask, updateTaskStatus } from './queries.js';

export function getRouter(io) {
  function broadcastTasks() {
    const tasks = getTasks();
    io.emit('tasks', tasks);
  }

  router.get('/tasks', (_req, res) => {
    try {
      const tasks = getTasks();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/tasks', (req, res) => {
    const { title, description, id, status } = req.body;
    if (!title && !description) {
      return res
        .status(400)
        .json({ error: 'Title and description is required' });
    }
    if (id || status) {
      return res.status(400).json({
        error:
          'Invalid request: id and status should not be included in POST request',
      });
    }
    try {
      const result = addTask(title, description);
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
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Task ID must be a valid number' });
    }
    try {
      const result = deleteTask(id);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      broadcastTasks();
      io.emit('deleTask', { id });
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || status !== 'done') {
      return res.status(400).json({
        error: 'Status state incorrect "done"',
      });
    }
    try {
      const result = updateTaskStatus(id, status);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      broadcastTasks();
      const updatedTask = getTasks().find((t) => t.id == id);
      io.emit('updateTask', { id: updatedTask.id, status: updatedTask.status });
      res.json({ message: 'Task status updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  return router;
}
