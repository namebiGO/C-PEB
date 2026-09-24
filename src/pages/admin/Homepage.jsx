import React, { useState, useEffect } from 'react';
import './AdminCreators.css';

const AdminHomepage = () => {
  const [activeTab, setActiveTab] = useState('HERO');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'HERO', label: 'Hero Section' },
    { id: 'TESTIMONIALS', label: 'Testimonials' },
    { id: 'FAQ', label: 'FAQ' }
  ];

  const fetchContent = async (type) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`/api/homepage/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        setFormData(data.data);
      } else {
        // Init default structures if empty
        if (type === 'HERO') setFormData({ title: '', subtitle: '', ctaText: '', ctaLink: '' });
        else if (type === 'TESTIMONIALS') setFormData({ items: [] });
        else if (type === 'FAQ') setFormData({ items: [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`/api/homepage/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert('Content saved successfully!');
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleArrayAdd = (field, defaultObj) => {
    const arr = formData[field] || [];
    setFormData({ ...formData, [field]: [...arr, defaultObj] });
  };

  const handleArrayRemove = (field, index) => {
    const arr = [...(formData[field] || [])];
    arr.splice(index, 1);
    setFormData({ ...formData, [field]: arr });
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const arr = [...(formData[field] || [])];
    arr[index] = { ...arr[index], [subfield]: value };
    setFormData({ ...formData, [field]: arr });
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Homepage Content Management</h2>
      </div>

      <div className="admin-subnav" style={{ marginBottom: '2rem' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`subnav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-section">
        {loading ? (
          <div>Loading content...</div>
        ) : (
          <form onSubmit={handleSave} className="admin-form-group">
            
            {activeTab === 'HERO' && (
              <>
                <label>Main Headline</label>
                <input required type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="admin-input" style={{ marginBottom: '1rem' }} />

                <label>Subtitle / Description</label>
                <textarea required rows="3" value={formData.subtitle || ''} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="admin-input" style={{ marginBottom: '1rem' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label>CTA Button Text</label>
                    <input type="text" value={formData.ctaText || ''} onChange={(e) => setFormData({...formData, ctaText: e.target.value})} className="admin-input" />
                  </div>
                  <div>
                    <label>CTA Button Link</label>
                    <input type="text" value={formData.ctaLink || ''} onChange={(e) => setFormData({...formData, ctaLink: e.target.value})} className="admin-input" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'TESTIMONIALS' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ margin: 0 }}>Client Testimonials</label>
                  <button type="button" className="btn-secondary" onClick={() => handleArrayAdd('items', { name: '', role: '', company: '', content: '' })}>+ Add Testimonial</button>
                </div>
                
                {(formData.items || []).map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <button type="button" onClick={() => handleArrayRemove('items', idx)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                      <input type="text" placeholder="Name" required value={item.name} onChange={(e) => handleArrayChange('items', idx, 'name', e.target.value)} className="admin-input" />
                      <input type="text" placeholder="Role (e.g. CEO)" value={item.role} onChange={(e) => handleArrayChange('items', idx, 'role', e.target.value)} className="admin-input" />
                      <input type="text" placeholder="Company" value={item.company} onChange={(e) => handleArrayChange('items', idx, 'company', e.target.value)} className="admin-input" />
                    </div>
                    <textarea placeholder="Testimonial content..." required rows="2" value={item.content} onChange={(e) => handleArrayChange('items', idx, 'content', e.target.value)} className="admin-input"></textarea>
                  </div>
                ))}
                {(!formData.items || formData.items.length === 0) && <p style={{ color: '#64748b' }}>No testimonials added yet.</p>}
              </>
            )}

            {activeTab === 'FAQ' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ margin: 0 }}>Frequently Asked Questions</label>
                  <button type="button" className="btn-secondary" onClick={() => handleArrayAdd('items', { question: '', answer: '' })}>+ Add FAQ</button>
                </div>
                
                {(formData.items || []).map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <button type="button" onClick={() => handleArrayRemove('items', idx)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
                    
                    <input type="text" placeholder="Question" required value={item.question} onChange={(e) => handleArrayChange('items', idx, 'question', e.target.value)} className="admin-input" style={{ marginBottom: '0.5rem' }} />
                    <textarea placeholder="Answer" required rows="2" value={item.answer} onChange={(e) => handleArrayChange('items', idx, 'answer', e.target.value)} className="admin-input"></textarea>
                  </div>
                ))}
                {(!formData.items || formData.items.length === 0) && <p style={{ color: '#64748b' }}>No FAQs added yet.</p>}
              </>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminHomepage;
