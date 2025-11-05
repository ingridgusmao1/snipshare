import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import UtilisateurModel from '../models/UtilisateurModel';
import { genererToken } from '../middlewares/authMiddleware';
import { CreerUtilisateurDTO, ConnexionDTO } from '../types/types';

class AuthController {
  

  validationInscription = [
    body('nom_utilisateur')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 100 caractères'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),
    
    body('mot_de_passe')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères')
      .matches(/[A-Z]/)
      .withMessage('Le mot de passe doit contenir au moins une majuscule')
      .matches(/[a-z]/)
      .withMessage('Le mot de passe doit contenir au moins une minuscule')
      .matches(/[0-9]/)
      .withMessage('Le mot de passe doit contenir au moins un chiffre')
  ];


  validationConnexion = [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),
    
    body('mot_de_passe')
      .notEmpty()
      .withMessage('Le mot de passe est requis')
  ];


  inscription = async (req: Request, res: Response): Promise<void> => {
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

      const data: CreerUtilisateurDTO = req.body;

      if (await UtilisateurModel.emailExiste(data.email)) {
        res.status(409).json({
          success: false,
          error: 'Cet email est déjà utilisé'
        });
        return;
      }

      if (await UtilisateurModel.nomUtilisateurExiste(data.nom_utilisateur)) {
        res.status(409).json({
          success: false,
          error: 'Ce nom d\'utilisateur est déjà pris'
        });
        return;
      }

      const utilisateur = await UtilisateurModel.creer(data);

      const token = genererToken(utilisateur.id, utilisateur.email);

        res.cookie('token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          utilisateur,
          token
        }
      });
    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'inscription'
      });
    }
  };


  connexion = async (req: Request, res: Response): Promise<void> => {
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

      const { email, mot_de_passe }: ConnexionDTO = req.body;

      const utilisateur = await UtilisateurModel.trouverParEmail(email);
      
      if (!utilisateur) {
        res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect'
        });
        return;
      }

      const motDePasseValide = await UtilisateurModel.verifierMotDePasse(
        mot_de_passe,
        utilisateur.mot_de_passe
      );

      if (!motDePasseValide) {
        res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect'
        });
        return;
      }

      const token = genererToken(utilisateur.id, utilisateur.email);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur;

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          utilisateur: utilisateurSansMotDePasse,
          token
        }
      });
    } catch (error) {
      console.error('Erreur connexion:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la connexion'
      });
    }
  };


  deconnexion = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('token');
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  };


  verifierAuth = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      data: { authenticated: true }
    });
  };
}

export default new AuthController();