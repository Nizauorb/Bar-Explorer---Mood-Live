import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * Affiche une notification uniforme dans toute l'application
 */
export const showNotification = (
  message: string, 
  type: NotificationType = 'info',
  options?: {
    duration?: number;
    position?: 'top-center' | 'top-right' | 'bottom-right' | 'bottom-center';
  }
) => {
  const defaultOptions = {
    duration: type === 'error' ? 5000 : 3000,
    position: 'top-center' as const,
    ...options
  };

  switch (type) {
    case 'success':
      toast.success(message, defaultOptions);
      break;
    case 'error':
      toast.error(message, defaultOptions);
      break;
    case 'warning':
      toast.warning(message, defaultOptions);
      break;
    case 'info':
    default:
      toast.info(message, defaultOptions);
      break;
  }
};

/**
 * Notifications prédéfinies pour les cas courants
 */
export const notifications = {
  // Authentification
  loginSuccess: () => showNotification('Connexion réussie !', 'success'),
  loginError: (error?: string) => showNotification(error || 'Erreur de connexion', 'error'),
  registerSuccess: () => showNotification('Compte créé avec succès !', 'success'),
  registerError: (error?: string) => showNotification(error || 'Erreur lors de l\'inscription', 'error'),
  
  // Votes
  voteSuccess: () => showNotification('Vote enregistré !', 'success'),
  voteError: (error?: string) => showNotification(error || 'Erreur lors du vote', 'error'),
  voteCooldown: (minutes: number) => showNotification(`Veuillez attendre ${minutes} minutes avant de voter à nouveau`, 'warning'),
  
  // Favoris
  favoriteAdded: () => showNotification('Bar ajouté aux favoris !', 'success'),
  favoriteRemoved: () => showNotification('Bar retiré des favoris', 'success'),
  favoriteLimit: () => showNotification('Vous pouvez avoir maximum 3 bars favoris !', 'warning'),
  favoriteError: (error?: string) => showNotification(error || 'Erreur lors de la gestion des favoris', 'error'),
  
  // Données
  dataLoading: () => showNotification('Chargement des données...', 'info'),
  dataError: (error?: string) => showNotification(error || 'Erreur lors du chargement des données', 'error'),
  dataSuccess: () => showNotification('Données chargées avec succès', 'success'),
  
  // Général
  networkError: () => showNotification('Erreur de connexion. Vérifiez votre internet.', 'error'),
  unexpectedError: () => showNotification('Une erreur inattendue est survenue.', 'error'),
  operationSuccess: (message?: string) => showNotification(message || 'Opération réussie', 'success'),
};
