const express = require('express');
const router = express.Router();
const { uploadState, uploadDestination, uploadHero, uploadBlog } = require('../config/cloudinary');

// Controllers
const destinationController = require('../controllers/destination.controller');
const stateController = require('../controllers/state.controller');

const safetyTipController = require('../controllers/safetyTip.controller');
const heroImageController = require('../controllers/heroImage.controller');
const blogController = require('../controllers/blog.controller');
const contactController = require('../controllers/contact.controller');
const leadController = require('../controllers/lead.controller');

// Admin health check
router.get(['/', ''], (req, res) => {
  res.status(200).json({ success: true, message: 'Admin API is running' });
});

// ── Auth ──
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'bishal' && password === 'bishal1717') {
    res.json({ success: true, token: 'dummy-admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'Bearer dummy-admin-token') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Unauthorized' });
  }
};

// ── States CRUD ──
router.get('/states', requireAuth, stateController.getStates);
router.post('/states', requireAuth, uploadState.single('image'), stateController.createState);
router.put('/states/:id', requireAuth, uploadState.single('image'), stateController.updateState);
router.delete('/states/:id', requireAuth, stateController.deleteState);

// ── Destinations CRUD (existing — now using Cloudinary) ──
router.post('/destinations/import-ai', requireAuth, destinationController.importAiDestinations);
router.put('/destinations/:id/approve', requireAuth, destinationController.approveDestination);
router.put('/destinations/:id/reject', requireAuth, destinationController.rejectDestination);
router.post('/destinations/bulk-approve', requireAuth, destinationController.bulkApprove);
router.post('/destinations/bulk-reject', requireAuth, destinationController.bulkReject);
router.post('/destinations/rollback', requireAuth, destinationController.rollbackBatch);

router.get('/destinations', destinationController.getDestinations);
router.post('/destinations', requireAuth, uploadDestination.single('image'), destinationController.createDestination);
router.put('/destinations/:id', requireAuth, uploadDestination.single('image'), destinationController.updateDestination);
router.delete('/destinations/:id', requireAuth, destinationController.deleteDestination);



// ── Safety Tips CRUD ──
router.get('/safety-tips', requireAuth, safetyTipController.getSafetyTips);
router.post('/safety-tips', requireAuth, safetyTipController.createSafetyTip);
router.put('/safety-tips/:id', requireAuth, safetyTipController.updateSafetyTip);
router.delete('/safety-tips/:id', requireAuth, safetyTipController.deleteSafetyTip);

// ── Hero Images ──
router.get('/hero-images', requireAuth, heroImageController.getHeroImages);
router.put('/hero-images/:slotId', requireAuth, uploadHero.single('image'), heroImageController.updateHeroImage);

// ── Blogs CRUD ──
router.get('/blogs', requireAuth, blogController.getAllBlogs);
router.post('/blogs', requireAuth, uploadBlog.single('coverImage'), blogController.createBlog);
router.put('/blogs/:slug', requireAuth, uploadBlog.single('coverImage'), blogController.updateBlog);
router.delete('/blogs/:slug', requireAuth, blogController.deleteBlog);

// ── Contact Messages ──
router.get('/contact', requireAuth, contactController.getMessages);
router.put('/contact/:id/read', requireAuth, contactController.markAsRead);
router.delete('/contact/:id', requireAuth, contactController.deleteMessage);

// ── Leads ──
router.get('/leads', requireAuth, leadController.getAllLeads);

module.exports = router;
