import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shirt, Music, Coffee, Camera, Dumbbell, Video } from 'lucide-react';
import './Categories.css';

const categories = [
  { label: 'Cinema',        count: 6, icon: <Video size={18} />,    colorClass: 'cat-color-1' },
  { label: 'Entertainment', count: 2, icon: <Sparkles size={18} />, colorClass: 'cat-color-2' },
  { label: 'Fitness',       count: 1, icon: <Dumbbell size={18} />, colorClass: 'cat-color-8' },
  { label: 'Music',         count: 1, icon: <Music size={18} />,    colorClass: 'cat-color-3' },
  { label: 'Lifestyle',     count: 2, icon: <Shirt size={18} />,    colorClass: 'cat-color-4' },
  { label: 'Vloggers',      count: 1, icon: <Camera size={18} />,   colorClass: 'cat-color-10' },
];

const Categories = () => (
  <section className="categories-section" id="categories">
    <div className="container">
      <div className="categories-head">
        <span className="categories-eyebrow">DISCOVER</span>
        <h2 className="categories-title">Influencers by Category</h2>
        <p className="categories-desc">Find the perfect creators across our top-performing niches.</p>
      </div>
      
      <div className="categories-grid">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/influencers/${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="cat-card"
          >
            <div className={`cat-icon-wrap ${cat.colorClass}`}>
              {cat.icon}
            </div>
            <div className="cat-info">
              <h3 className="cat-label">{cat.label}</h3>
              <p className="cat-count">{cat.count} creators</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
