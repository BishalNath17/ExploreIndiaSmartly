const HiddenGem = require('../models/HiddenGem');

exports.getHiddenGems = async (req, res, next) => {
  try {
    const { state, limit } = req.query;
    const filter = state ? { state } : {};
    let query = HiddenGem.find(filter).sort({ name: 1 });
    if (limit) query = query.limit(parseInt(limit));
    const gems = await query;
    res.json({ success: true, count: gems.length, data: gems });
  } catch (error) { next(error); }
};

exports.getHiddenGemById = async (req, res, next) => {
  try {
    const gem = await HiddenGem.findOne({ id: req.params.id });
    if (!gem) return res.status(404).json({ success: false, message: 'Hidden gem not found' });
    res.json({ success: true, data: gem });
  } catch (error) { next(error); }
};

exports.createHiddenGem = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    if (!data.id && data.name) {
      data.id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const gem = new HiddenGem(data);
    await gem.save();
    res.status(201).json({ success: true, data: gem });
  } catch (error) { next(error); }
};

exports.updateHiddenGem = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const gem = await HiddenGem.findOneAndUpdate({ id: req.params.id }, { $set: data }, { returnDocument: 'after' });
    if (!gem) return res.status(404).json({ success: false, message: 'Hidden gem not found' });
    res.json({ success: true, data: gem });
  } catch (error) { next(error); }
};

exports.deleteHiddenGem = async (req, res, next) => {
  try {
    const gem = await HiddenGem.findOneAndDelete({ id: req.params.id });
    if (!gem) return res.status(404).json({ success: false, message: 'Hidden gem not found' });
    res.json({ success: true, message: 'Hidden gem deleted' });
  } catch (error) { next(error); }
};
