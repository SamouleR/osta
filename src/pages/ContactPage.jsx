import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page-container animate-fade-in">
      <div className="single-card-form">
        <h1 className="form-title">Contactez-nous</h1>
        <p className="form-subtitle">Une question ? Un problème ? Nous sommes là pour vous.</p>

        <img src="/logo/OSTA.svg" alt="OSTA" className="contact-logo" onError={(e) => { e.target.style.display='none' }} />
        <form className="unified-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label>NOM</label>
              <input type="text" placeholder="Votre nom complet" />
            </div>
            <div className="form-group">
              <label>TÉLÉPHONE</label>
              <input type="tel" placeholder="06 12 34 56 78" />
            </div>
          </div>

          <div className="form-group">
            <label>EMAIL</label>
            <input type="email" placeholder="exemple@gmail.com" />
          </div>

          <div className="form-group">
            <label>MESSAGE</label>
            <textarea rows="4" placeholder="Décrivez votre besoin..."></textarea>
          </div>

          <button type="submit" className="submit-btn-pink">
            ENVOYER LA DEMANDE
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
