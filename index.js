const Database = require('better-sqlite3');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

//const io = new Server(app);

const db = new Database('tasks.db', {
  verbose: console.log,
});

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP 
  )
`);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

const insertTask = db.prepare(`
  INSERT INTO tasks (title, description, status)
  VALUES (?, ?, ?)
`);

const selectAllTasks = db.prepare('SELECT * FROM tasks');

app.post('/tasks', (req, res, next) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const result = insertTask.run(title, description, 'pending');
    res.status(201).json({
      id: result.lastInsertRowid,
      title,
      description,
      status: 'pending',
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/tasks', (req, res, next) => {
  try {
    const tasks = selectAllTasks.all();
    console.log(tasks);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error ' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ?');
  try {
    const result = deleteTask.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updateTask = db.prepare(
    'UPDATE tasks SET status = @status, updated_at = CURRENT_TIMESTAMP WHERE id = @id',
  );

  try {
    const result = updateTask.run({ status, id });
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found or not pending' });
    }
    res.json({ message: 'Task status updated to finished' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000; //usualmente uso un env para definir puertos y secretos

app.listen(3000),
  () => {
    console.log('Server is running at port', PORT);
  };

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
