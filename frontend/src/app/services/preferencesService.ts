// frontend/src/app/services/preferencesService.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/preferences'  // Proxy Apache
  : 'http://localhost:3000/api/preferences';  // Gardez celle-ci pour le dev

export interface UserPreferences {
  id: string;
  user_id: string;
  music_genres: string[];
  go_out_frequency: 'jamais' | 'rarement' | 'occasionnellement' | 'souvent' | 'tres_souvent';
  notifications_enabled: boolean;
  location_sharing: boolean;
  updated_at: string;
}

export interface UpdatePreferencesData {
  music_genres?: string[];
  go_out_frequency?: 'jamais' | 'rarement' | 'occasionnellement' | 'souvent' | 'tres_souvent';
  notifications_enabled?: boolean;
  location_sharing?: boolean;
}

export const preferencesService = {
  // Récupérer les préférences utilisateur
  async getPreferences(userId: string): Promise<{ success: boolean; preferences: UserPreferences }> {
    try {
      const token = localStorage.getItem('bar_explorer_session');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des préférences');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur getPreferences:', error);
      throw error;
    }
  },

  // Mettre à jour les préférences utilisateur
  async updatePreferences(userId: string, preferencesData: UpdatePreferencesData): Promise<{ success: boolean; preferences: UserPreferences }> {
    try {
      const token = localStorage.getItem('bar_explorer_session');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify(preferencesData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour des préférences');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur updatePreferences:', error);
      throw error;
    }
  }
};

// Liste des genres musicaux disponibles
export const MUSIC_GENRES_OPTIONS = [
  // Populaire
  "Pop", "Rock", "Jazz", "Electro", "Hip-Hop", "R&B",
  
  // Variétés
  "Indie", "Alternative", "Folk", "Acoustique", "World", "Reggae",
  
  // Électronique
  "House", "Techno", "Trance", "Drum & Bass", "Dubstep", "Ambient",
  
  // Classique
  "Classique", "Opéra", "Ballet", "Contemporain",
  
  // International
  "Latino", "Salsa", "K-Pop", "Afrobeat", "Raï", "Flamenco",
  
  // Spécialisés
  "Metal", "Punk", "Ska", "Blues", "Country", "Gospel",
  
  // Ambiance
  "Lounge", "Chill", "Deep House", "Tropical House", "Nu-Disco"
]; // 25 genres - couvre 95% des besoins
