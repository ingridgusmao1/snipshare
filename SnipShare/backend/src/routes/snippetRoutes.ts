import { Router } from 'express';
import SnippetController from '../controllers/SnippetController';
import { verifierToken, verifierTokenOptional } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', verifierTokenOptional, SnippetController.obtenirPublics);

router.get('/populaires', SnippetController.obtenirPopulaires);

router.get('/recherche', verifierTokenOptional, SnippetController.rechercher);

router.get('/:id', verifierTokenOptional, SnippetController.obtenirParId);

router.post(
  '/',
  verifierToken,
  SnippetController.validationCreation,
  SnippetController.creer
);

router.put('/:id', verifierToken, SnippetController.modifier);

router.delete('/:id', verifierToken, SnippetController.supprimer);

router.post('/:id/like', verifierToken, SnippetController.toggleLike);

router.post('/:id/commentaires', verifierToken, SnippetController.ajouterCommentaire);

export default router;