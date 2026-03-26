const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const planningController = require('../controllers/planningController');

// System Check
router.get('/health', healthController.getHealthStatus);

// Future API Endpoints
router.post('/budget/calculate', planningController.calculateBudget);
router.post('/itinerary/generate', planningController.generateItinerary);

module.exports = router;
