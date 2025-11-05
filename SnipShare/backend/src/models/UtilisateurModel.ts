import pool from '../config/database';
import { Utilisateur, UtilisateurSansMotDePasse, CreerUtilisateurDTO } from '../types/types';
import argon2 from 'argon2';

class UtilisateurModel {
]
  async creer(data: CreerUtilisateurDTO): Promise<UtilisateurSansMotDePasse> {
    const motDePasseHash = await argon2.hash(data.mot_de_passe);
    
    const query = `
      INSERT INTO utilisateur (nom_utilisateur, email, mot_de_passe)
      VALUES ($1, $2, $3)
      RETURNING id, nom_utilisateur, email, créé_le, visibilité
    `;
    
    const result = await pool.query(query, [
      data.nom_utilisateur,
      data.email,
      motDePasseHash
    ]);
    
    return result.rows[0];
  }


  async trouverParEmail(email: string): Promise<Utilisateur | null> {
    const query = 'SELECT * FROM utilisateur WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }


  async trouverParId(id: number): Promise<UtilisateurSansMotDePasse | null> {
    const query = `
      SELECT id, nom_utilisateur, email, créé_le, visibilité 
      FROM utilisateur 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }


  async emailExiste(email: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM utilisateur WHERE email = $1';
    const result = await pool.query(query, [email]);
    return parseInt(result.rows[0].count) > 0;
  }

  
  async nomUtilisateurExiste(nomUtilisateur: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM utilisateur WHERE nom_utilisateur = $1';
    const result = await pool.query(query, [nomUtilisateur]);
    return parseInt(result.rows[0].count) > 0;
  }

 
  async verifierMotDePasse(motDePasse: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, motDePasse);
  }


  async mettreAJourEmail(id: number, nouvelEmail: string): Promise<UtilisateurSansMotDePasse> {
    const query = `
      UPDATE utilisateur 
      SET email = $1 
      WHERE id = $2
      RETURNING id, nom_utilisateur, email, créé_le, visibilité
    `;
    const result = await pool.query(query, [nouvelEmail, id]);
    return result.rows[0];
  }


  async mettreAJourMotDePasse(id: number, nouveauMotDePasse: string): Promise<void> {
    const motDePasseHash = await argon2.hash(nouveauMotDePasse);
    const query = 'UPDATE utilisateur SET mot_de_passe = $1 WHERE id = $2';
    await pool.query(query, [motDePasseHash, id]);
  }


  async obtenirStatistiques(id: number): Promise<{
    nbSnippets: number;
    nbLikesRecus: number;
    nbCommentaires: number;
    nbLikesDonnes: number;
  }> {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM snippet WHERE id_utilisateur = $1) as nb_snippets,
        (SELECT COUNT(*) FROM aimé a 
         JOIN snippet s ON a.id_snippet = s.id 
         WHERE s.id_utilisateur = $1) as nb_likes_recus,
        (SELECT COUNT(*) FROM commenté WHERE id_utilisateur = $1) as nb_commentaires,
        (SELECT COUNT(*) FROM aimé WHERE id_utilisateur = $1) as nb_likes_donnes
    `;
    
    const result = await pool.query(query, [id]);
    return {
      nbSnippets: parseInt(result.rows[0].nb_snippets),
      nbLikesRecus: parseInt(result.rows[0].nb_likes_recus),
      nbCommentaires: parseInt(result.rows[0].nb_commentaires),
      nbLikesDonnes: parseInt(result.rows[0].nb_likes_donnes)
    };
  }
}

export default new UtilisateurModel();