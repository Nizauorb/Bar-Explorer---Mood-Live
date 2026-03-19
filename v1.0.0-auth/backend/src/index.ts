import express from 'express';
import { sequelize } from './config/sequelize';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://ton-domaine.com']  // Prod
    : ['http://localhost:3000', 'http://localhost:5173'],  // Dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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

app.use('/api', authRoutes);

// Démarrage
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à MySQL réussie');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
  }
}

startServer();