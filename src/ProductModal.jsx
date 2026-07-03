import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, onAddToCart, product }) => {
  const [selectedSize, setSelectedSize] = useState('M');

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, size: selectedSize });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={32} />
        </button>

        <div className="modal-image-container">
          <img src={product.image} alt={product.name} className="modal-image" />
        </div>

        <div className="modal-details">
          <h2 className="modal-title">{product.name}</h2>
          <div className="modal-price">{product.price}</div>
          
          <p className="modal-desc">
            {product.description || "T-Shirt 100% recyclé, fait à la main avec soin par nos artisans passionnés. Chaque pièce est unique, comme la petite fleur brodée qui symbolise notre engagement positif envers la planète."}
          </p>

          <div className="size-selector">
            {['S', 'M', 'L', 'XL'].map(size => (
              <button 
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <button className="add-to-cart-btn" onClick={handleAdd}>
            <ShoppingBag size={20} />
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
