import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bar_explorer_mongo';

export const connectMongoDB = async (): Promise<boolean> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connexion MongoDB établie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    return false;
  }
};

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de déconnexion MongoDB:', error);
  }
};