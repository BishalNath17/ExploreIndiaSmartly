const express = require('express');
const router = express.Router();
const { upload, uploadDest } = require('../middlewares/upload.middleware');
const adminController = require('../controllers/admin.controller');
const destinationController = require('../controllers/destination.controller');

// Absolute Base Route for Admin (/api/v1/admin)
router.get(['/', ''], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API is running'
  });
});

// Dummy auth route for 'beginner' simplicity
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'dummy-admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Middleware to "protect" routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'Bearer dummy-admin-token') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Unauthorized' });
  }
};

// --- MONGODB REST API Endpoints for Destinations ---
router.get('/destinations', destinationController.getDestinations);
router.post('/destinations', requireAuth, uploadDest.single('image'), destinationController.createDestination);
router.put('/destinations/:id', requireAuth, uploadDest.single('image'), destinationController.updateDestination);
router.delete('/destinations/:id', requireAuth, destinationController.deleteDestination);

// CRUD Routes for the File-based Database
router.get('/data/:category', requireAuth, adminController.getData);
router.post('/data/:category', requireAuth, upload.single('imageFile'), adminController.addItem);
router.put('/data/:category/:id', requireAuth, upload.single('imageFile'), adminController.updateItem);
router.delete('/data/:category/:id', requireAuth, adminController.deleteItem);

module.exports = router;
