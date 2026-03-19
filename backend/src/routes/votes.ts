import { Router, Request, Response, NextFunction } from 'express';
import { Vote } from '../models/sequelize/Vote';
import { JWTService } from '../services/jwt.service';
import { Op, fn, col } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

interface VoteStatsResult {
  mood: number;
  crowd: 'faible' | 'moyenne' | 'pleine';
  total_votes: number;
}

const router = Router();

// Middleware d'authentification
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = JWTService.extractTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }
  
  const decoded = JWTService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  (req as AuthenticatedRequest).user = decoded;
  next();
};

// POST /api/votes - Créer ou modifier un vote
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { bar_id, mood, crowd, comment, user_latitude, user_longitude } = req.body;
    const userId = (req as AuthenticatedRequest).user.userId;

    // Validation
    if (!bar_id || mood === undefined || !crowd) {
      return res.status(400).json({ 
        error: 'Champs requis: bar_id, mood, crowd' 
      });
    }

    if (mood < 0 || mood > 5) {
      return res.status(400).json({ 
        error: 'L\'ambiance doit être entre 0 et 5' 
      });
    }

    if (!['faible', 'moyenne', 'pleine'].includes(crowd)) {
      return res.status(400).json({ 
        error: 'L\'affluence doit être: faible, moyenne ou pleine' 
      });
    }

    // Vérifier si l'utilisateur a déjà voté pour ce bar
    const existingVote = await Vote.findOne({
      where: { user_id: userId, bar_id }
    });

    let vote;
    if (existingVote) {
      // Modifier le vote existant
      vote = await existingVote.update({
        mood,
        crowd,
        comment: comment || existingVote.comment,
        user_latitude,
        user_longitude
      });
      console.log(`✅ Vote mis à jour: utilisateur ${userId} -> bar ${bar_id}`);
    } else {
      // Créer un nouveau vote
      vote = await Vote.create({
        user_id: userId,
        bar_id,
        mood,
        crowd,
        comment,
        user_latitude,
        user_longitude
      });
      console.log(`✅ Vote créé: utilisateur ${userId} -> bar ${bar_id}`);
    }

    res.json({
      success: true,
      vote: {
        id: vote.id,
        bar_id: vote.bar_id,
        mood: vote.mood,
        crowd: vote.crowd,
        comment: vote.comment,
        created_at: vote.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur vote:', error);
    res.status(500).json({ 
      error: 'Erreur lors du vote', 
      details: error.message 
    });
  }
});

// GET /api/votes/bar/:barId - Obtenir les stats d'un bar
router.get('/bar/:barId', async (req: Request, res: Response) => {
  try {
    const { barId } = req.params;

    const votes = (await Vote.findAll({
      where: { bar_id: barId },
      attributes: [
        'mood',
        'crowd',
        [fn('COUNT', col('id')), 'total_votes']
      ],
      group: ['mood', 'crowd'],
      raw: true
    }) as unknown) as VoteStatsResult[];

    if (votes.length === 0) {
      return res.json({
        success: true,
        stats: {
          total_votes: 0,
          average_mood: 0,
          mood_distribution: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          crowd_distribution: { faible: 0, moyenne: 0, pleine: 0 }
        }
      });
    }

    // Calculer les statistiques
    const totalVotes = votes.reduce((sum, vote) => sum + vote.total_votes, 0);
    const averageMood = votes.reduce((sum, vote) => sum + (vote.mood * vote.total_votes), 0) / totalVotes;
    
    const moodDistribution: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const crowdDistribution = { faible: 0, moyenne: 0, pleine: 0 };
    
    votes.forEach(vote => {
      moodDistribution[vote.mood]++; 
      crowdDistribution[vote.crowd]++;
    });

    res.json({
      success: true,
      stats: {
        total_votes: totalVotes,
        average_mood: Math.round(averageMood * 10) / 10,
        mood_distribution: moodDistribution,
        crowd_distribution: crowdDistribution
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur stats bar:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des stats', 
      details: error.message 
    });
  }
});

// GET /api/votes/user/:userId - Obtenir les votes d'un utilisateur
router.get('/user/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as AuthenticatedRequest).user.userId;

    // Un utilisateur ne peut voir que ses propres votes
    if (userId !== currentUserId) {
      return res.status(403).json({ 
        error: 'Accès non autorisé' 
      });
    }

    const votes = await Vote.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      votes: votes.map(vote => ({
        id: vote.id,
        bar_id: vote.bar_id,
        mood: vote.mood,
        crowd: vote.crowd,
        comment: vote.comment,
        created_at: vote.created_at
      }))
    });

  } catch (error: any) {
    console.error('❌ Erreur votes utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des votes', 
      details: error.message 
    });
  }
});

export default router;