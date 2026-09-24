import React from 'react';
import { Link } from 'react-router-dom';
import './CreatorCard.css';

const CreatorCard = ({ creator }) => {
  const handle = creator.instagramUsername 
    || (creator.socialAccounts && creator.socialAccounts[0]?.username)
    || creator.slug;
  const followers = creator.followersDisplay 
    || (creator.socialAccounts && creator.socialAccounts[0]?.followers)
    || creator.followers;
  
  // Use a custom object-position if provided in the data, default to center
  const imagePosition = creator.imagePosition || "center";

  return (
    <Link to={`/creators/${creator.slug}`} className="creator-card">
      <div className="creator-card-img-wrapper">
        <img 
          src={creator.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.displayName || creator.name)}&background=2E5C53&color=fff`} 
          alt={creator.displayName || creator.name} 
          className="creator-card-img" 
          style={{ objectPosition: imagePosition }}
          loading="lazy"
        />
      </div>
      <div className="creator-card-content">
        <h3 className="creator-card-name">{creator.displayName || creator.name}</h3>
        
        {handle && (
          <p className="creator-card-handle">@{handle.replace('@', '')}</p>
        )}

        <p className="creator-card-category">{creator.primaryCategory || creator.category || 'Creator'}</p>
        
        {followers && (
          <p className="creator-card-followers">{followers} Followers</p>
        )}

        {creator.city && (
          <p className="creator-card-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            {creator.city}{creator.country ? `, ${creator.country}` : ''}
          </p>
        )}
        
        <div className="creator-card-cta">
          VIEW INSTAGRAM ↗
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
