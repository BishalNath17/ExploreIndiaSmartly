import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, addItem, updateItem, deleteItem } from '../../services/adminService';
import AdminForm from '../../components/admin/AdminForm';
import { LogOut, Plus, Edit2, Trash2, Map, MapPin, Sparkles, Search, Compass, Image, RotateCcw } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('destinations'); // 'states', 'uts', 'destinations', 'hiddenGems'
  const [allData, setAllData] = useState({ destinations: [], states: [], uts: [], hiddenGems: [], heroImages: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Quick auth check
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin');
    } else {
      loadAllData();
    }
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [destsRes, statesRes, gemsRes, heroRes] = await Promise.all([
        fetchData('destinations'),
        fetchData('states'),
        fetchData('hiddenGems'),
        fetchData('heroImages')
      ]);
      const st = statesRes.success ? statesRes.data : [];
      setAllData({
        destinations: destsRes.success ? destsRes.data : [],
        states: st.filter(s => s.type !== 'ut'),
        uts: st.filter(s => s.type === 'ut'),
        hiddenGems: gemsRes.success ? gemsRes.data : [],
        heroImages: heroRes.success ? heroRes.data : []
      });
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleFormSubmit = async (formData, isEdit, id) => {
    try {
      // Both states and uts map to the 'states' JSON file on the backend API
      const apiCategory = activeTab === 'uts' ? 'states' : activeTab;
      
      // Explicitly inject the type field into formData
      if (activeTab === 'uts') {
        formData.set('type', 'ut');
      } else if (activeTab === 'states') {
        formData.set('type', 'state');
      }
      
      if (isEdit) {
        await updateItem(apiCategory, id, formData);
      } else {
        await addItem(apiCategory, formData);
      }
      setShowForm(false);
      setEditingItem(null);
      loadAllData();
    } catch (err) {
      alert('Error saving data');
    }
  };

  const handleDelete = async (id, category) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const apiCategory = category === 'uts' ? 'states' : category;
        await deleteItem(apiCategory, id);
        loadAllData();
      } catch (err) {
        alert('Error deleting data');
      }
    }
  };

  const handleResetHeroImage = async (item) => {
    if (window.confirm(`Are you sure you want to reset "${item.name}" to its default image?`)) {
      try {
        const formData = new FormData();
        formData.append('id', item.id);
        formData.append('name', item.name);
        
        // Define standard defaults
        let defaultImage = '';
        if (item.id === 'main-hero') defaultImage = '/images/heroes/main-hero.jpg';
        if (item.id === 'left-card') defaultImage = '/images/heroes/trek-hero.jpg';
        if (item.id === 'right-card') defaultImage = '/images/heroes/kerala-hero.jpg';
        
        formData.append('image', defaultImage); 

        await updateItem('heroImages', item.id, formData);
        loadAllData();
      } catch (err) {
        alert('Error resetting image');
      }
    }
  };

  const tabs = [
    { id: 'destinations', label: 'All Destinations', icon: MapPin },
    { id: 'states', label: 'States', icon: Map },
    { id: 'uts', label: 'Union Territories', icon: Compass },
    { id: 'hiddenGems', label: 'Hidden Gems', icon: Sparkles },
    { id: 'heroImages', label: 'Home Hero Images', icon: Image }
  ];

  const getDisplayData = () => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      // Omni-search matching logic
      const match = (item) => item.name?.toLowerCase().includes(q) || item.state?.toLowerCase().includes(q) || item.id?.toLowerCase().includes(q);
      
      return [
        ...allData.destinations.filter(match).map(d => ({ ...d, _cat: 'destinations' })),
        ...allData.states.filter(match).map(d => ({ ...d, _cat: 'states' })),
        ...allData.uts.filter(match).map(d => ({ ...d, _cat: 'uts' })),
        ...allData.hiddenGems.filter(match).map(d => ({ ...d, _cat: 'hiddenGems' })),
        ...allData.heroImages.filter(match).map(d => ({ ...d, _cat: 'heroImages' })),
      ];
    }
    return allData[activeTab].map(d => ({ ...d, _cat: activeTab }));
  };

  const displayData = getDisplayData();

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Content Manager
            </h1>
            <p className="text-gray-400 mt-1">Global search, manage, and edit your records</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg transition-colors border border-white/10 text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="mb-6 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search instantly for Kedarnath, Tripura, Delhi, Andaman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium backdrop-blur-sm"
          />
        </div>

        {/* Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow-lg' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300 font-medium">
            {searchQuery 
              ? `Found ${displayData.length} records matching "${searchQuery}"` 
              : `Showing ${displayData.length} ${tabs.find(t=>t.id===activeTab).label}`
            }
          </p>
          {!searchQuery && activeTab !== 'heroImages' && (
            <button 
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20 font-medium"
            >
              <Plus size={18} /> Add New
            </button>
          )}
        </div>

        {/* List View */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayData.map((item) => {
              const categoryBadge = tabs.find(t => t.id === item._cat)?.label;
              return (
                <div key={`${item._cat}-${item.id}`} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      {searchQuery && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-white/90 px-2 py-0.5 rounded shadow mb-1 inline-block">
                          {categoryBadge}
                        </span>
                      )}
                      <h3 className="text-white font-bold text-lg truncate">{item.name}</h3>
                      {item.state && <p className="text-orange-400 text-sm truncate">{item.state}</p>}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {item.description || item.intro}
                    </p>
                    <div className="flex justify-end gap-2 border-t border-white/10 pt-4 mt-auto">
                      <button 
                        onClick={() => { setActiveTab(item._cat); setEditingItem(item); setShowForm(true); }}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        title="Edit / Replace Image"
                      >
                        <Edit2 size={16} />
                      </button>
                      {item._cat === 'heroImages' ? (
                        <button 
                          onClick={() => handleResetHeroImage(item)}
                          className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                          title="Reset to Default"
                        >
                          <RotateCcw size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDelete(item.id, item._cat)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Form Modal */}
      {showForm && (
        <AdminForm 
          category={activeTab} 
          initialData={editingItem} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
