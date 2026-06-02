const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'ridego_secret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    db.prepare('INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)').run(id, name, email, hashed, phone || '');

    const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(id);
    res.status(201).json({ message: 'Registration successful', token: generateToken(id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', token: generateToken(user.id), user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
