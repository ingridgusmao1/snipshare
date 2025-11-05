
export interface Utilisateur {
  id: number;
  nom_utilisateur: string;
  email: string;
  mot_de_passe: string;
  créé_le: Date;
  visibilité: 'public' | 'privé';
}

export interface UtilisateurSansMotDePasse {
  id: number;
  nom_utilisateur: string;
  email: string;
  créé_le: Date;
  visibilité: 'public' | 'privé';
}

export interface CreerUtilisateurDTO {
  nom_utilisateur: string;
  email: string;
  mot_de_passe: string;
}

export interface ConnexionDTO {
  email: string;
  mot_de_passe: string;
}

export interface Snippet {
  id: number;
  id_utilisateur: number;
  titre: string;
  langage: string;
  code: string;
  description: string | null;
  créé_le: Date;
  visibilité: 'public' | 'privé' | 'non-répertorié';
  nb_likes?: number; 
}

export interface CreerSnippetDTO {
  titre: string;
  langage: string;
  code: string;
  description?: string;
  visibilité: 'public' | 'privé' | 'non-répertorié';
  tags?: string[]; 
}

export interface ModifierSnippetDTO {
  titre?: string;
  langage?: string;
  code?: string;
  description?: string;
  visibilité?: 'public' | 'privé' | 'non-répertorié';
  tags?: string[];
}

export interface Commentaire {
  id: number;
  id_utilisateur: number;
  id_snippet: number;
  contenu: string;
  créé_le: Date;
  nom_utilisateur?: string; 
}

export interface CreerCommentaireDTO {
  contenu: string;
}

export interface Etiquette {
  id: number;
  nom: string;
  usage: number;
}

export interface Like {
  id_utilisateur: number;
  id_snippet: number;
  créé_le: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}