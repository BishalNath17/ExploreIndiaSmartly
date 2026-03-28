const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const planningController = require('../controllers/planningController');
const adminRoutes = require('./admin.routes');

// System Check
router.get('/health', healthController.getHealthStatus);

// Future API Endpoints
router.post('/budget/calculate', planningController.calculateBudget);
router.post('/itinerary/generate', planningController.generateItinerary);

// Admin Panel
router.use('/admin', adminRoutes);

module.exports = router;
