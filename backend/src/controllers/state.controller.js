const State = require('../models/State');

// GET /states — list all (supports ?type=state|ut, ?limit=N)
exports.getStates = async (req, res, next) => {
  try {
    const { type, limit } = req.query;
    const filter = type ? { type } : {};
    let query = State.find(filter).sort({ name: 1 });
    if (limit) query = query.limit(parseInt(limit));
    const states = await query;
    res.json({ success: true, count: states.length, data: states });
  } catch (error) { next(error); }
};

// GET /states/:id — single state by slug
exports.getStateById = async (req, res, next) => {
  try {
    const state = await State.findOne({ id: req.params.id });
    if (!state) return res.status(404).json({ success: false, message: 'State not found' });
    res.json({ success: true, data: state });
  } catch (error) { next(error); }
};

// POST /admin/states — create
exports.createState = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    if (!data.id && data.name) {
      data.id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const state = new State(data);
    await state.save();
    res.status(201).json({ success: true, data: state });
  } catch (error) { next(error); }
};

// PUT /admin/states/:id — update
exports.updateState = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const state = await State.findOneAndUpdate({ id: req.params.id }, { $set: data }, { returnDocument: 'after' });
    if (!state) return res.status(404).json({ success: false, message: 'State not found' });
    res.json({ success: true, data: state });
  } catch (error) { next(error); }
};

// DELETE /admin/states/:id — delete
exports.deleteState = async (req, res, next) => {
  try {
    const state = await State.findOneAndDelete({ id: req.params.id });
    if (!state) return res.status(404).json({ success: false, message: 'State not found' });
    res.json({ success: true, message: 'State deleted' });
  } catch (error) { next(error); }
};
