const HeroImage = require('../models/HeroImage');

exports.getHeroImages = async (req, res, next) => {
  try {
    const images = await HeroImage.find();
    res.json({ success: true, data: images });
  } catch (error) { next(error); }
};

exports.updateHeroImage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const image = await HeroImage.findOneAndUpdate(
      { slotId: req.params.slotId },
      { $set: data },
      { returnDocument: 'after' }
    );
    if (!image) return res.status(404).json({ success: false, message: 'Hero image slot not found' });
    res.json({ success: true, data: image });
  } catch (error) { next(error); }
};
