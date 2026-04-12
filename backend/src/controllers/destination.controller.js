const Destination = require('../models/Destination');

exports.getDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    console.log("Total destinations:", destinations.length);
    res.json({ success: true, message: 'Destinations retrieved successfully', data: destinations });
  } catch (error) {
    next(error);
  }
};

exports.createDestination = async (req, res, next) => {
  try {
    const destData = { ...req.body };
    
    // Save image path strictly bridging Multer payload
    if (req.file) {
      destData.image = `/uploads/${req.file.filename}`;
    }

    // Fail-safe slug gen logic if id wasn't populated from frontend
    if (!destData.id && destData.name) {
      destData.id = destData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const newDest = new Destination(destData);
    await newDest.save();

    res.status(201).json({ success: true, message: 'Destination added successfully', data: newDest });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(400).json({ success: false, message: error.message || 'Error creating destination' });
  }
};

exports.updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Replace mapped image only if new payload is passed
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Usually frontend ID is the string 'id' (slug), not Mongo ObjectID '_id'.
    // We try 'id' mapping first since AdminPanel uses slugs.
    let updatedDest = await Destination.findOneAndUpdate({ id }, updateData, { new: true });
    
    // Fallback exactly to ObjectId
    if (!updatedDest) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
         updatedDest = await Destination.findByIdAndUpdate(id, updateData, { new: true });
      }
    }
    
    if (!updatedDest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, message: `Destination updated successfully`, data: updatedDest });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(400).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = await Destination.findOneAndDelete({ id });
    if (!deleted && id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Destination.findByIdAndDelete(id);
    }
    
    if (!deleted) return res.status(404).json({ success: false, message: 'Destination not found' });
    
    res.json({ success: true, message: `Destination deleted successfully` });
  } catch (error) {
    next(error);
  }
};

exports.importTripura = async (req, res, next) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const possiblePaths = [
      path.resolve(process.cwd(), '../tripura_destinations.json'), // From backend running inside backend/
      path.resolve(process.cwd(), 'tripura_destinations.json') // From backend running at root
    ];
    let filePath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) { filePath = p; break; }
    }
    if (!filePath) return res.status(404).json({ success: false, message: 'JSON file not found' });
    
    const rawData = fs.readFileSync(filePath, 'utf8');
    const destinations = JSON.parse(rawData);
    const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    const formattedDestinations = destinations.map((dest) => ({
      id: `${toSlug(dest.name)}-tripura`,
      name: dest.name,
      state: 'tripura',
      district: dest.district || '',
      description: dest.description || '',
      whyFamous: Array.isArray(dest.highlights) ? dest.highlights.join(' | ') : '',
      location: dest.district ? `${dest.district}, Tripura` : 'Tripura',
      rating: 4.5,
    }));
    
    await Destination.deleteMany({ state: 'tripura' });
    const inserted = await Destination.insertMany(formattedDestinations);
    
    res.json({ success: true, count: inserted.length, message: 'Imported successfully' });
  } catch (error) {
    next(error);
  }
};
