// HomePage.tsx - Page d'accueil
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Page d'accueil du site SnipShare
 * Affiche le hero, les fonctionnalités et le CTA
 */
const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Partagez vos snippets de code en toute sécurité</h1>
            <p className="hero-subtitle">
              La plateforme collaborative pour les agents de la collectivité territoriale. 
              Stockez, partagez et commentez vos morceaux de code réutilisables.
            </p>
            <div className="hero-buttons">
              <Link to="/inscription" className="btn btn-primary btn-large">
                Commencer maintenant
              </Link>
              <Link to="/explorer" className="btn btn-primary btn-large">
                Explorer les snippets
              </Link>
            </div>
          </div>
          
          <div className="hero-illustration">
            <div className="code-card">
              <div className="code-card-header">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="code-card-body">
                <pre><code>{`function shareCode() {
  const snippet = {
    title: "Ma fonction",
    language: "JavaScript"
  };
  return snippet;
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 className="section-title" style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '3rem',
            fontFamily: 'Play, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Fonctionnalités principales
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="snippet-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                fontFamily: 'Play, sans-serif',
                textTransform: 'uppercase'
              }}>Sécurisé</h3>
              <p style={{ color: '#6b6b6b' }}>
                Authentification robuste avec gestion des droits d'accès et visibilité personnalisable.
              </p>
            </div>

            <div className="snippet-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                fontFamily: 'Play, sans-serif',
                textTransform: 'uppercase'
              }}>Collaboratif</h3>
              <p style={{ color: '#6b6b6b' }}>
                Commentez et likez les snippets de vos collègues pour enrichir la base de connaissances.
              </p>
            </div>

            <div className="snippet-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                fontFamily: 'Play, sans-serif',
                textTransform: 'uppercase'
              }}>Recherche puissante</h3>
              <p style={{ color: '#6b6b6b' }}>
                Trouvez rapidement le code dont vous avez besoin grâce aux tags et filtres avancés.
              </p>
            </div>

            <div className="snippet-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                fontFamily: 'Play, sans-serif',
                textTransform: 'uppercase'
              }}>Responsive</h3>
              <p style={{ color: '#6b6b6b' }}>
                Accédez à vos snippets depuis n'importe quel appareil, ordinateur ou mobile.
              </p>
            </div>

            <div className="snippet-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                fontFamily: 'Play, sans-serif',
                textTransform: 'uppercase'
              }}>Multi-langages</h3>
              <p style={{ color: '#6b6b6b' }}>
                Support de tous les langages de programmation populaires avec coloration syntaxique.
              </p>
            </div>

            <div className="snippet-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                fontFamily: 'Play, sans-serif',
                textTransform: 'uppercase'
              }}>Statistiques</h3>
              <p style={{ color: '#6b6b6b' }}>
                Suivez vos contributions et découvrez les snippets les plus populaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontFamily: 'Play, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Prêt à partager votre code ?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Rejoignez la communauté des développeurs de la collectivité
          </p>
          <Link to="/inscription" className="btn btn-primary btn-large">
            Créer mon compte
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;