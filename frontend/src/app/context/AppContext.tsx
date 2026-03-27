// frontend/src/app/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Bar, Vote, Friend } from '../types';
import { authService } from '../services/authService';
import { addFavorite, removeFavorite } from '../services/favoritesService';
import { getAllBars, getBarStats } from '../services/voteService';
import { notifications } from '../utils/notifications';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedBar: Bar | null;
  setSelectedBar: (bar: Bar | null) => void;
  showVoteModal: boolean;
  setShowVoteModal: (show: boolean) => void;
  bars: Bar[];
  favoriteBars: Bar[];
  favoriteBarsStats: { [key: string]: any };
  updateBarMood: (barId: string, vote: Omit<Vote, 'id' | 'timestamp'>) => void;
  toggleFavorite: (barId: string) => Promise<void>;
  refreshBarStats: (barId: string) => void;
  locationEnabled: boolean;
  setLocationEnabled: (enabled: boolean) => void;
  friends: Friend[];
  isLoadingBars: boolean;
  barsError: string | null;
  refreshAllBars: () => void;
  refreshFavoriteBars: () => void;
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [bars, setBars] = useState<Bar[]>([]);
  const [favoriteBars, setFavoriteBars] = useState<Bar[]>([]);
  const [favoriteBarsStats, setFavoriteBarsStats] = useState<{ [key: string]: any }>({});
  const [isLoadingBars, setIsLoadingBars] = useState(false);
  const [barsError, setBarsError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Friends peut rester en dur pour l'instant, ou tu peux le virer complètement
  const friends: Friend[] = [];

  // Load user session on mount et écouter les changements
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      initializeUserData(currentUser.id);
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Écouter les changements d'utilisateur (pour le cas où login se fait après le montage)
  useEffect(() => {
    if (user && !isInitialized) {
      initializeUserData(user.id);
    }
  }, [user, isInitialized]);

  // Écouter les changements d'utilisateur pour détecter les déconnexions/reconnexions
  useEffect(() => {
    // Si l'utilisateur se déconnecte, vider tout le cache
    if (!user && (favoriteBars.length > 0 || bars.length > 0 || Object.keys(favoriteBarsStats).length > 0)) {
      setFavoriteBars([]);
      setFavoriteBarsStats({});
      setBars([]);
      setIsInitialized(false);
    }
  }, [user]);

  // Écouter les changements d'utilisateur pour l'initialisation (nouvelle logique)
  useEffect(() => {
    if (user && bars.length === 0 && !isLoadingBars) {
      initializeUserData(user.id);
    }
  }, [user, bars.length, isLoadingBars]);

  // Initialisation complète et optimisée
  const initializeUserData = async (userId: string) => {
    setIsLoadingBars(true);
    try {
      // Charger les bars et les favoris en parallèle
      const [barsResponse, favoritesResponse] = await Promise.all([
        getAllBars(),
        fetchUserFavorites(userId)
      ]);

      // Mettre à jour les bars
      if (barsResponse.success && barsResponse.bars) {
        setBars(barsResponse.bars);
      } else {
        setBarsError(barsResponse.error || 'Erreur lors du chargement des bars');
      }

      // Mettre à jour les favoris
      if (favoritesResponse.success && favoritesResponse.favorites) {
        const favoriteIds = favoritesResponse.favorites.map((f: any) => f.bar_id);
        
        setUser(prevUser => prevUser ? {
          ...prevUser,
          favoriteBarIds: favoriteIds
        } : null);

        // Charger les stats des favoris en une seule fois
        if (favoriteIds.length > 0) {
          await loadFavoriteBarsStats(favoriteIds, barsResponse.bars || []);
        }
      }
    } catch (error) {
      console.error('💥 Erreur initialisation:', error);
      setBarsError('Erreur lors du chargement des données');
    } finally {
      setIsLoadingBars(false);
      setIsInitialized(true);
    }
  };

  // Récupérer les favoris utilisateur
  const fetchUserFavorites = async (userId: string) => {
    try {
      const token = localStorage.getItem('bar_explorer_session');
      if (!token) return { success: false, favorites: [] };
      
      const session = JSON.parse(token);
      const response = await fetch(`http://localhost:3000/api/favorites/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, favorites: data.favorites || [] };
      }
      return { success: false, favorites: [] };
    } catch (error) {
      console.error('Erreur fetch favoris:', error);
      return { success: false, favorites: [] };
    }
  };

  // Charger les stats de tous les favoris en une fois
  const loadFavoriteBarsStats = async (favoriteIds: string[], allBars: Bar[]) => {
    const stats: { [key: string]: any } = {};
    
    // Créer les requêtes en parallèle avec le service correct
    const statsPromises = favoriteIds.map(async (barId) => {
      try {
        const response = await getBarStats(barId);
        if (response.success && response.stats) {
          return { barId, stats: response.stats };
        }
        return { barId, stats: { total_votes: 0, average_mood: 0 } };
      } catch (error) {
        console.error(`Erreur stats bar ${barId}:`, error);
        return { barId, stats: { total_votes: 0, average_mood: 0 } };
      }
    });

    // Attendre toutes les réponses
    const results = await Promise.all(statsPromises);
    
    // Mettre en cache les stats
    results.forEach(({ barId, stats: barStats }) => {
      stats[barId] = barStats;
    });
    
    setFavoriteBarsStats(stats);
  };

  const refreshAllBars = () => {
    if (user) {
      initializeUserData(user.id);
    }
  };

  const refreshFavoriteBars = () => {
    if (user) {
      fetchUserFavorites(user.id).then((response: any) => {
        if (response.success && response.favorites) {
          const favoriteIds = response.favorites.map((f: any) => f.bar_id);
          setUser(prevUser => prevUser ? {
            ...prevUser,
            favoriteBarIds: favoriteIds
          } : null);
          loadFavoriteBarsStats(favoriteIds, bars);
        }
      });
    }
  };

  // Mettre à jour les favoris quand user ou bars changent
  useEffect(() => {
    if (user && bars.length > 0) {
      const favBars = bars.filter(bar => user.favoriteBarIds?.includes(bar.id));
      setFavoriteBars(favBars);
    } else {
      setFavoriteBars([]);
    }
  }, [user, bars]);

  // Écouter les mises à jour de vote pour rafraîchir les stats des favoris
  useEffect(() => {
    const handleVoteUpdate = () => {
      if (user && user.favoriteBarIds.length > 0 && bars.length > 0) {
        loadFavoriteBarsStats(user.favoriteBarIds, bars);
      }
    };

    window.addEventListener('voteUpdated', handleVoteUpdate);
    return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
  }, [user, bars]);

  const updateBarMood = (barId: string, vote: Omit<Vote, 'id' | 'timestamp'>) => {
    refreshAllBars();
  };

  const refreshBarStats = (barId: string) => {
    refreshAllBars();
  };

  const toggleFavorite = async (barId: string) => {
    if (!user) return;
  
    const isFavorite = user.favoriteBarIds?.includes(barId) || false;
    
    try {
      if (isFavorite) {
        await removeFavorite(barId);
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            favoriteBarIds: prevUser.favoriteBarIds?.filter(id => id !== barId) || [],
          };
        });
      } else {
        if ((user.favoriteBarIds?.length || 0) >= 3) {
          notifications.favoriteLimit();
          return;
        }
        await addFavorite(barId);
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            favoriteBarIds: [...(prevUser.favoriteBarIds || []), barId],
          };
        });
      }
    } catch (error: any) {
      notifications.favoriteError(error.message || 'Erreur lors de la gestion des favoris');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedBar,
        setSelectedBar,
        showVoteModal,
        setShowVoteModal,
        bars,
        favoriteBars,
        favoriteBarsStats,
        updateBarMood,
        toggleFavorite,
        refreshBarStats,
        locationEnabled,
        setLocationEnabled,
        friends,
        isLoadingBars,
        barsError,
        refreshAllBars,
        refreshFavoriteBars,
        isInitialized,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;