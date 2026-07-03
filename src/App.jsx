import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import ProductModal from './ProductModal';
import LoaderLogo from './LoaderLogo';
import './App.css';

import AccountPage from './pages/AccountPage';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null); // Auth state
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500); // Increased to let the animation finish
    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 1,
      name: 'OSTA Tee-Shirt',
      price: '45,00 €',
      image: '/article/tee-shirt.png',
      description: 'T-Shirt 100% recyclé, fait à la main avec soin par nos artisans passionnés. Chaque pièce est unique, comme la petite fleur brodée qui symbolise notre engagement positif envers la planète.\n\nEn choisissant ce vêtement, vous soutenez un savoir-faire local et éthique.'
    },
    {
      id: 2,
      name: 'OSTA Pull',
      price: '85,00 €',
      image: '/article/pull.png',
      description: 'Pull chaud et confortable, fabriqué à partir de fibres recyclées. Parfait pour l\'hiver tout en restant élégant et éco-responsable.\n\nUn indispensable de votre garde-robe.'
    },
    {
      id: 3,
      name: 'OSTA Polo',
      price: '55,00 €',
      image: '/article/polo.png',
      description: 'Polo classique revisité avec une touche moderne. Tissu respirant et finitions de haute qualité pour un look casual chic.\n\nIdéal pour toutes les occasions.'
    }
  ];

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      // Check if item already exists in cart with same size
      const existingItem = prev.find(i => i.id === item.id && i.size === item.size);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id && i.size === item.size 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, price: parseFloat(item.price.replace(',', '.').replace(' €', '')) }];
    });
    showNotification(`${item.name} ajouté au panier !`);
  };

  return (
    <Router>
      {isLoading && (
        <div className="loader-overlay">
          <LoaderLogo />
        </div>
      )}
      <div className="app-container">
        <Navbar cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} user={user} onLogout={() => setUser(null)} />
        
        {/* Animated Notification */}
        <div className={`cart-notification ${notification.show ? 'show' : ''}`}>
          {notification.message}
        </div>
        
        <Routes>
          <Route path="/" element={<HomePage onOpenModal={handleOpenModal} products={products} />} />
          <Route path="/produit/:id" element={<ProductPage onAddToCart={handleAddToCart} products={products} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/panier" element={<CartPage user={user} cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/login" element={<LoginPage onLogin={(userData) => setUser(userData)} />} />
          <Route path="/compte" element={<AccountPage user={user} onLogout={() => setUser(null)} onUpdateUser={(updated) => setUser(updated)} />} />
        </Routes>

        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAddToCart={handleAddToCart}
          product={selectedProduct}
        />
      </div>
    </Router>
  );
}

export default App;
