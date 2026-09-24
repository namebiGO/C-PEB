import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Camera, PlayCircle, MapPin, Users, Activity, BarChart, Bookmark } from 'lucide-react';
import SEO from '../../components/SEO';
import './InfluencerProfile.css';

const InfluencerProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/public/influencer/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.data.influencer);
          setServices(data.data.services);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  if (loading) {
    return <div className="profile-loading"><div className="spinner"></div></div>;
  }

  if (!profile) {
    return (
      <div className="profile-error text-center" style={{ padding: '8rem 1rem' }}>
        <h2>Influencer not found</h2>
        <p>The creator you are looking for does not exist or has been removed.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/influencers/all')}>View All Creators</button>
      </div>
    );
  }

  return (
    <div className="influencer-profile-page">
      <SEO
        title={`${profile.name} | C-PEB Creator`}
        description={`Book ${profile.name} for your next campaign. Explore their services and audience stats.`}
      />

      {/* ── Profile Header ── */}
      <section className="profile-hero">
        <div className="profile-cover"></div>
        <div className="container">
          <div className="profile-header-card glass-card">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>

            <div className="profile-header-grid">
              <div className="profile-image-wrap">
                <img
                  src={profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=90'}
                  alt={profile.name}
                  className="profile-image"
                />
              </div>

              <div className="profile-info">
                <div className="profile-title-row">
                  <h1>{profile.name}</h1>
                  {profile.verified && <CheckCircle2 size={22} className="verified-badge" />}
                </div>

                <div className="profile-tags">
                  <span className="tag-category">{profile.category}</span>
                  <span className="tag-location"><MapPin size={14} /> {profile.location || 'India'}</span>
                </div>

                <p className="profile-bio">{profile.bio || `Top ${profile.category.toLowerCase()} creator sharing high-quality content and engaging with a dedicated audience. Book me for your next campaign!`}</p>

                <div className="profile-socials">
                  {profile.instagramUrl && (
                    <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-pill instagram">
                      <Camera size={16} /> Instagram
                    </a>
                  )}
                  {profile.youtubeUrl && (
                    <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="social-pill youtube">
                      <PlayCircle size={16} /> YouTube
                    </a>
                  )}
                </div>
              </div>

              <div className="profile-stats-panel">
                <div className="p-stat">
                  <Users size={18} className="p-stat-icon text-blue" />
                  <div>
                    <h4>{profile.followers}</h4>
                    <span>Followers</span>
                  </div>
                </div>
                <div className="p-stat">
                  <Activity size={18} className="p-stat-icon text-green" />
                  <div>
                    <h4>{profile.engagementRate}</h4>
                    <span>Engagement</span>
                  </div>
                </div>
                <div className="p-stat">
                  <BarChart size={18} className="p-stat-icon text-purple" />
                  <div>
                    <h4>{profile.averageReach || 'N/A'}</h4>
                    <span>Avg. Reach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="profile-services">
        <div className="container">
          <h2 className="section-title">Available Services</h2>

          {services.length === 0 ? (
            <div className="no-services">
              <p>This creator hasn't listed any specific services yet.</p>
              <button className="btn btn-secondary mt-3" onClick={() => navigate('/contact')}>Request Custom Campaign</button>
            </div>
          ) : (
            <div className="services-grid-profile">
              {services.map(s => (
                <div className="p-service-card" key={s._id}>
                  <div className="ps-image-wrap">
                    <img src={s.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80'} alt={s.title} />
                    <span className="ps-category">{s.category}</span>
                  </div>
                  <div className="ps-content">
                    <h3>{s.title}</h3>
                    <p className="ps-price">From {s.currency === 'USD' ? '$' : s.currency}{s.price.toLocaleString('en-IN')}</p>
                    <button className="btn btn-primary w-100 mt-3" onClick={() => navigate('/contact')}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InfluencerProfile;