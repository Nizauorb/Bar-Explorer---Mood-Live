import { Request, Response } from 'express';
import { Bar, Vote } from '../models';
import { ApiResponse } from '../types';

// Données de démonstration basées sur les seeders
const demoBars = [
  {
    id: 1,
    name: "Le Comptoir Général",
    address: "124 Quai de Jemmapes, 75004 Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    description: "Bar vintage avec ambiance jazz et cocktails artisanaux",
    phone: "01 40 29 12 34",
    website: "https://lecomptoirgeneral.com",
    budget: '€€',
    style_musical: 'jazz',
    created_at: new Date(),
    updated_at: new Date(),
    votes: [
      {
        id: 1,
        ambiance_score: 4,
        affluence_level: 'moyenne',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        ambiance_score: 5,
        affluence_level: 'pleine',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 2,
    name: "La Cave à Bulles",
    address: "45 Rue de la Fontaine, 75006 Paris",
    latitude: 48.8506,
    longitude: 2.3394,
    description: "Bar spécialisé en bières artisanales et vins naturels",
    phone: "01 45 67 89 01",
    website: "https://lacaveabulles.fr",
    budget: '€€',
    style_musical: 'indé',
    created_at: new Date(),
    updated_at: new Date(),
    votes: [
      {
        id: 3,
        ambiance_score: 3,
        affluence_level: 'faible',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 4,
        ambiance_score: 4,
        affluence_level: 'moyenne',
        created_at: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  },
  {
    id: 3,
    name: "Le Fougères",
    address: "12 Rue de la Huchette, 75005 Paris",
    latitude: 48.8530,
    longitude: 2.3499,
    description: "Bar irlandais authentique avec musique live",
    phone: "01 43 25 40 25",
    website: "https://lefougeresparis.com",
    budget: '€',
    style_musical: 'rock',
    created_at: new Date(),
    updated_at: new Date(),
    votes: [
      {
        id: 5,
        ambiance_score: 5,
        affluence_level: 'pleine',
        created_at: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 6,
        ambiance_score: 4,
        affluence_level: 'pleine',
        created_at: new Date(Date.now() - 15 * 60 * 1000)
      }
    ]
  },
  {
    id: 4,
    name: "Café de la Place",
    address: "8 Place du Panthéon, 75005 Paris",
    latitude: 48.8462,
    longitude: 2.3459,
    description: "Café branché avec terrasse et petite restauration",
    phone: "01 44 07 17 89",
    website: "https://cafedelaplace.fr",
    budget: '€€',
    style_musical: 'electro',
    created_at: new Date(),
    updated_at: new Date(),
    votes: []
  },
  {
    id: 5,
    name: "Le Bar du Marché",
    address: "23 Rue Mouffetard, 75005 Paris",
    latitude: 48.8423,
    longitude: 2.3374,
    description: "Bar convivial près du marché Mouffetard",
    phone: "01 43 54 98 76",
    website: "https://lebarmarcheparis.com",
    budget: '€',
    style_musical: 'variété',
    created_at: new Date(),
    updated_at: new Date(),
    votes: []
  }
];

export const getAllBars = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { budget, style_musical, ambiance_min, ambiance_max, affluence } = req.query;
    
    let filteredBars = [...demoBars];
    
    // Filtrage par budget
    if (budget && typeof budget === 'string') {
      filteredBars = filteredBars.filter(bar => bar.budget === budget);
    }
    
    // Filtrage par style musical
    if (style_musical && typeof style_musical === 'string') {
      filteredBars = filteredBars.filter(bar => bar.style_musical === style_musical);
    }
    
    // Filtrage par ambiance (basé sur les votes)
    if (ambiance_min || ambiance_max) {
      filteredBars = filteredBars.filter(bar => {
        if (bar.votes.length === 0) return false;
        
        const avgAmbiance = bar.votes.reduce((sum, vote) => sum + vote.ambiance_score, 0) / bar.votes.length;
        
        const minScore = ambiance_min ? parseInt(ambiance_min as string) : 0;
        const maxScore = ambiance_max ? parseInt(ambiance_max as string) : 5;
        
        return avgAmbiance >= minScore && avgAmbiance <= maxScore;
      });
    }
    
    // Filtrage par affluence (dernier vote enregistré)
    if (affluence && typeof affluence === 'string') {
      filteredBars = filteredBars.filter(bar => {
        if (bar.votes.length === 0) return false;
        
        // Trier les votes par date et prendre le plus récent
        const latestVote = bar.votes.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];
        return latestVote.affluence_level === affluence;
      });
    }
    
    res.json({
      success: true,
      data: filteredBars
    });
  } catch (error) {
    console.error('Error fetching bars:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bars'
    });
  }
};

export const getBarById = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    // Pour la démo, on cherche dans les données statiques
    const bar = demoBars.find(b => b.id === parseInt(id));
    
    if (!bar) {
      return res.status(404).json({
        success: false,
        error: 'Bar not found'
      });
    }

    res.json({
      success: true,
      data: bar
    });
  } catch (error) {
    console.error('Error fetching bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bar'
    });
  }
};

export const createBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { name, address, latitude, longitude, description, phone, website } = req.body;

    // Pour la démo, on simule la création
    const newBar = {
      id: demoBars.length + 1,
      name,
      address,
      latitude,
      longitude,
      description,
      phone,
      website,
      created_at: new Date(),
      updated_at: new Date(),
      votes: []
    };

    res.status(201).json({
      success: true,
      data: newBar
    });
  } catch (error) {
    console.error('Error creating bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bar'
    });
  }
};

export const updateBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, description, phone, website } = req.body;

    // Pour la démo, on simule la mise à jour
    const barIndex = demoBars.findIndex(b => b.id === parseInt(id));
    
    if (barIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bar not found'
      });
    }

    const updatedBar = {
      ...demoBars[barIndex],
      name,
      address,
      latitude,
      longitude,
      description,
      phone,
      website,
      updated_at: new Date()
    };

    res.json({
      success: true,
      data: updatedBar
    });
  } catch (error) {
    console.error('Error updating bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bar'
    });
  }
};

export const deleteBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    // Pour la démo, on simule la suppression
    const barIndex = demoBars.findIndex(b => b.id === parseInt(id));
    
    if (barIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bar not found'
      });
    }

    res.json({
      success: true,
      data: { message: 'Bar deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bar'
    });
  }
};
