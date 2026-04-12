const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const planningController = require('../controllers/planningController');
const adminRoutes = require('./admin.routes');
const destinationController = require('../controllers/destination.controller');

// 1. Base API Test Route
// This matches exactly: https://exploreindiasmartly.onrender.com/api/v1
// We use a regular expression to handle both with and without trailing slash securely
router.get(/^\/?$/, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working'
  });
});

// 2. System Check
router.get('/health', healthController.getHealthStatus);

// 3. Public Destinations API
router.get('/destinations', destinationController.getDestinations);
router.get('/destinations/import', destinationController.importTripura);

// 4. Future API Endpoints
router.post('/budget/calculate', planningController.calculateBudget);
router.post('/itinerary/generate', planningController.generateItinerary);

// 5. Admin Panel
router.use('/admin', adminRoutes);

module.exports = router;
