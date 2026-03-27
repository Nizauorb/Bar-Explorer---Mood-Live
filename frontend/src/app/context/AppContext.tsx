// frontend/src/app/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Bar, Vote, Friend } from '../types';
import { authService } from '../services/authService';
import { addFavorite, removeFavorite } from '../services/favoritesService';
import { useBarsStats } from '../hooks/useBarsStats';
import { notifications } from '../utils/notifications';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedBar: Bar | null;
  setSelectedBar: (bar: Bar | null) => void;
  showVoteModal: boolean;
  setShowVoteModal: (show: boolean) => void;
  bars: Bar[];
  updateBarMood: (barId: string, vote: Omit<Vote, 'id' | 'timestamp'>) => void;
  toggleFavorite: (barId: string) => Promise<void>;
  refreshBarStats: (barId: string) => void;
  locationEnabled: boolean;
  setLocationEnabled: (enabled: boolean) => void;
  friends: Friend[];  // Garde pour l'instant, mais pourrait venir de la DB plus tard
  isLoadingBars: boolean;
  barsError: string | null;
  refreshAllBars: () => void;
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
  
  // UTILISE useBarsStats pour les bars (plus de mockData !)
  const { bars, isLoading: isLoadingBars, error: barsError, refreshBarsStats: refreshAllBars } = useBarsStats();
  
  // Friends peut rester en dur pour l'instant, ou tu peux le virer complètement
  const friends: Friend[] = [];

  // Load user session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserFavorites(currentUser.id);
    }
  }, []); 

  const loadUserFavorites = async (userId: string) => {
    try {
      const token = localStorage.getItem('bar_explorer_session');
      if (!token) return;
      
      const session = JSON.parse(token);
      const response = await fetch(`http://localhost:3000/api/favorites/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = data.favorites?.map((f: any) => f.bar_id) || [];
        
        setUser(prevUser => prevUser ? {
          ...prevUser,
          favoriteBarIds: favoriteIds
        } : null);
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    }
  };

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
        bars,  // Vient de useBarsStats (DB)
        updateBarMood,
        toggleFavorite,
        refreshBarStats,
        locationEnabled,
        setLocationEnabled,
        friends,  // Tableau vide (pas de mockData)
        isLoadingBars,
        barsError,
        refreshAllBars,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;