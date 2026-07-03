import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './App.css'; 

const Navbar = ({ cartCount, user, onLogout }) => {
  const navigate = useNavigate();

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/compte');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="nav-link" data-text="boutique" end>boutique</NavLink>
        <NavLink to="/contact" className="nav-link" data-text="contact">contact</NavLink>
      </div>
      
      <div className="nav-center">
        <Link to="/">
          <img src="/logo/OSTA.svg" alt="OSTA Logo" className="nav-logo" onError={(e) => { e.target.src = '/logo/osta-logo.svg'; }} />
        </Link>
      </div>
      
      <div className="nav-right">
        {user ? (
          <>
            <a href="#" onClick={handleAccountClick} className="nav-link active" data-text={user.name}>
              {user.name}
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); navigate('/'); }} className="nav-link" data-text="déconnexion" style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              déconnexion
            </a>
          </>
        ) : (
          <a href="#" onClick={handleAccountClick} className="nav-link" data-text="compte">
            compte
          </a>
        )}
        <NavLink to="/panier" className="nav-link" data-text="panier">
          panier<span className="text-pink">.{cartCount}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
