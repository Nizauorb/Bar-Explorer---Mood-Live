export interface User {
  id: string;
  email: string;
  pseudo: string;
  avatar?: string;
  preferences: {
    musicGenres: string[];
    goOutFrequency: string;
  };
  favoriteBarIds: string[];
  friends: string[];
}

export interface Bar {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  priceRange: string;
  tags: string[];
  description?: string;
  hours?: string;
  services?: string[];
  imageUrl?: string;
  currentMood: number; // 0-5
  currentCrowd: 'faible' | 'moyenne' | 'pleine';
  voteCount: number;
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

