const fs = require('fs');
const path = require('path');

/**
 * Admin Controller — Explore India Smartly
 * 
 * Serves static reference data (states, hiddenGems, heroImages) from
 * bundled JSON files inside backend/data/.
 * 
 * Destinations CRUD is handled by destination.controller.js (MongoDB).
 * These categories are READ-ONLY reference data for the admin panel.
 */

const getJsonPath = (category) => {
  return path.resolve(__dirname, '../../data', `${category}.json`);
};

exports.getData = (req, res, next) => {
  try {
    const { category } = req.params;
    const jsonPath = getJsonPath(category);
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ success: false, message: `Category '${category}' not found` });
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.addItem = (req, res, next) => {
  try {
    const { category } = req.params;
    const jsonPath = getJsonPath(category);
    let data = [];
    if (fs.existsSync(jsonPath)) {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }

    const newItem = req.body;
    
    if (req.file) {
      const folder = category === 'states' ? 'states' : (category === 'heroImages' ? 'heroes' : 'destinations');
      newItem.image = `/images/${folder}/${req.file.filename}`;
    }

    // Ensure tags and destinations lists are arrays if passed as strings
    if (typeof newItem.tags === 'string') newItem.tags = newItem.tags.split(',').map(s => s.trim());
    if (typeof newItem.destinations === 'string') newItem.destinations = newItem.destinations.split(',').map(s => s.trim());

    // Check if ID exists
    const existingIndex = data.findIndex(item => item.id === newItem.id);
    if (existingIndex !== -1) {
      return res.status(400).json({ success: false, message: 'Item with this ID already exists' });
    }

    data.push(newItem);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    res.status(201).json({ success: true, message: 'Added successfully', data: newItem });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = (req, res, next) => {
  try {
    const { category, id } = req.params;
    const jsonPath = getJsonPath(category);
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Update object properties
    const updatedItem = { ...data[itemIndex], ...req.body };

    // File
    if (req.file) {
      const folder = category === 'states' ? 'states' : (category === 'heroImages' ? 'heroes' : 'destinations');
      updatedItem.image = `/images/${folder}/${req.file.filename}`;
    }

    if (typeof updatedItem.tags === 'string') updatedItem.tags = updatedItem.tags.split(',').map(s => s.trim());
    if (typeof updatedItem.destinations === 'string') updatedItem.destinations = updatedItem.destinations.split(',').map(s => s.trim());

    data[itemIndex] = updatedItem;

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    res.json({ success: true, message: 'Updated successfully', data: updatedItem });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = (req, res, next) => {
  try {
    const { category, id } = req.params;
    
    if (category === 'heroImages') {
      return res.status(403).json({ success: false, message: 'Deleting core hero image slots is not permitted. Please use reset instead.' });
    }

    const jsonPath = getJsonPath(category);
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const initialLength = data.length;
    data = data.filter(item => item.id !== id);

    if (data.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
