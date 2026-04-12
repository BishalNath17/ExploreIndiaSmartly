const express = require('express');
const router = express.Router();
const { uploadState, uploadDestination, uploadHiddenGem, uploadHero, uploadBlog } = require('../config/cloudinary');

// Controllers
const destinationController = require('../controllers/destination.controller');
const stateController = require('../controllers/state.controller');
const hiddenGemController = require('../controllers/hiddenGem.controller');
const safetyTipController = require('../controllers/safetyTip.controller');
const heroImageController = require('../controllers/heroImage.controller');
const blogController = require('../controllers/blog.controller');
const contactController = require('../controllers/contact.controller');

// Admin health check
router.get(['/', ''], (req, res) => {
  res.status(200).json({ success: true, message: 'Admin API is running' });
});

// ── Auth ──
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
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
router.get('/destinations', destinationController.getDestinations);
router.post('/destinations', requireAuth, uploadDestination.single('image'), destinationController.createDestination);
router.put('/destinations/:id', requireAuth, uploadDestination.single('image'), destinationController.updateDestination);
router.delete('/destinations/:id', requireAuth, destinationController.deleteDestination);

// ── Hidden Gems CRUD ──
router.get('/hidden-gems', requireAuth, hiddenGemController.getHiddenGems);
router.post('/hidden-gems', requireAuth, uploadHiddenGem.single('image'), hiddenGemController.createHiddenGem);
router.put('/hidden-gems/:id', requireAuth, uploadHiddenGem.single('image'), hiddenGemController.updateHiddenGem);
router.delete('/hidden-gems/:id', requireAuth, hiddenGemController.deleteHiddenGem);

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

module.exports = router;
