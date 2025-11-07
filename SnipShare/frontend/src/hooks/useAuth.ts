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

const AuthContext = createContext<AuthContextType | null>(null);


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {

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