const Destination = require('../models/Destination');

exports.getDestinations = async (req, res, next) => {
  try {
    const { state } = req.query;
    const filter = state ? { state: state.toLowerCase() } : {};
    const destinations = await Destination.find(filter).sort({ createdAt: -1 });
    console.log("Total destinations:", destinations.length);
    res.json({ success: true, message: 'Destinations retrieved successfully', data: destinations });
  } catch (error) {
    next(error);
  }
};

exports.getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Try slug-based id first, then MongoDB ObjectId
    let dest = await Destination.findOne({ id });
    if (!dest && id.match(/^[0-9a-fA-F]{24}$/)) {
      dest = await Destination.findById(id);
    }
    if (!dest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: dest });
  } catch (error) {
    next(error);
  }
};

exports.createDestination = async (req, res, next) => {
  try {
    const destData = { ...req.body };
    
    // Save Cloudinary URL from multer-storage-cloudinary
    if (req.file) {
      destData.image = req.file.path;
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
    
    // Replace with new Cloudinary URL if uploaded
    if (req.file) {
      updateData.image = req.file.path;
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
    
    // Read from the bundled data directory inside backend/
    const filePath = path.resolve(__dirname, '../../data/tripura_destinations.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Tripura JSON file not found in backend/data/' });
    }
    
    const rawData = fs.readFileSync(filePath, 'utf8');
    const destinations = JSON.parse(rawData);
    const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    let inserted = 0;
    let updated = 0;

    for (const dest of destinations) {
      const id = `${toSlug(dest.name)}-tripura`;
      const doc = {
        id,
        name: dest.name,
        state: 'tripura',
        district: dest.district || '',
        description: dest.description || '',
        whyFamous: Array.isArray(dest.highlights) ? dest.highlights.join(' | ') : '',
        location: dest.district ? `${dest.district}, Tripura` : 'Tripura',
        rating: 4.5,
      };

      const result = await Destination.findOneAndUpdate(
        { id },
        { $set: doc },
        { upsert: true, new: true }
      );

      if (result.createdAt && result.updatedAt &&
          result.createdAt.getTime() === result.updatedAt.getTime()) {
        inserted++;
      } else {
        updated++;
      }
    }
    
    res.json({ success: true, count: destinations.length, inserted, updated, message: 'Imported successfully' });
  } catch (error) {
    next(error);
  }
};
