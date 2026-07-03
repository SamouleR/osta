import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

const AccountPage = ({ user, onLogout, onUpdateUser }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('infos'); // 'infos' or 'orders'
  
  // Profile form state
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddress(user.address || '');
    setPostalCode(user.postal_code || '');
    setCity(user.city || '');
    setPhone(user.phone || '');

    // Fetch user orders
    fetch(`http://localhost:3001/api/orders/${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Erreur chargement commandes:", err));
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, postal_code: postalCode, city, phone })
      });
      if (response.ok) {
        alert('Informations mises à jour avec succès !');
        // Update user state globally so the cart knows about the new address
        if (onUpdateUser) {
          onUpdateUser({ ...user, address, postal_code: postalCode, city, phone });
        }
      } else {
        alert('Erreur lors de la mise à jour.');
      }
    } catch (err) {
      alert('Erreur serveur.');
    }
  };

  if (!user) return null;

  return (
    <div className="login-page-container animate-fade-in">
      <div className="login-card-form" style={{ maxWidth: '800px' }}>
        <div className="login-header">
          <img src="/logo/osta-logo.svg" alt="OSTA Logo" className="login-logo" onError={(e) => { e.target.style.display='none' }} />
          <h1 className="form-title">Mon Compte</h1>
          <p className="form-subtitle">Bienvenue, {user.name} !</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('infos')}
            style={{ 
              background: 'none', border: 'none', color: activeTab === 'infos' ? 'var(--primary-pink)' : 'white', 
              padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
              borderBottom: activeTab === 'infos' ? '2px solid var(--primary-pink)' : 'none'
            }}>
            Mes Informations
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ 
              background: 'none', border: 'none', color: activeTab === 'orders' ? 'var(--primary-pink)' : 'white', 
              padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
              borderBottom: activeTab === 'orders' ? '2px solid var(--primary-pink)' : 'none'
            }}>
            Mes Commandes
          </button>
        </div>

        <div className="account-content">
          
          {activeTab === 'infos' && (
            <form onSubmit={handleUpdateProfile} className="unified-form">
              <div className="form-group">
                <label>Nom</label>
                <div className="input-with-icon">
                  <input type="text" style={{paddingLeft: '1rem'}} value={user.name} disabled />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <input type="email" style={{paddingLeft: '1rem'}} value={user.email} disabled />
                </div>
              </div>

              <div className="form-group" style={{marginTop: '1rem'}}>
                <label>Adresse de livraison</label>
                <div className="input-with-icon">
                  <input type="text" style={{paddingLeft: '1rem'}} value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Code Postal</label>
                  <div className="input-with-icon">
                    <input type="text" style={{paddingLeft: '1rem'}} value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ville</label>
                  <div className="input-with-icon">
                    <input type="text" style={{paddingLeft: '1rem'}} value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <div className="input-with-icon">
                  <input type="tel" style={{paddingLeft: '1rem'}} value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="submit-btn-pink" style={{ marginTop: '2rem' }}>
                ENREGISTRER LES MODIFICATIONS
              </button>
            </form>
          )}

          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <p style={{ color: '#cbd5e1', textAlign: 'center', padding: '2rem' }}>Vous n'avez passé aucune commande pour le moment.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Commande #{order.id}</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                          Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{order.total_price.toFixed(2)} €</p>
                        <span style={{ 
                          display: 'inline-block', 
                          marginTop: '0.5rem',
                          padding: '0.3rem 0.8rem', 
                          background: 'rgba(244, 143, 172, 0.2)', 
                          color: 'var(--primary-pink)', 
                          borderRadius: '20px', 
                          fontSize: '0.8rem' 
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button 
              onClick={() => {
                onLogout();
                navigate('/');
              }} 
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '0.8rem 2rem',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,0,0,0.2)';
                e.target.style.borderColor = 'red';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              SE DÉCONNECTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
