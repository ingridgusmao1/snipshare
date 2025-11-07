// useAuth.ts - Hook personnalisé pour gérer l'authentification
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: number;
  nom_utilisateur: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  connexion: (email: string, motDePasse: string) => Promise<any>;
  inscription: (data: any) => Promise<any>;
  deconnexion: () => Promise<void>;
}

// Créer le contexte d'authentification
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook personnalisé useAuth
 * Permet d'accéder aux fonctions d'authentification depuis n'importe quel composant
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Pour l'instant, retourner des valeurs par défaut
    // TODO: Implémenter AuthProvider dans App.tsx
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      connexion: async () => {},
      inscription: async () => {},
      deconnexion: async () => {}
    };
  }
  return context;
};

export default useAuth;