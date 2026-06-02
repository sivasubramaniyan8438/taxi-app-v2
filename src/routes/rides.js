const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, (req, res) => {
  try {
    const { pickup, destination } = req.body;
    const id = uuidv4();
    const fare = Math.floor(Math.random() * 200) + 50;
    db.prepare('INSERT INTO rides (id, user_id, pickup, destination, fare) VALUES (?, ?, ?, ?, ?)').run(id, req.user.id, pickup, destination, fare);
    const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(id);
    res.status(201).json({ message: 'Ride booked!', ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, (req, res) => {
  try {
    const rides = db.prepare('SELECT * FROM rides WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/cancel', protect, (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'requested') return res.status(400).json({ message: 'Cannot cancel' });
    db.prepare('UPDATE rides SET status = ? WHERE id = ?').run('cancelled', ride.id);
    res.json({ message: 'Ride cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
