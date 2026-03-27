import { User } from './auth';
import { Bar, Vote, Friend } from './bar';

export interface AppContextType {
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
