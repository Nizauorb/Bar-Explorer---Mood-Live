// frontend/src/app/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { preferencesService, MUSIC_GENRES_OPTIONS, UserPreferences } from '../services/preferencesService';
import { ArrowLeft, Edit3, Heart, Music, Calendar, LogOut, MapPin, Users, TrendingUp, Star } from 'lucide-react';
import { calculateCurrentCrowd } from '../utils/heatmapUtils';
import { notifications } from '../utils/notifications';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, setSelectedBar, favoriteBars, favoriteBarsStats, isInitialized } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [goOutFrequency, setGoOutFrequency] = useState(user?.preferences?.goOutFrequency || '');
  const [musicGenres, setMusicGenres] = useState(user?.preferences?.musicGenres || []);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les préférences utilisateur
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        setIsLoadingPreferences(true);
        const result = await preferencesService.getPreferences(user.id);
        setPreferences(result.preferences);
        setMusicGenres(result.preferences.music_genres || []);
        setGoOutFrequency(result.preferences.go_out_frequency || '');
      } catch (error) {
        console.error('Erreur chargement préférences:', error);
      } finally {
        setIsLoadingPreferences(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Rediriger si non connecté
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Afficher l'état de chargement pendant l'initialisation
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EBF5] to-[#F8F9FA] flex items-center justify-center">
        <div className="text-[#717182]">Chargement...</div>
      </div>
    );
  }

  // Afficher l'état de chargement si les favoris ne sont pas encore chargés
  if (favoriteBars.length === 0 && user.favoriteBarIds && user.favoriteBarIds.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EBF5] to-[#F8F9FA] flex items-center justify-center">
        <div className="text-[#717182]">Chargement des favoris...</div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Sauvegarder les préférences avec le nouveau service
      await preferencesService.updatePreferences(user.id, {
        music_genres: musicGenres,
        go_out_frequency: goOutFrequency as any,
      });

      notifications.operationSuccess?.('Préférences mises à jour avec succès !');
      setIsEditing(false);
      // Recharger les préférences pour l'affichage actualisé
      const result = await preferencesService.getPreferences(user.id);
      setPreferences(result.preferences);
      setMusicGenres(result.preferences.music_genres || []);
      setGoOutFrequency(result.preferences.go_out_frequency || '');
    } catch (error: any) {
      notifications.operationError?.(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const handleEditAvatar = () => {
    // TODO: Implémenter la modification de l'avatar
    notifications.operationSuccess?.('Modification de l\'avatar bientôt disponible !');
  };

  const musicGenreOptions = MUSIC_GENRES_OPTIONS;

  // Conversion des valeurs de fréquence en texte lisible
  const formatFrequency = (frequency: string) => {
    const frequencyMap: { [key: string]: string } = {
      'jamais': 'Jamais',
      'rarement': 'Rarement',
      'occasionnellement': 'Occasionnellement',
      'souvent': 'Souvent',
      'tres_souvent': 'Très souvent'
    };
    return frequencyMap[frequency] || 'Non défini';
  };

  const toggleMusicGenre = (genre: string) => {
    if (musicGenres.includes(genre)) {
      setMusicGenres(musicGenres.filter(g => g !== genre));
    } else {
      // Validation max 5 genres
      if (musicGenres.length >= 5) {
        notifications.operationError('Maximum 5 genres musicaux autorisés');
        return;
      }
      setMusicGenres([...musicGenres, genre]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EBF5] to-[#F8F9FA]">
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-[#8A7CF5] to-[#65498D] px-4 py-6 shadow-lg relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/map')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>

              <h1 className="text-white text-2xl font-bold">Mon Profil</h1>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                <Edit3 size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="relative -mt-3 sm:-mt-0">
          <div className="bg-white rounded-2xl shadow-xl mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl lg:max-w-4xl relative z-20">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#8A7CF5] to-[#65498D] p-1 shadow-2xl">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.pseudo}`}
                    alt={user.pseudo}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#8A7CF5] text-white p-2 rounded-full shadow-lg">
                  <Edit3 size={16} className="cursor-pointer" onClick={handleEditAvatar} />
                </div>
              </div>
              <h2 className="text-[#1A1B2E] text-xl sm:text-2xl lg:text-3xl font-bold mt-3 sm:mt-4">{user.pseudo}</h2>
              <p className="text-[#717182] mt-1 text-sm sm:text-base">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 py-8 lg:py-10 space-y-4 lg:space-y-6">
        {/* Preferences Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#8A7CF5]/10 rounded-lg">
              <Music size={24} className="text-[#8A7CF5]" />
            </div>
            <h3 className="text-[#1A1B2E] text-xl font-bold">Mes Préférences</h3>
          </div>

          {/* Loading State */}
          {isLoadingPreferences && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-[#717182]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8A7CF5]"></div>
                Chargement des préférences...
              </div>
            </div>
          )}

          {/* Preferences Content */}
          {!isLoadingPreferences && (
            <div className="space-y-6">
              {/* Music Genres */}
              <div>
                <label className="block text-[#1A1B2E] text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="p-2 bg-[#8A7CF5]/10 rounded-lg">
                    <Music size={20} className="text-[#8A7CF5]" />
                  </div>
                  Styles musicaux préférés
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {isEditing ? (
                    musicGenreOptions.map(genre => (
                      <button
                        key={genre}
                        onClick={() => toggleMusicGenre(genre)}
                        className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium sm:px-5 sm:py-3 sm:text-base ${
                          musicGenres.includes(genre)
                            ? 'bg-[#8A7CF5] text-white border-[#8A7CF5] shadow-lg transform scale-105'
                            : 'bg-white text-[#717182] border-[#E8EBF5] hover:border-[#8A7CF5] hover:shadow-md'
                        }`}
                      >
                        {genre}
                      </button>
                    ))
                  ) : (
                    preferences?.music_genres?.map(genre => (
                      <span
                        key={genre}
                        className="px-4 py-2.5 bg-[#8A7CF5] text-white rounded-xl text-sm font-medium sm:px-5 sm:py-3 sm:text-base shadow-md"
                      >
                        {genre}
                      </span>
                    )) || (
                      <span className="text-[#717182] text-base italic">Aucun genre sélectionné</span>
                    )
                  )}
                </div>
                <div className="mt-2 text-xs text-[#717182]">
                  {musicGenres.length}/5 genres sélectionnés
                </div>
              </div>

              {/* Go Out Frequency */}
              <div>
                <label className="block text-[#1A1B2E] text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="p-2 bg-[#8A7CF5]/10 rounded-lg">
                    <Calendar size={20} className="text-[#8A7CF5]" />
                  </div>
                  Fréquence de sortie
                </label>
                {isEditing ? (
                  <select
                    value={goOutFrequency}
                    onChange={(e) => setGoOutFrequency(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none focus:ring-2 focus:ring-[#8A7CF5]/20 transition-all duration-200 text-base sm:px-5 sm:py-4 sm:text-lg"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="jamais">Jamais</option>
                    <option value="rarement">Rarement</option>
                    <option value="occasionnellement">Occasionnellement</option>
                    <option value="souvent">Souvent</option>
                    <option value="tres_souvent">Très souvent</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#E8EBF5] rounded-xl">
                    <Calendar size={20} className="text-[#8A7CF5]" />
                    <span className="text-[#1A1B2E] text-base font-medium">
                      {formatFrequency(preferences?.go_out_frequency || '')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-[#8A7CF5] to-[#65498D] text-white py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 sm:mt-6"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  Sauvegarder mes préférences
                </>
              )}
            </button>
          )}
        </div>

        {/* Favorite Bars */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#8A7CF5]/10 rounded-lg">
              <Heart size={24} className="text-[#8A7CF5]" />
            </div>
            <div>
              <h3 className="text-[#1A1B2E] text-xl font-bold">Mes Bars Favoris</h3>
              <span className="text-[#717182] text-sm ml-2">({favoriteBars.length}/3)</span>
            </div>
          </div>

          {favoriteBars.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex flex-col items-center">
                <div className="p-4 bg-[#E8EBF5] rounded-full mb-4">
                  <MapPin size={32} className="text-[#717182]" />
                </div>
                <h4 className="text-[#1A1B2E] text-lg font-semibold mb-2">Pas encore de bars favoris</h4>
                <p className="text-[#717182] mb-6 max-w-md">
                  Explorez la carte et ajoutez vos bars préférés pour les retrouver facilement ici.
                </p>
                <button
                  onClick={() => navigate('/map')}
                  className="inline-flex items-center gap-2 bg-[#8A7CF5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#65498D] transition-all duration-200"
                >
                  <MapPin size={18} />
                  Explorer la carte
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteBars.map((bar) => (
                <div
                  key={bar.id}
                  className="group bg-white border border-[#E8EBF5] rounded-xl p-4 hover:border-[#8A7CF5] hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setSelectedBar(bar);
                    navigate('/map');
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[#1A1B2E] font-semibold text-base flex-1">{bar.name}</h4>
                      <div className="p-1 bg-[#8A7CF5]/10 rounded-lg">
                        <Star size={16} className="text-[#8A7CF5] fill-current" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#717182] text-sm">
                      <MapPin size={16} className="text-[#717182]" />
                      <span className="truncate">{bar.address}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp size={16} className="text-[#8A7CF5]" />
                          <span className="font-semibold">
                            {favoriteBarsStats[bar.id]?.average_mood 
                              ? favoriteBarsStats[bar.id].average_mood.toFixed(1) 
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="text-[#717182]">Ambiance</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users size={16} className="text-[#8A7CF5]" />
                          <span className="font-semibold">
                            {favoriteBarsStats[bar.id]?.total_votes || 0}
                          </span>
                        </div>
                        <div className="text-[#717182]">Votes</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="w-3 h-3 bg-[#8A7CF5] rounded-full"></div>
                          <span className="font-semibold">
                            {calculateCurrentCrowd(bar, favoriteBarsStats[bar.id])}
                          </span>
                        </div>
                        <div className="text-[#717182]">Affluence</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <button
            onClick={handleLogout}
            className="w-full border-2 border-[#EF4444] text-[#EF4444] px-6 py-3 rounded-xl font-semibold hover:bg-[#EF4444] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
