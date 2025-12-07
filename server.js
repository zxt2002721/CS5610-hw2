const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./server/routes/userRoutes');
const sudokuRoutes = require('./server/routes/sudokuRoutes');
const highscoreRoutes = require('./server/routes/highscoreRoutes');
const { attachUser } = require('./server/middleware/auth');

const app = express();
const PORT = process.env.PORT || 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sudoku_app';

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Mongo connection error', err));

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:8000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(attachUser);

app.use('/api', userRoutes);
app.use('/api', sudokuRoutes);
app.use('/api', highscoreRoutes);

// Serve built frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
