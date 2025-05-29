const db = require('./db');

module.exports = {
  getTasks: () => {
    const selectAllTasks = db.prepare('SELECT * FROM tasks');
    return selectAllTasks.all();
  },

  addTask: (title, description) => {
    const insertTask = db.prepare(`
      INSERT INTO tasks (title, description, status)
      VALUES (?, ?, ?)
    `);
    return insertTask.run(title, description, 'pending');
  },

  deleteTask: (id) => {
    const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ?');
    return deleteTask.run(id);
  },

  updateTaskStatus: (id, status) => {
    const updateTask = db.prepare(
      'UPDATE tasks SET status = @status, updated_at = CURRENT_TIMESTAMP WHERE id = @id',
    );
    return updateTask.run({ status, id });
  },
};
