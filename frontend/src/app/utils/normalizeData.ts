import { Bar } from '../types';

/**
 * Normalise les données d'un bar venant de l'API vers le format frontend
 */
export const normalizeBar = (apiBar: any): Bar => {
  // Gestion des coordonnées (peuvent être string ou number)
  const latitude = typeof apiBar.latitude === 'string' 
    ? parseFloat(apiBar.latitude) || 0 
    : (apiBar.latitude || 0);
    
  const longitude = typeof apiBar.longitude === 'string' 
    ? parseFloat(apiBar.longitude) || 0 
    : (apiBar.longitude || 0);

  // Gestion des prix (compatibilité API)
  const priceRange = apiBar.price_range || apiBar.priceRange || '€';

  // Gestion des tags (peuvent être string ou array)
  let tags: string[];
  if (Array.isArray(apiBar.tags)) {
    tags = apiBar.tags;
  } else if (typeof apiBar.tags === 'string') {
    try {
      tags = JSON.parse(apiBar.tags);
    } catch {
      tags = [];
    }
  } else {
    tags = [];
  }

  // Gestion des heures (peuvent être string ou object)
  let hours: string;
  if (typeof apiBar.hours === 'string') {
    hours = apiBar.hours;
  } else if (typeof apiBar.hours === 'object' && apiBar.hours !== null) {
    hours = `${apiBar.hours?.opening || ''} - ${apiBar.hours?.days || ''}`;
  } else {
    hours = 'Horaires non disponibles';
  }

  // Gestion des services (peuvent être string ou array)
  let services: string[];
  if (Array.isArray(apiBar.services)) {
    services = apiBar.services;
  } else if (typeof apiBar.services === 'string') {
    try {
      services = JSON.parse(apiBar.services);
    } catch {
      services = [];
    }
  } else {
    services = [];
  }

  // Gestion des images (compatibilité API)
  const imageUrl = apiBar.image_url || apiBar.imageUrl;

  // Gestion de l'ambiance (compatibilité API)
  const currentMood = apiBar.current_mood || apiBar.currentMood || 0;

  // Gestion de l'affluence (compatibilité API)
  const currentCrowd = apiBar.current_crowd || apiBar.currentCrowd || 'moyenne';

  // Gestion du nombre de votes (compatibilité API)
  const voteCount = apiBar.vote_count || apiBar.total_votes || apiBar.voteCount || 0;

  return {
    id: apiBar.id,
    name: apiBar.name,
    address: apiBar.address,
    latitude,
    longitude,
    priceRange,
    tags,
    description: apiBar.description || '',
    hours,
    services,
    imageUrl,
    currentMood,
    currentCrowd,
    voteCount,
  };
};

/**
 * Normalise un tableau de bars
 */
export const normalizeBars = (apiBars: any[]): Bar[] => {
  return apiBars.map(bar => normalizeBar(bar));
};

/**
 * Vérifie si un objet bar est valide
 */
export const isValidBar = (bar: any): bar is Bar => {
  return (
    bar &&
    typeof bar.id === 'string' &&
    typeof bar.name === 'string' &&
    typeof bar.address === 'string'
  );
};
