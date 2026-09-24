import React, { useState, useEffect } from 'react';
import './AdminCreators.css';

const AdminSettings = () => {
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  
  const [catInput, setCatInput] = useState('');
  const [platInput, setPlatInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const headers = { Authorization: `Bearer ${token}` };
      
      const [catRes, platRes] = await Promise.all([
        fetch('/api/admin/settings/CATEGORIES', { headers }),
        fetch('/api/admin/settings/PLATFORMS', { headers })
      ]);
      
      const catData = await catRes.json();
      const platData = await platRes.json();
      
      if (catData.success) setCategories(catData.data);
      if (platData.success) setPlatforms(platData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSetting = async (key, values) => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ values })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = () => {
    if (!catInput.trim()) return;
    const newCats = [...categories, catInput.trim()];
    setCategories(newCats);
    saveSetting('CATEGORIES', newCats);
    setCatInput('');
  };

  const handleRemoveCategory = (index) => {
    const newCats = categories.filter((_, i) => i !== index);
    setCategories(newCats);
    saveSetting('CATEGORIES', newCats);
  };

  const handleAddPlatform = () => {
    if (!platInput.trim()) return;
    const newPlats = [...platforms, platInput.trim()];
    setPlatforms(newPlats);
    saveSetting('PLATFORMS', newPlats);
    setPlatInput('');
  };

  const handleRemovePlatform = (index) => {
    const newPlats = platforms.filter((_, i) => i !== index);
    setPlatforms(newPlats);
    saveSetting('PLATFORMS', newPlats);
  };

  if (loading) return <div className="admin-page-container">Loading...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>System Settings</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Categories */}
        <div className="admin-section">
          <h3>Creator Categories</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Manage the categories that creators can select (e.g. Tech, Lifestyle, Finance).
          </p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Add category..." 
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button className="btn-secondary" onClick={handleAddCategory}>Add</button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {categories.map((cat, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', marginBottom: '0.25rem', borderRadius: '4px' }}>
                <span style={{ fontWeight: 500, color: '#334155' }}>{cat}</span>
                <button 
                  onClick={() => handleRemoveCategory(idx)} 
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  &times;
                </button>
              </li>
            ))}
            {categories.length === 0 && <li style={{ color: '#64748b' }}>No categories found.</li>}
          </ul>
        </div>

        {/* Platforms */}
        <div className="admin-section">
          <h3>Social Platforms</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Manage the platforms supported in the directory (e.g. Instagram, YouTube, LinkedIn).
          </p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Add platform..." 
              value={platInput}
              onChange={(e) => setPlatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlatform()}
            />
            <button className="btn-secondary" onClick={handleAddPlatform}>Add</button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {platforms.map((plat, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', marginBottom: '0.25rem', borderRadius: '4px' }}>
                <span style={{ fontWeight: 500, color: '#334155' }}>{plat}</span>
                <button 
                  onClick={() => handleRemovePlatform(idx)} 
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  &times;
                </button>
              </li>
            ))}
            {platforms.length === 0 && <li style={{ color: '#64748b' }}>No platforms found.</li>}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
