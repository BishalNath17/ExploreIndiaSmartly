/**
 * @desc    API Health Check
 * @route   GET /api/v1/health
 * @access  Public
 */
exports.getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Explore India Smartly backend is online and healthy!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
};
