const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/votes'  // En production (Apache proxy)
  : 'http://localhost:3000/api/votes';  // En développement

export interface VoteRequest {
  bar_id: string;
  mood: number;
  crowd: 'faible' | 'moyenne' | 'pleine';
  comment?: string;
  user_latitude?: number;
  user_longitude?: number;
}

export interface VoteResponse {
  success: boolean;
  vote?: {
    id: string;
    bar_id: string;
    mood: number;
    crowd: 'faible' | 'moyenne' | 'pleine';
    comment?: string;
    created_at: string;
  };
  error?: string;
}

export interface BarStatsResponse {
  success: boolean;
  stats?: {
    total_votes: number;
    average_mood: number;
    mood_distribution: { [key: number]: number };
    crowd_distribution: { faible: number; moyenne: number; pleine: number };
  };
  error?: string;
}

export interface UserVotesResponse {
  success: boolean;
  votes?: Array<{
    id: string;
    bar_id: string;
    mood: number;
    crowd: 'faible' | 'moyenne' | 'pleine';
    comment?: string;
    created_at: string;
  }>;
  error?: string;
}

// Créer ou mettre à jour un vote
export const createVote = async (voteData: VoteRequest): Promise<VoteResponse> => {
  const token = localStorage.getItem('bar_explorer_session');
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const session = JSON.parse(token);
  
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify(voteData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du vote');
    }

    return data;
  } catch (error) {
    console.error('Erreur vote:', error);
    throw error;
  }
};

// Obtenir les statistiques d'un bar
export const getBarStats = async (barId: string): Promise<BarStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bar/${barId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération des stats');
    }

    return data;
  } catch (error) {
    console.error('Erreur stats bar:', error);
    throw error;
  }
};

// Obtenir les votes d'un utilisateur
export const getUserVotes = async (userId: string): Promise<UserVotesResponse> => {
  const token = localStorage.getItem('bar_explorer_session');
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const session = JSON.parse(token);
  
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération des votes');
    }

    return data;
  } catch (error) {
    console.error('Erreur votes utilisateur:', error);
    throw error;
  }
};