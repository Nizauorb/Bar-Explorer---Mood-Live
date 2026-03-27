import { Router, Request, Response } from 'express';
import { User } from '../models/sequelize/User';
import { Favorite } from '../models/sequelize/Favorite';
import { Bar } from '../models/sequelize/Bar';
import { JWTService } from '../services/jwt.service';

const router = Router();

// Middleware d'authentification
const authenticateToken = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  try {
    const decoded = JWTService.verifyToken(token);
    
    // 👇 Ajoute une vérification que decoded n'est pas null
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// POST /api/favorites/add - Ajouter un bar aux favoris
router.post('/add', authenticateToken, async (req: Request, res: Response) => {
  console.log('🎯 Route /api/favorites/add appelée !');
  try {
    const { barId } = req.body;
    const userId = (req as any).user.id;

    if (!barId) {
      return res.status(400).json({ error: 'barId requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur a déjà 3 favoris
    const existingFavorites = await Favorite.findAll({ where: { user_id: userId } });
    if (existingFavorites.length >= 3) {
      return res.status(400).json({ error: 'Maximum 3 favoris autorisés' });
    }

    // Vérifier si le bar est déjà en favori
    const existingFavorite = await Favorite.findOne({ where: { user_id: userId, bar_id: barId } });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Bar déjà en favori' });
    }

    // Ajouter le favori
    const favorite = await Favorite.create({
      user_id: userId,
      bar_id: barId
    });

    console.log(`✅ Favori ajouté: User ${userId} -> Bar ${barId}`);

    res.status(201).json({
      success: true,
      favorite: {
        id: favorite.id,
        user_id: favorite.user_id,
        bar_id: favorite.bar_id,
        created_at: favorite.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur ajout favori:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'ajout du favori',
      details: error.message
    });
  }
});

// DELETE /api/favorites/remove/:barId - Retirer un bar des favoris
router.delete('/remove/:barId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { barId } = req.params;
    const userId = (req as any).user.id;

    if (!barId) {
      return res.status(400).json({ error: 'barId requis' });
    }

    // Supprimer le favori
    const deleted = await Favorite.destroy({
      where: { user_id: userId, bar_id: barId }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Favori non trouvé' });
    }

    console.log(`✅ Favori supprimé: User ${userId} -> Bar ${barId}`);

    res.json({
      success: true,
      message: 'Favori supprimé avec succès'
    });

  } catch (error: any) {
    console.error('❌ Erreur suppression favori:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du favori',
      details: error.message
    });
  }
});

// GET /api/favorites/user/:userId - Récupérer tous les favoris d'un utilisateur
router.get('/user/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).user.id;

    // Vérifier que l'utilisateur consulte ses propres favoris
    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Récupérer les favoris de l'utilisateur
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    // Si pas de favoris, retourner tableau vide
    if (favorites.length === 0) {
      return res.json({
        success: true,
        favorites: []
      });
    }

    // Récupérer les informations des bars correspondants
    const barIds = favorites.map(fav => fav.bar_id);
    const bars = await Bar.findAll({
      where: { id: barIds },
      attributes: ['id', 'name', 'address', 'latitude', 'longitude', 'price_range']
    });

    // Assembler les données
    const favoritesWithBars = favorites.map(fav => {
      const bar = bars.find((b : Bar) => b.id === fav.bar_id);
      return {
        id: fav.id,
        bar_id: fav.bar_id,
        created_at: fav.created_at,
        bar: bar || null
      };
    });

    res.json({
      success: true,
      favorites: favoritesWithBars
    });

  } catch (error: any) {
    console.error('❌ Erreur récupération favoris:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des favoris',
      details: error.message
    });
  }
});

export default router;