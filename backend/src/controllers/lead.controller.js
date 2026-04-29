const Lead = require('../models/Lead');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if duplicate manually to return clean response instead of throwing 11000
    const existing = await Lead.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }

    // Create new lead
    await Lead.create({ email });

    res.status(201).json({ success: true, message: 'Successfully subscribed to the travel plan!' });
  } catch (error) {
    console.error('Lead subscribe error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    // Fallback duplicate key check
    if (error.code === 11000) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }
    
    res.status(500).json({ success: false, message: 'Server error saving lead' });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leads' });
  }
};
