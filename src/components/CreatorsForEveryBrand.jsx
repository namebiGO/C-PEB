import React from 'react';
import './CreatorsForEveryBrand.css';

const CreatorsForEveryBrand = () => {
  return (
    <section className="creators-every-brand-section">
      <div className="container">
        <div className="ceb-container">
          <div className="ceb-background"></div>
          
          <h2 className="ceb-heading">
            Creators<br />
            For Every Brand
          </h2>

          {/* Top Left Image - Travel */}
          <div className="ceb-image-wrapper ceb-top-left">
            <img src="/images/creators/elvish-yadav.webp" alt="Travel Creator" className="ceb-image" />
            <div className="ceb-pill">Travel</div>
          </div>

          {/* Top Right Image - Beauty */}
          <div className="ceb-image-wrapper ceb-top-right">
            <img src="/images/creators/wamiqa-gabbi.webp?v=3" alt="Beauty Creator" className="ceb-image" />
            <div className="ceb-pill">Beauty</div>
          </div>

          {/* Bottom Left Image - Technology */}
          <div className="ceb-image-wrapper ceb-bottom-left">
            <img src="/images/creators/rajat-dalal.webp?v=3" alt="Technology Creator" className="ceb-image" />
            <div className="ceb-pill">Technology</div>
          </div>

          {/* Bottom Right Image - Lifestyle */}
          <div className="ceb-image-wrapper ceb-bottom-right">
            <img src="/images/creators/kajal-raghwani.webp?v=4" alt="Lifestyle Creator" className="ceb-image" />
            <div className="ceb-pill">Lifestyle</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorsForEveryBrand;
