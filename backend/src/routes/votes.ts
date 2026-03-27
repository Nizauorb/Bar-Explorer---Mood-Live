import { Router, Request, Response, NextFunction } from 'express';
import { Op, fn, col } from 'sequelize';
import { sequelize } from '../config/sequelize';
import { Bar } from '../models/sequelize/Bar';
import { Vote } from '../models/sequelize/Vote';
import jwt from 'jsonwebtoken';

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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// POST /api/votes
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

    // Vérifier si l'utilisateur a déjà voté pour ce bar récemment
    const existingVote = await Vote.findOne({
      where: { user_id: userId, bar_id },
      order: [['created_at', 'DESC']]
    });

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Si vote existant < 15 minutes -> BLOQUER
    if (existingVote && existingVote.created_at > fifteenMinutesAgo) {
      const timeRemaining = Math.ceil((existingVote.created_at.getTime() + 15 * 60 * 1000 - now.getTime()) / 60 / 1000);
      
      return res.status(429).json({
        error: `Veuillez attendre ${timeRemaining} minutes avant de voter à nouveau pour ce bar`,
        canVoteIn: timeRemaining
      });
    }

    // Créer nouveau vote
    const vote = await Vote.create({
      user_id: userId,
      bar_id,
      mood,
      crowd,
      comment,
      user_latitude,
      user_longitude
    });
    
    console.log(`✅ Vote créé: utilisateur ${userId} -> bar ${bar_id}`);

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
      votes: votes.map((vote: any) => ({
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

router.delete('/cleanup', async (req: Request, res: Response) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const deletedVotes = await Vote.destroy({
      where: {
        created_at: {
          [Op.lt]: twentyFourHoursAgo
        }
      }
    });

    console.log(`🧹 Nettoyage: ${deletedVotes} votes supprimés (plus de 24h)`);

    res.json({
      success: true,
      deletedVotes,
      message: `${deletedVotes} votes de plus de 24h supprimés`
    });

  } catch (error: any) {
    console.error('❌ Erreur nettoyage:', error);
    res.status(500).json({ 
      error: 'Erreur lors du nettoyage', 
      details: error.message 
    });
  }
});

// GET /api/votes/all-bars - Obtenir tous les bars avec leurs stats
router.get('/all-bars', async (req: Request, res: Response) => {
  try {
    // Forcer UTF-8 avant la requête
    await sequelize.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
    
    const bars = await Bar.findAll({
      attributes: [
        'id', 'name', 'address', 'latitude', 'longitude', 
        'price_range', 'tags', 'description', 'hours', 
        'services', 'image_url', 'phone', 'website',
        'current_mood', 'current_crowd', 'vote_count'
      ]
    });
 
    // Debug : voir ce que Sequelize retourne exactement
    console.log('🔍 Sequelize bar 1:', JSON.stringify(bars[0], null, 2));
    
    // Forcer l'encodage dans la réponse
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      bars: bars.map((bar: any) => ({
        id: bar.id,
        name: bar.name,
        address: bar.address,
        latitude: bar.latitude,
        longitude: bar.longitude,
        price_range: bar.price_range,
        priceRange: bar.price_range,
        tags: Array.isArray(bar.tags) ? bar.tags : (bar.tags ? JSON.parse(bar.tags) : []),
        description: bar.description,
        hours: bar.hours,
        services: bar.services,
        image_url: bar.image_url,
        imageUrl: bar.image_url,
        total_votes: bar.vote_count || 0,
        vote_count: bar.vote_count || 0,
        voteCount: bar.vote_count || 0,
        average_mood: bar.current_mood || 0,
        currentMood: bar.current_mood || 0,
        mood_distribution: {},
        crowd_distribution: {}
      }))
    });
 
  } catch (error: any) {
    console.error('❌ Erreur récupération bars:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des bars',
      details: error.message 
    });
  }
});

export default router;