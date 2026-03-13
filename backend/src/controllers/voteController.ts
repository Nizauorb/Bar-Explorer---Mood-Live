import { Request, Response } from 'express';
import { Vote } from '../models';
import { ApiResponse } from '../types';

// Stockage temporaire pour les votes (en production, utiliser la BDD)
let votes: any[] = [
  {
    id: 1,
    bar_id: 1,
    user_id: 1,
    ambiance_score: 4,
    affluence_level: 'moyenne',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    bar_id: 1,
    user_id: 2,
    ambiance_score: 5,
    affluence_level: 'pleine',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 3,
    bar_id: 2,
    user_id: 1,
    ambiance_score: 3,
    affluence_level: 'faible',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 4,
    bar_id: 2,
    user_id: 2,
    ambiance_score: 4,
    affluence_level: 'moyenne',
    created_at: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 5,
    bar_id: 3,
    user_id: 1,
    ambiance_score: 5,
    affluence_level: 'pleine',
    created_at: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 6,
    bar_id: 3,
    user_id: 2,
    ambiance_score: 4,
    affluence_level: 'pleine',
    created_at: new Date(Date.now() - 15 * 60 * 1000)
  }
];

export const createVote = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { bar_id, ambiance_score, affluence_level } = req.body;
    const user_id = (req as any).user.id; // Récupéré du middleware auth

    // Validation
    if (!bar_id || !ambiance_score || !affluence_level) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bar_id, ambiance_score, affluence_level'
      });
    }

    if (ambiance_score < 0 || ambiance_score > 5) {
      return res.status(400).json({
        success: false,
        error: 'Ambiance score must be between 0 and 5'
      });
    }

    if (!['faible', 'moyenne', 'pleine'].includes(affluence_level)) {
      return res.status(400).json({
        success: false,
        error: 'Affluence level must be: faible, moyenne, or pleine'
      });
    }

    // Vérifier si l'utilisateur a déjà voté pour ce bar récemment (règle: 1 vote / 15 min)
    const recentVote = votes.find(v => 
      v.bar_id === bar_id && 
      v.user_id === user_id && 
      (Date.now() - v.created_at.getTime()) < 15 * 60 * 1000 // 15 minutes
    );

    if (recentVote) {
      return res.status(429).json({
        success: false,
        error: 'You can only vote once per bar every 15 minutes'
      });
    }

    // Créer le nouveau vote
    const newVote = {
      id: votes.length + 1,
      bar_id,
      user_id,
      ambiance_score,
      affluence_level,
      created_at: new Date()
    };

    votes.push(newVote);

    console.log(`New vote created: User ${user_id} voted for Bar ${bar_id} - Ambiance: ${ambiance_score}/5, Affluence: ${affluence_level}`);

    return res.status(201).json({
      success: true,
      data: newVote
    });

  } catch (error) {
    console.error('Error creating vote:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create vote'
    });
  }
};

export const getVotesByBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { bar_id } = req.params;
    
    const barVotes = votes.filter(v => v.bar_id === parseInt(bar_id));

    return res.json({
      success: true,
      data: barVotes
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch votes'
    });
  }
};
