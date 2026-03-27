import express from 'express';
import { sequelize } from './config/sequelize';
import cors from 'cors';
import authRoutes from './routes/auth';
import votesRoutes from './routes/votes';
import favoritesRoutes from './routes/favorites';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://ton-domaine.com']  // Prod
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost'],  // Dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Forcer UTF-8 dans toutes les réponses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'bar-explorer-backend'
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Bar Explorer API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/favorites', favoritesRoutes);

// Démarrage
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à MySQL réussie');
    
    // Forcer UTF-8 pour toute la connexion
    await sequelize.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ UTF-8 global forcé');
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
  }
}

startServer();