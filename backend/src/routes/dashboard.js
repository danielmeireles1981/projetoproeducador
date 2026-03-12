import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

router.get('/stats', (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];

    const stats = {
      total: 0,
      completed: 0,
      today: 0,
      overdue: 0,
      byCategory: []
    };

    // Calculate generic counts
    const countsReq = db.prepare(`
        SELECT 
            COUNT(id) as total,
            SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN date(due_date) = ? AND status != 'done' THEN 1 ELSE 0 END) as today,
            SUM(CASE WHEN date(due_date) < ? AND status != 'done' THEN 1 ELSE 0 END) as overdue
        FROM tasks 
        WHERE user_id = ?
    `).get(todayStr, todayStr, userId);

    if (countsReq) {
        stats.total = countsReq.total || 0;
        stats.completed = countsReq.completed || 0;
        stats.today = countsReq.today || 0;
        stats.overdue = countsReq.overdue || 0;
    }

    // Load category breakdown
    stats.byCategory = db.prepare(`
        SELECT c.name, c.color, COUNT(t.id) as count
        FROM categories c
        LEFT JOIN tasks t ON t.category_id = c.id AND t.user_id = ?
        GROUP BY c.id
    `).all(userId);

    res.json(stats);
  } catch (error) {
    console.error('Error aggregating dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
