// App.tsx - Composant racine avec React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { 
  RegisterPage, 
  ExplorePage, 
  CreateSnippetPage, 
  SnippetDetailPage, 
  ProfilePage, 
  SearchPage 
} from './pages/index';


const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explorer" element={<ExplorePage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route path="/creer-snippet" element={<CreateSnippetPage />} />
            <Route path="/snippet/:id" element={<SnippetDetailPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/recherche" element={<SearchPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;