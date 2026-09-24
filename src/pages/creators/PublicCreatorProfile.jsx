import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CREATORS_DATA } from '../../data/creatorsData';
import './PublicCreatorProfile.css';

const PublicCreatorProfile = () => {
  const { slug } = useParams();
  const [creator, setCreator] = useState(() => CREATORS_DATA.find(c => c.slug === slug) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCreator();
  }, [slug]);

  const fetchCreator = async () => {
    try {
      const res = await fetch(`/api/public/creators/${slug}`);
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      
      if (data.success && data.data) {
        setCreator(data.data);
      } else {
        const local = CREATORS_DATA.find(c => c.slug === slug);
        if (local) setCreator(local);
        else setError(data.error || 'Creator not found');
      }
    } catch (err) {
      const local = CREATORS_DATA.find(c => c.slug === slug);
      if (local) {
        setCreator(local);
      } else {
        setError('Cannot connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '6rem', textAlign: 'center' }}>Loading...</div>;
  if (error || !creator) return <div style={{ padding: '6rem', textAlign: 'center', color: 'red' }}>{error || 'Creator not found'}</div>;

  return (
    <div className="public-profile-container">
      <header className="public-profile-header">
        <div className="profile-header-content">
          <img 
            src={creator.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.displayName)}&background=2E5C53&color=fff&size=256`} 
            alt={creator.displayName} 
            className="public-profile-img" 
          />
          <h1 className="public-profile-name">{creator.displayName}</h1>
          <div className="public-profile-category">
            {creator.primaryCategory} 
            {creator.secondaryCategories && creator.secondaryCategories.length > 0 && ` · ${creator.secondaryCategories.join(' · ')}`}
          </div>
          
          {(creator.city || creator.country) && (
            <div className="public-profile-location">
              📍 {creator.city}{creator.country ? `, ${creator.country}` : ''}
            </div>
          )}

          <div className="verified-badge">✓ C-PEB Approved Creator</div>

          {creator.primaryPlatform && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#0a7c3e', fontWeight: 600 }}>
              Primary Platform: {creator.primaryPlatform}
            </div>
          )}

          <div className="header-socials">
            {creator.socialAccounts && creator.socialAccounts.map((acc, i) => (
              <a key={i} href={acc.profileUrl} target="_blank" rel="noopener noreferrer" className="social-link-btn">
                {acc.platform} ↗
              </a>
            ))}
          </div>
        </div>
      </header>

      <main className="public-profile-body">
        {creator.bio && (
          <section className="profile-section-card">
            <h3>About</h3>
            <div className="profile-bio-text">{creator.bio}</div>
            
            {creator.languages?.length > 0 && (
              <div style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                <strong>Languages:</strong> {creator.languages.join(', ')}
              </div>
            )}

            {creator.contentTypes?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>Content Formats:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {creator.contentTypes.map((ct, idx) => (
                    <span key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {creator.collaborationInterests?.length > 0 && (
              <div style={{ marginTop: '1.25rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>Open for Collaborations:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {creator.collaborationInterests.map((ci, idx) => (
                    <span key={idx} style={{ background: '#eef9f2', border: '1px solid #a7f3d0', color: '#0a7c3e', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {ci}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {creator.socialAccounts && creator.socialAccounts.length > 0 && (
          <section className="profile-section-card">
            <h3>Audience &amp; Platforms</h3>
            <div className="stats-grid">
              {creator.socialAccounts.map((acc, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-value">{acc.followers || '0'}</div>
                  <div className="stat-label">{acc.platform} Followers</div>
                  {acc.averageViews && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Avg. {acc.averageViews} views</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {creator.portfolios && creator.portfolios.length > 0 && (
          <section className="profile-section-card">
            <h3>Featured Work</h3>
            <div className="portfolio-grid">
              {creator.portfolios.map((port, i) => (
                <div key={i} className="portfolio-card">
                  <h4>{port.title}</h4>
                  {port.description && <p>{port.description}</p>}
                  {port.url && (
                    <a href={port.url} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                      View Campaign &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="profile-section-card profile-cta-section">
          <h3>Work with {creator.displayName}</h3>
          <p>Interested in collaborating with this creator for your next campaign?</p>
          {/* Note: This should ideally link to a Contact/Enquiry form */}
          <Link to="/contact" className="btn-contact-creator">
            REQUEST COLLABORATION &rarr;
          </Link>
        </section>
      </main>
    </div>
  );
};

export default PublicCreatorProfile;
