import pool from '../libs/database';
import { Commentaire, Like, CreerCommentaireDTO } from '../types/types';

class InteractionModel {
  

  async ajouterLike(idUtilisateur: number, idSnippet: number): Promise<boolean> {
    try {
      const query = `
        INSERT INTO aimé (id_utilisateur, id_snippet)
        VALUES ($1, $2)
      `;
      await pool.query(query, [idUtilisateur, idSnippet]);
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        return false;
      }
      throw error;
    }
  }


  async retirerLike(idUtilisateur: number, idSnippet: number): Promise<boolean> {
    const query = `
      DELETE FROM aimé
      WHERE id_utilisateur = $1 AND id_snippet = $2
    `;
    const result = await pool.query(query, [idUtilisateur, idSnippet]);
    return result.rowCount !== null && result.rowCount > 0;
  }


  async aLike(idUtilisateur: number, idSnippet: number): Promise<boolean> {
    const query = `
      SELECT 1 FROM aimé
      WHERE id_utilisateur = $1 AND id_snippet = $2
    `;
    const result = await pool.query(query, [idUtilisateur, idSnippet]);
    return result.rows.length > 0;
  }


  async compterLikes(idSnippet: number): Promise<number> {
    const query = `SELECT COUNT(*) FROM aimé WHERE id_snippet = $1`;
    const result = await pool.query(query, [idSnippet]);
    return parseInt(result.rows[0].count);
  }


  async obtenirUtilisateursQuiOntLike(idSnippet: number): Promise<Array<{ id: number, nom_utilisateur: string }>> {
    const query = `
      SELECT u.id, u.nom_utilisateur
      FROM utilisateur u
      JOIN aimé a ON u.id = a.id_utilisateur
      WHERE a.id_snippet = $1
      ORDER BY a.créé_le DESC
    `;
    const result = await pool.query(query, [idSnippet]);
    return result.rows;
  }

  

  async ajouterCommentaire(
    idUtilisateur: number,
    idSnippet: number,
    data: CreerCommentaireDTO
  ): Promise<Commentaire> {
    const query = `
      INSERT INTO commenté (id_utilisateur, id_snippet, contenu)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [idUtilisateur, idSnippet, data.contenu]);
    return result.rows[0];
  }


  async obtenirCommentaires(idSnippet: number): Promise<Commentaire[]> {
    const query = `
      SELECT c.*, u.nom_utilisateur
      FROM commenté c
      JOIN utilisateur u ON c.id_utilisateur = u.id
      WHERE c.id_snippet = $1
      ORDER BY c.créé_le DESC
    `;
    const result = await pool.query(query, [idSnippet]);
    return result.rows;
  }


  async supprimerCommentaire(
    idCommentaire: number,
    idUtilisateur: number
  ): Promise<boolean> {
    const query = `
      DELETE FROM commenté
      WHERE id = $1 AND id_utilisateur = $2
      RETURNING id
    `;
    const result = await pool.query(query, [idCommentaire, idUtilisateur]);
    return result.rowCount !== null && result.rowCount > 0;
  }


  async compterCommentaires(idSnippet: number): Promise<number> {
    const query = `SELECT COUNT(*) FROM commenté WHERE id_snippet = $1`;
    const result = await pool.query(query, [idSnippet]);
    return parseInt(result.rows[0].count);
  }
}

export default new InteractionModel();