const ContactMessage = require('../models/ContactMessage');

// POST /contact — public form submission
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    const msg = new ContactMessage({ name, email, subject, message });
    await msg.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) { next(error); }
};

// GET /admin/contact — list all messages
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    const unread = await ContactMessage.countDocuments({ isRead: false });
    res.json({ success: true, count: messages.length, unread, data: messages });
  } catch (error) { next(error); }
};

// PUT /admin/contact/:id/read — mark as read
exports.markAsRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { returnDocument: 'after' });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (error) { next(error); }
};

// DELETE /admin/contact/:id — delete message
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) { next(error); }
};
