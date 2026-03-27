import { FavoriteResponse, FavoritesListResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/favorites'  // Proxy Apache
  : 'http://localhost:3000/api/favorites';  // Gardez celle-ci pour le dev



// Ajouter un bar aux favoris
export const addFavorite = async (barId: string): Promise<FavoriteResponse> => {
  const token = localStorage.getItem('bar_explorer_session');
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const session = JSON.parse(token);
  
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify({ barId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'ajout du favori');
    }

    return data;
  } catch (error) {
    console.error('Erreur ajout favori:', error);
    throw error;
  }
};

// Retirer un bar des favoris
export const removeFavorite = async (barId: string): Promise<FavoriteResponse> => {
  const token = localStorage.getItem('bar_explorer_session');
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const session = JSON.parse(token);
  
  try {
    const response = await fetch(`${API_BASE_URL}/remove/${barId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la suppression du favori');
    }

    return data;
  } catch (error) {
    console.error('Erreur suppression favori:', error);
    throw error;
  }
};

// Récupérer tous les favoris de l'utilisateur
export const getUserFavorites = async (): Promise<FavoritesListResponse> => {
  const token = localStorage.getItem('bar_explorer_session');
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const session = JSON.parse(token);
  
  try {
    const response = await fetch(`${API_BASE_URL}/user/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération des favoris');
    }

    return data;
  } catch (error) {
    console.error('Erreur récupération favoris:', error);
    throw error;
  }
};