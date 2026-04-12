const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const indexRoutes = require('./routes/index');
const path = require('path');

const app = express();

// Security Middlewares (Production)
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Required for Cloudinary assets if proxied natively
app.use(mongoSanitize()); // Prevent NoSQL Injection attacks 

app.use((req, res, next) => {
  console.log('REQ PATH:', req.method, req.originalUrl);
  next();
});

// CORS Configuration
const getAllowedOrigins = () => {
  const envUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
  return envUrl.split(',').map(url => url.trim().replace(/\/$/, ''));
};

const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin exactly matches our whitelist
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API Routes 
app.use('/api/v1', indexRoutes);

// Global 404 Handler - MUST be after routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
