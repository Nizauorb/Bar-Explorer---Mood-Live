import { Router, Request, Response } from 'express';
import { User } from '../models/sequelize/User';
import { UserPreferences } from '../models/sequelize/UserPreferences';
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

// GET /api/preferences/:userId - Récupérer les préférences utilisateur
router.get('/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).user.id;

    // Vérifier que l'utilisateur consulte ses propres préférences
    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Récupérer les préférences existantes
    let preferences = await UserPreferences.findOne({
      where: { user_id: userId }
    });

    // Si pas de préférences, créer avec valeurs par défaut
    if (!preferences) {
      preferences = await UserPreferences.create({
        user_id: userId as string,
        music_genres: [],
        go_out_frequency: 'occasionnellement',
        notifications_enabled: true,
        location_sharing: false
      });
    }

    res.json({
      success: true,
      preferences: {
        id: preferences.id,
        user_id: preferences.user_id,
        music_genres: preferences.music_genres || [],
        go_out_frequency: preferences.go_out_frequency,
        notifications_enabled: preferences.notifications_enabled,
        location_sharing: preferences.location_sharing,
        updated_at: preferences.updated_at
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur récupération préférences:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des préférences',
      details: error.message
    });
  }
});

// PUT /api/preferences/:userId - Mettre à jour les préférences utilisateur
router.put('/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).user.id;
    const {
      music_genres,
      go_out_frequency,
      notifications_enabled,
      location_sharing
    } = req.body;

    // Vérifier que l'utilisateur modifie ses propres préférences
    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Validation des genres musicaux
    if (music_genres && Array.isArray(music_genres)) {
      if (music_genres.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 genres musicaux autorisés' });
      }
    }

    // Récupérer ou créer les préférences
    let preferences = await UserPreferences.findOne({
      where: { user_id: userId }
    });

    if (!preferences) {
      preferences = await UserPreferences.create({
        user_id: userId as string,
        music_genres: [],
        go_out_frequency: go_out_frequency || 'occasionnellement',
        notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true,
        location_sharing: location_sharing !== undefined ? location_sharing : false
      });
    } else {
      // Mettre à jour les préférences existantes
      await preferences.update({
        music_genres: music_genres !== undefined ? music_genres : preferences.music_genres,
        go_out_frequency: go_out_frequency || preferences.go_out_frequency,
        notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : preferences.notifications_enabled,
        location_sharing: location_sharing !== undefined ? location_sharing : preferences.location_sharing
      });
    }

    console.log(`✅ Préférences mises à jour: User ${userId}`);

    res.json({
      success: true,
      preferences: {
        id: preferences.id,
        user_id: preferences.user_id,
        music_genres: preferences.music_genres || [],
        go_out_frequency: preferences.go_out_frequency,
        notifications_enabled: preferences.notifications_enabled,
        location_sharing: preferences.location_sharing,
        updated_at: preferences.updated_at
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur mise à jour préférences:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour des préférences',
      details: error.message
    });
  }
});

export default router;
