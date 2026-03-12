import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// Middleware to protect routes is assumed to be running before entering here (checked in index.js)

// Get all tasks for user
router.get('/', (req, res) => {
  try {
    const tasks = db.prepare(`
        SELECT t.*, c.name as category_name, c.color as category_color 
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.due_date ASC
    `).all(req.user.id);

    // Optionally fetch tags for each task
    const stmtTags = db.prepare(`
        SELECT t.name, tt.task_id 
        FROM tags t 
        JOIN task_tags tt ON t.id = tt.tag_id 
        WHERE tt.task_id = ?
    `);

    tasks.forEach(task => {
        task.tags = stmtTags.all(task.id).map(tag => tag.name);
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', (req, res) => {
  const { title, description, due_date, priority, category_id, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const insertTask = db.prepare(`
      INSERT INTO tasks (user_id, title, description, due_date, priority, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const info = insertTask.run(req.user.id, title, description, due_date, priority || 'medium', category_id);
    const newTaskId = info.lastInsertRowid;

    if (tags && Array.isArray(tags)) {
      const insertTagStmt = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
      const getTagStmt = db.prepare('SELECT id FROM tags WHERE name = ?');
      const linkTagStmt = db.prepare('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)');

      tags.forEach(tag => {
        insertTagStmt.run(tag);
        const tagRec = getTagStmt.get(tag);
        if (tagRec) {
          linkTagStmt.run(newTaskId, tagRec.id);
        }
      });
    }

    res.status(201).json({ id: newTaskId, message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task status
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    try {
        const stmt = db.prepare('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?');
        const info = stmt.run(status, req.params.id, req.user.id);
        
        if (info.changes === 0) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Delete task
router.delete('/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
        const info = stmt.run(req.params.id, req.user.id);
        
        if (info.changes === 0) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Categories (since they are fixed, simple return)
router.get('/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
});

export default router;
