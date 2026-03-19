import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Bar, Vote } from '../types';
import { mockUser, mockBars, mockFriends } from '../data/mockData';
import { authService } from '../services/authService';

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

  const toggleFavorite = (barId: string) => {
    if (!user) return;

    setUser(prevUser => {
      if (!prevUser) return null;
      
      const isFavorite = prevUser.favoriteBarIds.includes(barId);
      
      if (isFavorite) {
        return {
          ...prevUser,
          favoriteBarIds: prevUser.favoriteBarIds.filter(id => id !== barId),
        };
      } else {
        if (prevUser.favoriteBarIds.length >= 3) {
          alert('Vous pouvez avoir maximum 3 bars favoris !');
          return prevUser;
        }
        return {
          ...prevUser,
          favoriteBarIds: [...prevUser.favoriteBarIds, barId],
        };
      }
    });
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