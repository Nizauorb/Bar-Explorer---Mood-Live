import { useState, useEffect, useCallback } from 'react';
import { getBarStats, getAllBars } from '../services/voteService';
import { Bar } from '../types';
import { normalizeBars } from '../utils/normalizeData';

export const useBarsStats = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  let refreshTimeout: NodeJS.Timeout | null = null;

  const loadBarsStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupère tous les bars depuis la DB
      const barsResponse = await getAllBars();
      
      if (barsResponse.success && barsResponse.bars) {
        // Normalise tous les bars avec le nouvel utilitaire
        const normalizedBars = normalizeBars(barsResponse.bars);
        
        // OPTIMISATION : Batch API calls pour la performance
        const barsWithStats: Bar[] = [];
        const statsPromises = normalizedBars.map(async (bar) => {
          try {
            const statsResponse = await getBarStats(bar.id);
            
            if (statsResponse.success && statsResponse.stats) {
              return {
                ...bar,
                mood_distribution: statsResponse.stats.mood_distribution,
                crowd_distribution: statsResponse.stats.crowd_distribution,
              };
            } else {
              return bar;
            }
          } catch (err) {
            return bar;
          }
        });
        
        // Exécute toutes les requêtes en parallèle
        const results = await Promise.all(statsPromises);
        barsWithStats.push(...results);
        
        setBars(barsWithStats);
        setLastUpdate(Date.now());
      } else {
        setError(barsResponse.error || 'Erreur lors du chargement des bars');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Écoute les événements de vote
  useEffect(() => {
    const handleVoteUpdate = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => {
        loadBarsStats();
      }, 500);
    };
    
    window.addEventListener('voteUpdated', handleVoteUpdate);
    return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
  }, [loadBarsStats]);

  // Charger les stats au montage
  useEffect(() => {
    loadBarsStats();
  }, [loadBarsStats]);

  return {
    bars,
    isLoading,
    error,
    refreshBarsStats: loadBarsStats,
    lastUpdate
  };
};