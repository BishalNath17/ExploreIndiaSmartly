const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const planningController = require('../controllers/planningController');
const adminRoutes = require('./admin.routes');
const destinationController = require('../controllers/destination.controller');
const stateController = require('../controllers/state.controller');

const safetyTipController = require('../controllers/safetyTip.controller');
const heroImageController = require('../controllers/heroImage.controller');
const blogController = require('../controllers/blog.controller');
const contactController = require('../controllers/contact.controller');
const leadController = require('../controllers/lead.controller');
const hotelRoutes = require('./hotel.routes');

router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'API is working'
  });
});

// System Check
router.get('/health', healthController.getHealthStatus);

// ── Public API Endpoints ──

// States
router.get('/states', stateController.getStates);
router.get('/states/:id', stateController.getStateById);

// Destinations (existing)
router.get('/destinations', destinationController.getDestinations);
router.get('/destinations/import', destinationController.importTripura);
router.get('/destinations/:id', destinationController.getDestinationById);



// Safety Tips
router.get('/safety-tips', safetyTipController.getSafetyTips);

// Hero Images
router.get('/hero-images', heroImageController.getHeroImages);

// Blogs
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:slug', blogController.getBlogBySlug);

// Contact & Leads
router.post('/contact', contactController.submitContact);
router.post('/leads', leadController.subscribe);

// Planning (existing)
router.post('/budget/calculate', planningController.calculateBudget);
router.post('/itinerary/generate', planningController.generateItinerary);

// Admin Panel
router.use('/admin', adminRoutes);

// Hotel Search
router.use('/hotels', hotelRoutes);

module.exports = router;
