import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { statesData } from '../../data/statesData';

const AdminForm = ({ category, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [statesList, setStatesList] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: '', name: '', state: '' }); 
    }
  }, [initialData]);

  useEffect(() => {
    // Populate dropdown safely from the existing frontend data arrays
    if (category !== 'states' && category !== 'uts') {
      setStatesList(statesData);
    }
  }, [category]);

  const generateSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Auto-generate ID logic ONLY for new items
    if (!initialData) {
      const namePart = name === 'name' ? value : (newFormData.name || '');
      const statePart = name === 'state' ? value : (newFormData.state || '');
      
      if (category !== 'states' && category !== 'uts') {
        if (namePart && statePart) {
          newFormData.id = generateSlug(`${namePart}-${statePart}`);
        } else if (namePart) {
          newFormData.id = generateSlug(namePart);
        }
      } else {
        // If creating a state or UT, just slugify the name
        if (namePart) {
          newFormData.id = generateSlug(namePart);
        }
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      let value = formData[key];
      // Auto-extract src if they accidentally pasted a full iframe code
      if (key === 'mapEmbedUrl' && typeof value === 'string') {
        const srcMatch = value.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) value = srcMatch[1];
      }
      submitData.append(key, value);
    });
    if (imageFile) {
      submitData.append('imageFile', imageFile);
    }
    onSubmit(submitData, !!initialData, formData.id);
  };

  // Define fields based on category
  const renderFields = () => {
    const commonFields = (
      <>
        <div>
          <label className="block text-sm text-gray-400 mb-1">ID / Slug (Auto-generated)</label>
          <input 
            readOnly 
            name="id" 
            value={formData.id || ''} 
            className="w-full p-2 bg-black/50 border border-white/5 rounded text-gray-500 cursor-not-allowed select-none" 
            placeholder="Auto-generated from name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" />
        </div>
      </>
    );

    const locationDetailsFields = (
      <div className="p-4 border border-white/10 rounded-xl bg-black/40 space-y-4">
        <h4 className="text-sm font-bold text-india-orange uppercase tracking-widest border-b border-white/10 pb-2">Location Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs text-gray-400 mb-1">District</label><input name="district" value={formData.district || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white text-sm" placeholder="e.g. South Goa" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">City / Town / Village</label><input name="city" value={formData.city || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white text-sm" placeholder="e.g. Panaji" /></div>
        </div>
        <div><label className="block text-xs text-gray-400 mb-1">Address / Sub-location</label><input name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white text-sm" placeholder="e.g. Near Fort Aguada" /></div>
        <div><label className="block text-xs text-gray-400 mb-1">Google Map Embed URL</label><input name="mapEmbedUrl" value={formData.mapEmbedUrl || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white text-sm" placeholder="https://www.google.com/maps/embed?..." /></div>
      </div>
    );

    if (category === 'states' || category === 'uts') {
      return (
        <div className="space-y-4">
          {commonFields}
          {locationDetailsFields}
          <div><label className="block text-sm text-gray-400 mb-1">Tagline</label><input name="tagline" value={formData.tagline || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Intro/Description</label><textarea name="intro" value={formData.intro || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white h-24" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Best Time to Visit</label><input name="bestTime" value={formData.bestTime || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Destinations (comma separated IDs)</label><input name="destinations" value={formData.destinations || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" /></div>
        </div>
      );
    } else {
      // destinations or hidden gems
      return (
        <div className="space-y-4">
          {commonFields}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Select State</label>
            <select 
              required 
              name="state" 
              value={formData.state || ''} 
              onChange={handleChange} 
              className="w-full p-2 bg-black/30 border border-white/10 rounded text-white"
            >
              <option value="" disabled>-- Choose a State --</option>
              {statesList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {locationDetailsFields}

          {category === 'hiddenGems' && (
            <div><label className="block text-sm text-gray-400 mb-1">Simplified Location (e.g. 'South Goa')</label><input name="location" value={formData.location || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" /></div>
          )}

          <div><label className="block text-sm text-gray-400 mb-1">Description</label><textarea required name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white h-24" /></div>
          
          {category === 'destinations' && (
            <div><label className="block text-sm text-gray-400 mb-1">Why is it Famous? (Optional)</label><textarea name="whyFamous" value={formData.whyFamous || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white h-20" placeholder="Brief reason why this destination stands out." /></div>
          )}
          
          {category === 'destinations' && (
            <div><label className="block text-sm text-gray-400 mb-1">Rating (Out of 5)</label><input type="number" step="0.1" name="rating" max="5.0" min="0" value={formData.rating || ''} onChange={handleChange} className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" /></div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button type="button" onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-6">
          {initialData ? 'Edit' : 'Add New'} {category}
        </h3>

        <div className="space-y-4">
          {renderFields()}
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Upload Image (Optional if existing)</label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-300">{imageFile ? imageFile.name : 'Drag and drop or click to upload new image'}</p>
            </div>
            {initialData?.image && !imageFile && <p className="text-xs text-green-400 mt-2">Current Image: {initialData.image}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
