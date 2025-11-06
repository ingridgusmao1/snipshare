// Footer.tsx - Pied de page
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant Footer - Pied de page de l'application
 */
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SnipShare</h4>
            <p>Plateforme de partage de snippets pour la collectivité territoriale</p>
          </div>
          
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/explorer">Explorer</Link></li>
              <li><Link to="/recherche">Rechercher</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Compte</h4>
            <ul>
              <li><Link to="/connexion">Connexion</Link></li>
              <li><Link to="/inscription">Inscription</Link></li>
              <li><Link to="/profil">Mon profil</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">CGU</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 SnipShare - Collectivité Territoriale. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;