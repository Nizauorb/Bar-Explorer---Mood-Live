import { Bar } from '../types';

/**
 * Calcule l'affluence actuelle d'un bar
 */
export const calculateCurrentCrowd = (bar: Bar, stats?: any): 'faible' | 'moyenne' | 'pleine' => {
  // Si pas de stats, utiliser l'affluence du bar
  if (!stats || !stats.crowd_distribution) {
    return bar.currentCrowd || 'moyenne';
  }
  
  // Logique identique à BarPopup pour synchronisation
  const distribution = stats.crowd_distribution as { faible: number; moyenne: number; pleine: number };
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) return 'moyenne';
  
  // Trouver la majorité
  const majority = Object.entries(distribution).find(([_, count]) => count > total / 2);
  
  if (majority) return majority[0] as 'faible' | 'moyenne' | 'pleine';
  
  // Logique de repli basée sur la moyenne
  const avgMood = stats.average_mood || 0;
  if (avgMood <= 2) return 'faible';
  if (avgMood <= 3.5) return 'moyenne';
  return 'pleine';
};

/**
 * Calcule l'affluence actuelle d'un bar (version pour MapPage avec crowd_distribution)
 */
export const calculateCurrentCrowdFromBar = (bar: Bar): 'faible' | 'moyenne' | 'pleine' => {
  // Si le bar a crowd_distribution, l'utiliser
  if (bar.crowd_distribution) {
    const distribution = bar.crowd_distribution as { faible: number; moyenne: number; pleine: number };
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) return bar.currentCrowd || 'moyenne';
    
    // Trouver la majorité
    const majority = Object.entries(distribution).find(([_, count]) => count > total / 2);
    
    if (majority) return majority[0] as 'faible' | 'moyenne' | 'pleine';
  }
  
  // Sinon utiliser currentCrowd du bar
  return bar.currentCrowd || 'moyenne';
};

/**
 * Couleur selon l'affluence
 */
export const getCrowdColor = (crowd: 'faible' | 'moyenne' | 'pleine', voteCount: number): string => {
  // Si 0 vote : gris complet
  if (voteCount === 0) return '#9CA3AF';
  
  // Sinon : couleur selon l'affluence
  switch (crowd) {
    case 'pleine': return '#EF4444';  // Rouge
    case 'moyenne': return '#F59E0B'; // Orange  
    case 'faible': return '#10B981';  // Vert
    default: return '#9CA3AF';        // Gris
  }
};

/**
 * Rayon selon l'affluence
 */
export const getCrowdRadius = (crowd: 'faible' | 'moyenne' | 'pleine'): number => {
  const radiusMap: { [key: string]: number } = {
    'faible': 60,
    'moyenne': 100, 
    'pleine': 140
  };
  return radiusMap[crowd] || 40;
};
