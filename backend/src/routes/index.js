const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const planningController = require('../controllers/planningController');
const adminRoutes = require('./admin.routes');
const destinationController = require('../controllers/destination.controller');

// Base test route for /api/v1
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Explore India API v1'
  });
});

// System Check
router.get('/health', healthController.getHealthStatus);

// Public Destinations API
router.get('/destinations', destinationController.getDestinations);
router.get('/destinations/import', destinationController.importTripura);

// Future API Endpoints
router.post('/budget/calculate', planningController.calculateBudget);
router.post('/itinerary/generate', planningController.generateItinerary);

// Admin Panel
router.use('/admin', adminRoutes);

module.exports = router;
