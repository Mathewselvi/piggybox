require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'PiggyLove API for Anna Ben Byju is running smoothly ❤️' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✨ PiggyLove Backend Server started on port ${PORT} ❤️`);
  });
}

module.exports = app;
