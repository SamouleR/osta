import React from 'react';
import { Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ user, cartItems, setCartItems }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemove = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const navigate = useNavigate(); // Add this at the top of CartPage

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    if (!user) {
      alert("Veuillez vous connecter pour valider votre commande.");
      navigate('/login');
      return;
    }
    
    if (!user.address || !user.postal_code || !user.city) {
      alert("Veuillez renseigner votre adresse de livraison avant de valider votre commande.");
      navigate('/compte');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems,
          totalPrice: total
        }),
      });
      
      if (response.ok) {
        alert('Commande validée avec succès ! Merci pour votre achat.');
        setCartItems([]);
      } else {
        alert('Erreur lors de la validation de la commande.');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="cart-page-container animate-fade-in">
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <h1 className="cart-title" style={{ marginBottom: '2rem' }}>Votre Panier</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Votre panier est vide.</p>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>Taille : {item.size}</p>
                    <p>Qté : {item.quantity}</p>
                  </div>
                  <div className="cart-item-price">
                    {item.price.toFixed(2)} €
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.id, item.size)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Récapitulatif</h2>
              <div className="summary-row">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="summary-row">
                <span>Livraison</span>
                <span>Calculé à l'étape suivante</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              
              <button className="checkout-btn" onClick={handleCheckout}>
                VALIDER LA COMMANDE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
