import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreatorCard from '../../components/creators/CreatorCard';
import { CREATORS_DATA } from '../../data/creatorsData';
import './ForCreators.css';

const ForCreators = () => {
  const [creators, setCreators] = useState(CREATORS_DATA);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    search: '',
  });

  useEffect(() => {
    fetchCreators();
  }, [filters.category, filters.location]);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      
      const res = await fetch(`/api/public/creators?${params.toString()}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setCreators(data.data);
      } else {
        setCreators(CREATORS_DATA);
      }
    } catch (error) {
      setCreators(CREATORS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const filteredCreators = creators.filter(creator => {
    // Category filter
    if (filters.category) {
      const catLower = filters.category.toLowerCase();
      const primaryCat = (creator.primaryCategory || creator.category || '').toLowerCase();
      const matchesCat = primaryCat.includes(catLower) || 
        (creator.secondaryCategories && creator.secondaryCategories.some(sc => sc.toLowerCase().includes(catLower)));
      if (!matchesCat) return false;
    }

    // Location filter
    if (filters.location) {
      const locLower = filters.location.toLowerCase();
      const city = (creator.city || '').toLowerCase();
      const state = (creator.state || '').toLowerCase();
      const country = (creator.country || '').toLowerCase();
      if (!city.includes(locLower) && !state.includes(locLower) && !country.includes(locLower)) return false;
    }

    // Search query filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const name = (creator.displayName || creator.name || '').toLowerCase();
      const username = (creator.instagramUsername || '').toLowerCase();
      const cat = (creator.primaryCategory || creator.category || '').toLowerCase();
      const city = (creator.city || '').toLowerCase();
      return (
        name.includes(searchLower) || 
        username.includes(searchLower) || 
        cat.includes(searchLower) || 
        city.includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="creators-directory-container">
      {/* Hero Section */}
      <section className="creators-hero">
        <div className="creators-hero-content">
          <span className="hero-eyebrow">FOR CREATORS</span>
          <h1>Get Discovered by Brands Looking to Collaborate.</h1>
          <p>Create your profile on C-PEB and make it easier for relevant brands and businesses to discover you for campaigns, partnerships and promotions.</p>
          <div className="hero-actions">
            <Link to="/for-creators/register" className="btn-primary-hero">CREATE YOUR PROFILE &rarr;</Link>
            <a href="#directory" className="btn-secondary-hero">BROWSE CREATORS &rarr;</a>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section id="directory" className="directory-section">
        <div className="directory-header">
          <h2>Discover Creators</h2>
          <p>Explore approved creators across categories, locations and audience types.</p>
        </div>

        <div className="directory-filters">
          <input 
            type="text" 
            className="filter-search" 
            placeholder="Search by name, category, or location..." 
            value={filters.search}
            onChange={handleSearchChange}
          />
          <select 
            className="filter-select"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bhojpuri Cinema">Bhojpuri Cinema</option>
            <option value="Music">Music</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Fitness">Fitness</option>
            <option value="Film">Film</option>
          </select>
          <input 
            type="text" 
            className="filter-select" 
            placeholder="Location (e.g. Bihar, Delhi)"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading creators...</div>
        ) : (
          <div className="creators-grid">
            {filteredCreators.length > 0 ? (
              filteredCreators.map(creator => (
                <CreatorCard key={creator._id || creator.slug} creator={creator} />
              ))
            ) : (
              <div className="no-results">
                <h3>No creators found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ForCreators;
