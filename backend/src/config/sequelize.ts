import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Charger les variables d'environnement
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Validation des variables requises
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Variables d'environnement requises manquantes: ${missingVars.join(', ')}`);
}

// Création de l'instance Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Test de connexion
export const testSequelizeConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion Sequelize à MySQL établie');
    // Forcer UTF-8 après la connexion
    await sequelize.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ UTF-8 forcé dans la connexion');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Sequelize:', error);
    return false;
  }
};

