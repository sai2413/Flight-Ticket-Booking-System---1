const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Allow requests from the configured frontend origin (comma-separated list supported)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev'));  // Log HTTP requests to console

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Flight Booking API is running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
