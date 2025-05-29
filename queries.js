import { db } from './db.js';

export const getTasks = () => {
  const selectAllTasks = db.prepare('SELECT * FROM tasks');
  return selectAllTasks.all();
};

export const addTask = (title, description) => {
  const insertTask = db.prepare(`
      INSERT INTO tasks (title, description, status)
      VALUES (?, ?, ?)
    `);
  return insertTask.run(title, description, 'pending');
};

export const deleteTask = (id) => {
  const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ?');
  return deleteTask.run(id);
};

export const updateTaskStatus = (id, status) => {
  const updateTask = db.prepare(
    'UPDATE tasks SET status = @status, updated_at = CURRENT_TIMESTAMP WHERE id = @id',
  );
  return updateTask.run({ status, id });
};
