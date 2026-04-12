const SafetyTip = require('../models/SafetyTip');

exports.getSafetyTips = async (req, res, next) => {
  try {
    const tips = await SafetyTip.find().sort({ sortOrder: 1 });
    res.json({ success: true, count: tips.length, data: tips });
  } catch (error) { next(error); }
};

exports.createSafetyTip = async (req, res, next) => {
  try {
    const tip = new SafetyTip(req.body);
    await tip.save();
    res.status(201).json({ success: true, data: tip });
  } catch (error) { next(error); }
};

exports.updateSafetyTip = async (req, res, next) => {
  try {
    const tip = await SafetyTip.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after' });
    if (!tip) return res.status(404).json({ success: false, message: 'Safety tip not found' });
    res.json({ success: true, data: tip });
  } catch (error) { next(error); }
};

exports.deleteSafetyTip = async (req, res, next) => {
  try {
    const tip = await SafetyTip.findByIdAndDelete(req.params.id);
    if (!tip) return res.status(404).json({ success: false, message: 'Safety tip not found' });
    res.json({ success: true, message: 'Safety tip deleted' });
  } catch (error) { next(error); }
};
