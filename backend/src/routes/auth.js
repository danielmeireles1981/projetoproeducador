import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

// Register route
router.post('/register', async (req, res) => {
  const { username, password, name, email, avatar_url } = req.body;

  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: 'Username, password, name, and email are required.' });
  }

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password_hash, name, email, avatar_url) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(username, passwordHash, name, email, avatar_url || null);
    
    // Return the new user
    const userPayload = { id: info.lastInsertRowid, username, name, email, avatar_url };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    
    return res.status(201).json({ token, user: userPayload });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      const userPayload = { 
        id: user.id, 
        username: user.username,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url
      };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: userPayload });
    } else {
        return res.status(401).json({ error: 'Invalid username.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
