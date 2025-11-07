import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import snippetRoutes from './routes/snippetRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true 
}));


app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API SnipShare fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/snippets', snippetRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur serveur:', err);
  
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Base de données: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
});

process.on('SIGINT', () => {
  console.log('\n Arrêt du serveur...');
  process.exit(0);
});

export default app;