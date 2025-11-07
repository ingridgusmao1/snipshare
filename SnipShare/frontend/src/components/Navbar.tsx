import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const Navbar: React.FC = () => {
  const { user, isAuthenticated, deconnexion } = useAuth();
  const navigate = useNavigate();

  const handleDeconnexion = async () => {
    await deconnexion();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <span className="logo">{ }</span>
          <span className="brand-name">SnipShare</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/explorer" className="nav-link">Explorer</Link>
          <Link to="/recherche" className="nav-link">Rechercher</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/creer-snippet" className="btn btn-primary">
                + Nouveau snippet
              </Link>
              <Link to="/profil" className="nav-link">
                👤 {user?.nom_utilisateur}
              </Link>
              <button 
                onClick={handleDeconnexion} 
                className="btn btn-outline"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="btn btn-outline">
                Connexion
              </Link>
              <Link to="/inscription" className="btn btn-primary">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;