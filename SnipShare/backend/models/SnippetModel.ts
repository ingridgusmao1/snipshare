import pool from '../config/database';
import { Snippet, CreerSnippetDTO, ModifierSnippetDTO } from '../types/types';

class SnippetModel {
  

  async creer(idUtilisateur: number, data: CreerSnippetDTO): Promise<Snippet> {
    const query = `
      INSERT INTO snippet (id_utilisateur, titre, langage, code, description, visibilité)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      idUtilisateur,
      data.titre,
      data.langage,
      data.code,
      data.description || null,
      data.visibilité
    ]);
    
    const snippet = result.rows[0];
    
    if (data.tags && data.tags.length > 0) {
      await this.ajouterTags(snippet.id, data.tags);
    }
    
    return snippet;
  }

]
  async trouverParId(id: number): Promise<Snippet | null> {
    const query = `
      SELECT * FROM snippet_avec_likes
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

]
  async obtenirPublics(page: number = 1, limit: number = 12): Promise<{ snippets: Snippet[], total: number }> {
    const offset = (page - 1) * limit;
    
    const countQuery = `SELECT COUNT(*) FROM snippet WHERE visibilité = 'public'`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    
    const query = `
      SELECT * FROM snippet_avec_likes
      WHERE visibilité = 'public'
      ORDER BY créé_le DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    return {
      snippets: result.rows,
      total
    };
  }



  async obtenirParUtilisateur(idUtilisateur: number, inclurePrives: boolean = false): Promise<Snippet[]> {
    let query = `
      SELECT * FROM snippet_avec_likes
      WHERE id_utilisateur = $1
    `;
    
    if (!inclurePrives) {
      query += ` AND visibilité = 'public'`;
    }
    
    query += ` ORDER BY créé_le DESC`;
    
    const result = await pool.query(query, [idUtilisateur]);
    return result.rows;
  }


  async rechercher(
    terme: string,
    langage?: string,
    page: number = 1,
    limit: number = 12
  ): Promise<{ snippets: Snippet[], total: number }> {
    const offset = (page - 1) * limit;
    let conditions = [`visibilité = 'public'`];
    const params: any[] = [];
    let paramIndex = 1;
    
    if (terme) {
      conditions.push(`(titre ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${terme}%`);
      paramIndex++;
    }
    
    if (langage) {
      conditions.push(`langage = $${paramIndex}`);
      params.push(langage);
      paramIndex++;
    }
    
    const whereClause = conditions.join(' AND ');
    
    const countQuery = `SELECT COUNT(*) FROM snippet WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    const query = `
      SELECT * FROM snippet_avec_likes
      WHERE ${whereClause}
      ORDER BY créé_le DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const result = await pool.query(query, [...params, limit, offset]);
    
    return {
      snippets: result.rows,
      total
    };
  }


  async modifier(id: number, idUtilisateur: number, data: ModifierSnippetDTO): Promise<Snippet | null> {

    const verif = await pool.query('SELECT id_utilisateur FROM snippet WHERE id = $1', [id]);
    if (!verif.rows[0] || verif.rows[0].id_utilisateur !== idUtilisateur) {
      return null;
    }
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (data.titre !== undefined) {
      updates.push(`titre = $${paramIndex++}`);
      values.push(data.titre);
    }
    if (data.langage !== undefined) {
      updates.push(`langage = $${paramIndex++}`);
      values.push(data.langage);
    }
    if (data.code !== undefined) {
      updates.push(`code = $${paramIndex++}`);
      values.push(data.code);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.visibilité !== undefined) {
      updates.push(`visibilité = $${paramIndex++}`);
      values.push(data.visibilité);
    }
    
    if (updates.length === 0) {
      return await this.trouverParId(id);
    }
    
    values.push(id);
    const query = `
      UPDATE snippet
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (data.tags !== undefined) {
      await this.supprimerTags(id);
      if (data.tags.length > 0) {
        await this.ajouterTags(id, data.tags);
      }
    }
    
    return result.rows[0];
  }


  async supprimer(id: number, idUtilisateur: number): Promise<boolean> {
    const query = `
      DELETE FROM snippet
      WHERE id = $1 AND id_utilisateur = $2
      RETURNING id
    `;
    const result = await pool.query(query, [id, idUtilisateur]);
    return result.rowCount !== null && result.rowCount > 0;
  }


  async obtenirTags(idSnippet: number): Promise<string[]> {
    const query = `
      SELECT e.nom
      FROM étiquette e
      JOIN possède p ON e.id = p.id_étiquette
      WHERE p.id_snippet = $1
    `;
    const result = await pool.query(query, [idSnippet]);
    return result.rows.map(row => row.nom);
  }


  private async ajouterTags(idSnippet: number, tags: string[]): Promise<void> {

    const tagsLimites = tags.slice(0, 5);
    
    for (const nomTag of tagsLimites) {

        let tagId: number;
      
      const existant = await pool.query('SELECT id FROM étiquette WHERE nom = $1', [nomTag.toLowerCase()]);
      
      if (existant.rows.length > 0) {
        tagId = existant.rows[0].id;

        await pool.query('UPDATE étiquette SET usage = usage + 1 WHERE id = $1', [tagId]);
      } else {

        const nouveau = await pool.query(
          'INSERT INTO étiquette (nom, usage) VALUES ($1, 1) RETURNING id',
          [nomTag.toLowerCase()]
        );
        tagId = nouveau.rows[0].id;
      }
      
      await pool.query(
        'INSERT INTO possède (id_snippet, id_étiquette) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [idSnippet, tagId]
      );
    }
  }


  private async supprimerTags(idSnippet: number): Promise<void> {
    await pool.query(`
      UPDATE étiquette
      SET usage = usage - 1
      WHERE id IN (SELECT id_étiquette FROM possède WHERE id_snippet = $1)
    `, [idSnippet]);
    
    await pool.query('DELETE FROM possède WHERE id_snippet = $1', [idSnippet]);
  }


  async obtenirPopulaires(limit: number = 10): Promise<Snippet[]> {
    const query = `
      SELECT * FROM snippet_avec_likes
      WHERE visibilité = 'public'
      ORDER BY nb_likes DESC, créé_le DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

export default new SnippetModel();