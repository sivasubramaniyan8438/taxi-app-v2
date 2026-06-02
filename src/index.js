require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🚖 RideGo API Running' });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, '../public/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
