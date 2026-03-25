import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Bar, Vote } from '../types';
import { mockBars, mockFriends } from '../data/mockData';
import { authService } from '../services/authService';
<<<<<<< Updated upstream
import { ref } from 'process';
=======
import { addFavorite, removeFavorite } from '../services/favoritesService';
import { BarWithStats } from '../hooks/useBarsStats';
import { toast } from 'sonner';
>>>>>>> Stashed changes

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  bars: Bar[];
  updateBarMood: (barId: string, vote: Omit<Vote, 'id' | 'timestamp'>) => void;
  toggleFavorite: (barId: string) => void;
  selectedBar: Bar | null;
  setSelectedBar: (bar: Bar | null) => void;
  showVoteModal: boolean;
  setShowVoteModal: (show: boolean) => void;
  friends: typeof mockFriends;
  locationEnabled: boolean;
  setLocationEnabled: (enabled: boolean) => void;
  refreshBarStats: (barId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bars, setBars] = useState<Bar[]>(mockBars);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const friends = mockFriends;

  // Load user session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Charge les favoris directement après avoir set l'utilisateur
      loadUserFavorites(currentUser.id);
    }
  }, []); 

  const updateBarMood = (barId: string, vote: Omit<Vote, 'id' | 'timestamp'>) => {
    setBars(prevBars =>
      prevBars.map(bar => {
        if (bar.id === barId) {
          // Simple average calculation
          const totalMood = bar.currentMood * bar.voteCount + vote.mood;
          const newVoteCount = bar.voteCount + 1;
          return {
            ...bar,
            currentMood: totalMood / newVoteCount,
            currentCrowd: vote.crowd,
            voteCount: newVoteCount,
          };
        }
        return bar;
      })
    );
  };

  const refreshBarStats = (barId: string) => {
    // Force le rechargement des stats pour ce bar
    setBars(prevBars => prevBars.map(bar => 
      bar.id === barId ? { ...bar, lastUpdated: Date.now() } : bar
    ));
  };

  const toggleFavorite = async (barId: string) => {
    if (!user) return;
  
    const isFavorite = user.favoriteBarIds.includes(barId);
    
    try {
      if (isFavorite) {
        await removeFavorite(barId);
        // Mettre à jour le state local
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            favoriteBarIds: prevUser.favoriteBarIds.filter(id => id !== barId),
          };
        });
      } else {
        if (user.favoriteBarIds.length >= 3) {
          toast.error('Vous pouvez avoir maximum 3 bars favoris !');
          return;
        }
        await addFavorite(barId);
        // Mettre à jour le state local
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            favoriteBarIds: [...prevUser.favoriteBarIds, barId],
          };
        });
      }
    } catch (error: any) {
      toast.error(error.message || '❌ Erreur lors de la gestion des favoris');
    }
  };

  const loadUserFavorites = async (userId: string) => {
    try {
      const response = await fetch(`/api/favorites/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('bar_explorer_session') || '{}').token}`
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



  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        bars,
        updateBarMood,
        toggleFavorite,
        selectedBar,
        setSelectedBar,
        showVoteModal,
        setShowVoteModal,
        friends,
        locationEnabled,
        setLocationEnabled,
        refreshBarStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}