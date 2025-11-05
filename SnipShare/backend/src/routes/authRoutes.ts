import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { verifierToken } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/inscription',
  AuthController.validationInscription,
  AuthController.inscription
);

router.post(
  '/connexion',
  AuthController.validationConnexion,
  AuthController.connexion
);

router.post('/deconnexion', verifierToken, AuthController.deconnexion);

router.get('/verifier', verifierToken, AuthController.verifierAuth);

export default router;