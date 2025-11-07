import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  
  const { connexion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      await connexion(email, motDePasse);
      navigate('/explorer');
    } catch (error: any) {
      setErreur(
        error.response?.data?.error || 
        'Erreur lors de la connexion. Vérifiez vos identifiants.'
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <section style={{ 
      padding: '3rem 0', 
      minHeight: '70vh', 
      background: '#f5f1eb' 
    }}>
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            { }
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Bienvenue sur SnipShare
          </h1>
          <p style={{ color: '#6b6b6b' }}>
            Connectez-vous pour accéder à vos snippets
          </p>
        </div>

        {erreur && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c00'
          }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="votre.email@collectivite.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input type="checkbox" style={{ width: 'auto' }} />
              <span style={{ fontSize: '0.9rem' }}>Se souvenir de moi</span>
            </label>
            <a href="#" style={{
              color: '#6b7e54',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={chargement}
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #d9d0c4'
        }}>
          <p style={{ color: '#6b6b6b', marginBottom: '1rem' }}>
            Vous n'avez pas encore de compte ?
          </p>
          <Link to="/inscription" className="btn btn-outline" style={{ width: '100%' }}>
            Créer un compte
          </Link>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(107, 126, 84, 0.08)',
          borderLeft: '4px solid #6b7e54',
          borderRadius: '4px'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#6b6b6b', margin: 0 }}>
            🔒 <strong>Connexion sécurisée</strong><br />
            Vos données sont protégées par un chiffrement de bout en bout et des cookies sécurisés.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;