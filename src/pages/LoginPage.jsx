import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email, password } 
      : { name, email, password, address, postal_code: postalCode, city, phone };

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (response.ok) {
        if (onLogin) onLogin(data);
        alert(isLogin ? 'Connexion réussie !' : 'Compte créé avec succès !');
        navigate('/compte');
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="login-page-container animate-fade-in">
      <div className="single-card-form">
        <div className="login-header">
          <img src="/logo/osta-logo.svg" alt="OSTA Logo" className="login-logo" onError={(e) => { e.target.style.display='none' }} />
          <h1 className="form-title">{isLogin ? 'Bon retour' : 'Créer un compte'}</h1>
          <p className="form-subtitle">
            {isLogin ? 'Connectez-vous pour suivre vos commandes.' : 'Rejoignez-nous pour donner une 2ndvie à vos vêtements.'}
          </p>
        </div>

        <form className="unified-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nom Complet</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={20} />
                  <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse de livraison</label>
                <div className="input-with-icon">
                  <input type="text" style={{paddingLeft: '1rem'}} placeholder="123 rue de la mode" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Code Postal</label>
                  <div className="input-with-icon">
                    <input type="text" style={{paddingLeft: '1rem'}} placeholder="75001" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ville</label>
                  <div className="input-with-icon">
                    <input type="text" style={{paddingLeft: '1rem'}} placeholder="Paris" value={city} onChange={e => setCity(e.target.value)} required />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <div className="input-with-icon">
                  <input type="tel" style={{paddingLeft: '1rem'}} placeholder="06 12 34 56 78" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input type="email" placeholder="contact@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="submit-btn-pink">
            {isLogin ? 'SE CONNECTER' : "S'INSCRIRE"}
          </button>
        </form>

        <div className="oauth-section">
          <div className="oauth-divider">
            <span>OU CONTINUER AVEC</span>
          </div>
          <div className="oauth-buttons">
            <button className="oauth-btn google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
              Google
            </button>
            <button className="oauth-btn apple-btn">
              <svg viewBox="0 0 384 512" width="20" height="20" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>
            {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
            <button className="toggle-auth-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
