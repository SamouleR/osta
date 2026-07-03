import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

const ProductPage = ({ onAddToCart, products }) => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('M');

  // Find the product by ID, fallback to first product if not found
  const product = products.find(p => p.id === parseInt(id)) || products[0];

  const handleAdd = () => {
    onAddToCart({ ...product, size: selectedSize });
  };

  return (
    <main className="product-showcase-container animate-fade-in">
      
      {/* Carousel Section (Left) */}
      <div className="product-carousel">
        <Link to={`/produit/${product.id === 1 ? products.length : product.id - 1}`} className="carousel-arrow-btn left">
          <img src="/Polygon 2.svg" alt="Précédent" style={{ width: '60px' }} />
        </Link>
        
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="main-mannequin-image" />
        </div>
        
        <Link to={`/produit/${(product.id % products.length) + 1}`} className="carousel-arrow-btn right">
          <img src="/Polygon 1.svg" alt="Suivant" style={{ width: '60px' }} />
        </Link>
      </div>

      {/* Details Section (Right) */}
      <div className="product-info-panel">
        <div className="info-header">
          <h1 className="product-main-title">{product.name} :</h1>
          <div className="title-divider"></div>
        </div>
        
        <p className="product-main-desc">
          {product.description.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        {/* Size details */}
        <div className="product-size-selector">
          <span className="size-label">Taille :</span>
          <div className="size-options">
            {['S', 'M', 'L', 'XL'].map(size => (
              <button 
                key={size}
                className={`size-btn-large ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button className="acheter-btn-large" onClick={handleAdd}>
          acheter
        </button>
      </div>

    </main>
  );
};

export default ProductPage;
