export interface Bar {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  priceRange: string;
  tags: string[];
  description?: string;
  hours: string | { 
    opening: string; 
    days: string; 
  } | string;
  services: string[];
  imageUrl?: string;
  currentMood: number;
  currentCrowd: 'faible' | 'moyenne' | 'pleine';
  voteCount: number;
  crowd_distribution?: { [key: string]: number }; // Pour la heatmap
}

export interface Vote {
  id: string;
  userId: string;
  barId: string;
  mood: number; // 0-5
  crowd: 'faible' | 'moyenne' | 'pleine';
  timestamp: Date;
}

export interface Friend {
  id: string;
  pseudo: string;
  avatar?: string;
  currentBar?: string;
  isOnline: boolean;
}

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
    crowd_distribution: { [key: string]: number };
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

export interface AllBarsResponse {
  success: boolean;
  bars?: Bar[];
  error?: string;
}
