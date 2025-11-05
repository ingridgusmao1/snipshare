import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestWithUser } from '../middlewares/authMiddleware';
import SnippetModel from '../models/SnippetModel';
import InteractionModel from '../models/InteractionModel';
import { CreerSnippetDTO, ModifierSnippetDTO } from '../types/types';

class SnippetController {
  

  validationCreation = [
    body('titre')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Le titre doit contenir entre 3 et 255 caractères'),
    
    body('langage')
      .trim()
      .notEmpty()
      .withMessage('Le langage est requis'),
    
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Le code est requis'),
    
    body('description')
      .optional()
      .trim(),
    
    body('visibilité')
      .isIn(['public', 'privé', 'non-répertorié'])
      .withMessage('Visibilité invalide'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Les tags doivent être un tableau')
      .custom((tags: string[]) => tags.length <= 5)
      .withMessage('Maximum 5 tags autorisés')
  ];


  creer = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Données invalides',
          details: errors.array()
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
        return;
      }

      const data: CreerSnippetDTO = req.body;
      const snippet = await SnippetModel.creer(req.user.userId, data);
      
      const tags = await SnippetModel.obtenirTags(snippet.id);

      res.status(201).json({
        success: true,
        message: 'Snippet créé avec succès',
        data: { ...snippet, tags }
      });
    } catch (error) {
      console.error('Erreur création snippet:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création du snippet'
      });
    }
  };


  obtenirPublics = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const { snippets, total } = await SnippetModel.obtenirPublics(page, limit);
      
      const snippetsAvecTags = await Promise.all(
        snippets.map(async (snippet) => ({
          ...snippet,
          tags: await SnippetModel.obtenirTags(snippet.id)
        }))
      );

      res.json({
        success: true,
        data: snippetsAvecTags,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur obtention snippets:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des snippets'
      });
    }
  };


  obtenirParId = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id!);
      const snippet = await SnippetModel.trouverParId(id);

      if (!snippet) {
        res.status(404).json({
          success: false,
          error: 'Snippet non trouvé'
        });
        return;
      }

      if (snippet.visibilité === 'privé') {
        if (!req.user || req.user.userId !== snippet.id_utilisateur) {
          res.status(403).json({
            success: false,
            error: 'Accès non autorisé'
          });
          return;
        }
      }

      const tags = await SnippetModel.obtenirTags(snippet.id);
      const commentaires = await InteractionModel.obtenirCommentaires(snippet.id);
      const aLike = req.user 
        ? await InteractionModel.aLike(req.user.userId, snippet.id)
        : false;

      res.json({
        success: true,
        data: {
          ...snippet,
          tags,
          commentaires,
          aLike
        }
      });
    } catch (error) {
      console.error('Erreur obtention snippet:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du snippet'
      });
    }
  };


  rechercher = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      const terme = (req.query.q as string) || '';
      const langage = req.query.langage as string | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;

      const { snippets, total } = await SnippetModel.rechercher(
        terme,
        langage,
        page,
        limit
      );

      const snippetsAvecTags = await Promise.all(
        snippets.map(async (snippet) => ({
          ...snippet,
          tags: await SnippetModel.obtenirTags(snippet.id)
        }))
      );

      res.json({
        success: true,
        data: snippetsAvecTags,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur recherche:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la recherche'
      });
    }
  };


  modifier = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
        return;
      }

      const id = parseInt(req.params.id!);
      const data: ModifierSnippetDTO = req.body;

      const snippet = await SnippetModel.modifier(id, req.user.userId, data);

      if (!snippet) {
        res.status(404).json({
          success: false,
          error: 'Snippet non trouvé ou accès non autorisé'
        });
        return;
      }

      const tags = await SnippetModel.obtenirTags(snippet.id);

      res.json({
        success: true,
        message: 'Snippet modifié avec succès',
        data: { ...snippet, tags }
      });
    } catch (error) {
      console.error('Erreur modification snippet:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la modification du snippet'
      });
    }
  };


  supprimer = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
        return;
      }

      const id = parseInt(req.params.id!);
      const supprime = await SnippetModel.supprimer(id, req.user.userId);

      if (!supprime) {
        res.status(404).json({
          success: false,
          error: 'Snippet non trouvé ou accès non autorisé'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Snippet supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression snippet:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du snippet'
      });
    }
  };


  obtenirPopulaires = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const snippets = await SnippetModel.obtenirPopulaires(limit);

      const snippetsAvecTags = await Promise.all(
        snippets.map(async (snippet) => ({
          ...snippet,
          tags: await SnippetModel.obtenirTags(snippet.id)
        }))
      );

      res.json({
        success: true,
        data: snippetsAvecTags
      });
    } catch (error) {
      console.error('Erreur snippets populaires:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des snippets populaires'
      });
    }
  };


  toggleLike = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
        return;
      }

      const idSnippet = parseInt(req.params.id!);
      
      const snippet = await SnippetModel.trouverParId(idSnippet);
      if (!snippet) {
        res.status(404).json({
          success: false,
          error: 'Snippet non trouvé'
        });
        return;
      }

      const dejaLike = await InteractionModel.aLike(req.user.userId, idSnippet);

      let message: string;
      if (dejaLike) {
        await InteractionModel.retirerLike(req.user.userId, idSnippet);
        message = 'Like retiré';
      } else {
        await InteractionModel.ajouterLike(req.user.userId, idSnippet);
        message = 'Like ajouté';
      }

      const nbLikes = await InteractionModel.compterLikes(idSnippet);

      res.json({
        success: true,
        message,
        data: {
          liked: !dejaLike,
          nbLikes
        }
      });
    } catch (error) {
      console.error('Erreur toggle like:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'action'
      });
    }
  };


  ajouterCommentaire = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
        return;
      }

      const idSnippet = parseInt(req.params.id!);
      const { contenu } = req.body;

      if (!contenu || contenu.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Le contenu du commentaire est requis'
        });
        return;
      }

      const commentaire = await InteractionModel.ajouterCommentaire(
        req.user.userId,
        idSnippet,
        { contenu }
      );

      res.status(201).json({
        success: true,
        message: 'Commentaire ajouté',
        data: commentaire
      });
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'ajout du commentaire'
      });
    }
  };
}

export default new SnippetController();