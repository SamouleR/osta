import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const HomePage = ({ onOpenModal, products }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainProduct = products[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleProductClick = () => {
    navigate(`/produit/${mainProduct.id}`);
  };

  // Get adjacent products for side display (simulating carousel wrapping)
  const leftProduct = products[(currentIndex - 1 + products.length) % products.length];
  const rightProduct = products[(currentIndex + 1) % products.length];

  return (
    <main className="main-container animate-fade-in">
      {/* Left Section */}
      <section className="left-section">
        <h2 className="section-title">Derniers drops</h2>
        <div className="hero-card">
          
          {/* Carousel */}
          <div className="carousel-container">
            <button className="carousel-arrow left" onClick={handlePrev}>
              <img src="/Polygon 2.svg" alt="Précédent" style={{ width: '60px' }} />
            </button>
            
            <div className="product-display" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
              {products.length > 1 && (
                <img src={leftProduct.image} alt={leftProduct.name} className="product-image-side left" />
              )}
              
              <img src={mainProduct.image} alt={mainProduct.name} className="product-image" />
              
              {products.length > 1 && (
                <img src={rightProduct.image} alt={rightProduct.name} className="product-image-side right" />
              )}
            </div>
            
            <button className="carousel-arrow right" onClick={handleNext}>
              <img src="/Polygon 1.svg" alt="Suivant" style={{ width: '60px' }} />
            </button>
          </div>
          
          <div className="acheter-btn-container">
            <button className="acheter-btn" onClick={handleProductClick}>
              acheter
            </button>
          </div>

        </div>

        {/* Product Details Outside Card */}
        <div className="product-details-outside">
          <div className="product-title-row">
            <div className="product-title">{mainProduct.name} :</div>
            <div className="progress-bar-container">
              <div className="progress-bar"></div>
            </div>
          </div>
          <p className="product-desc">T-Shirt 100% recyclé, fait à la main avec soin par nos artisans passionnés. Chaque pièce est unique, conçue à partir de matières revalorisées pour un impact positif sur la planète.</p>
        </div>
      </section>

      {/* Right Section */}
      <section className="right-section">
        <div className="right-title-container">
          <h2 className="right-title">2ndvie</h2>
        </div>
        
        <p className="right-desc">
          Ici vous retrouverez notre service de réparation sur-mesure : vous envoyez vos vêtements, on leur redonne vie. En ligne ou en main propre, chaque pièce mérite une seconde chance.
        </p>
        
        <div className="decouvrir-btn-container">
          <button className="decouvrir-btn">découvrir</button>
        </div>
        
        <div className="gallery-grid">
          {['/imagesaz.jpg', '/aza.png', '/btbgtgbg.png', '/ereder.png', '/ssfrfgrf.png', '/szqfvrr.png'].map((imgSrc, idx) => (
            <div 
              key={idx} 
              className="gallery-item" 
              onClick={() => navigate(`/produit/1`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={imgSrc} alt={`Gallery ${idx}`} className="gallery-image" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
