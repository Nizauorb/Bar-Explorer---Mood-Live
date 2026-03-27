// frontend/src/app/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { ArrowLeft, Edit3, Heart, Music, Calendar, LogOut } from 'lucide-react';
import { calculateCurrentCrowd } from '../utils/heatmapUtils';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, setSelectedBar, favoriteBars, favoriteBarsStats, isInitialized } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [goOutFrequency, setGoOutFrequency] = useState(user?.preferences?.goOutFrequency || '');
  const [musicGenres, setMusicGenres] = useState(user?.preferences?.musicGenres || []);

  // Rediriger si non connecté
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Afficher l'état de chargement pendant l'initialisation
  if (!isInitialized || !user) {
    //console.log('🔍 ProfilePage - Attente initialisation:', { isInitialized, hasUser: !!user });
    return (
      <div className="min-h-screen bg-[#E8EBF5] flex items-center justify-center">
        <div className="text-[#717182]" style={{ fontSize: '16px' }}>
          Chargement...
        </div>
      </div>
    );
  }

  // Afficher l'état de chargement si les favoris ne sont pas encore chargés
  if (favoriteBars.length === 0 && user.favoriteBarIds && user.favoriteBarIds.length > 0) {
    //console.log('🔍 ProfilePage - Attente favoris:', { 
      //favoriteBarsLength: favoriteBars.length, 
      //expectedFavorites: user.favoriteBarIds.length,
      //favoriteBarIds: user.favoriteBarIds
    //});
    return (
      <div className="min-h-screen bg-[#E8EBF5] flex items-center justify-center">
        <div className="text-[#717182]" style={{ fontSize: '16px' }}>
          Chargement des favoris...
        </div>
      </div>
    );
  }

  //console.log('✅ ProfilePage - Affichage principal:', { 
  //  favoriteBarsLength: favoriteBars.length,
  //  hasFavoriteIds: user.favoriteBarIds?.length || 0
  //});

  const handleSave = async () => {
    const result = await authService.updateUser({
      id: user.id,
      pseudo,
      preferences: {
        musicGenres,
        goOutFrequency,
      },
    });
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const musicGenreOptions = ['Électro', 'Rock', 'Jazz', 'Hip-Hop', 'Pop', 'Techno', 'Reggae'];

  const toggleMusicGenre = (genre: string) => {
    if (musicGenres.includes(genre)) {
      setMusicGenres(musicGenres.filter(g => g !== genre));
    } else {
      setMusicGenres([...musicGenres, genre]);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EBF5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8A7CF5] to-[#65498D] px-4 py-4 pb-16 relative sm:px-6 sm:py-6 sm:pb-20">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/map')}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={16} className="text-white sm:size-20" />
          </button>

          <h1 className="text-white text-lg sm:text-2xl" style={{ fontWeight: 700 }}>
            Mon Profil
          </h1>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Edit3 size={16} className="text-white sm:size-20" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white shadow-xl overflow-hidden mb-2 sm:mb-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.pseudo}`}
              alt={user.pseudo}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white mb-1 sm:mb-1 text-xl sm:text-2xl" style={{ fontWeight: 700 }}>
            {user.pseudo}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm" style={{ fontSize: '12px' }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 -mt-8 sm:-mt-12 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
        {/* Preferences Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-[#1A1B2E] flex items-center gap-2 text-lg sm:text-xl" style={{ fontWeight: 600 }}>
            <Music size={18} className="text-[#8A7CF5] sm:size-20" />
            Préférences
          </h3>

          {/* Music Genres */}
          <div>
            <label className="block text-[#1A1B2E] mb-2 text-sm sm:text-base" style={{ fontWeight: 600 }}>
              Styles musicaux
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {isEditing ? (
                musicGenreOptions.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleMusicGenre(genre)}
                    className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg border-2 transition-colors text-xs sm:text-sm ${
                      musicGenres.includes(genre)
                        ? 'bg-[#8A7CF5] text-white border-[#8A7CF5]'
                        : 'bg-white text-[#717182] border-[#E8EBF5] hover:border-[#8A7CF5]'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {genre}
                  </button>
                ))
              ) : (
                user.preferences.musicGenres.map(genre => (
                  <span
                    key={genre}
                    className="px-2 py-1 sm:px-3 sm:py-2 bg-[#8A7CF5] text-white rounded-lg text-xs sm:text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    {genre}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Go Out Frequency */}
          <div>
            <label className="flex items-center gap-2 text-[#1A1B2E] mb-2 text-sm sm:text-base" style={{ fontWeight: 600 }}>
              <Calendar size={16} className="text-[#8A7CF5] sm:size-18" />
              Fréquence de sortie
            </label>
            {isEditing ? (
              <select
                value={goOutFrequency}
                onChange={(e) => setGoOutFrequency(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors text-sm sm:text-base"
              >
                <option value="">Sélectionner...</option>
                <option value="Rarement">Rarement</option>
                <option value="1 fois par semaine">1 fois par semaine</option>
                <option value="2-3 fois par semaine">2-3 fois par semaine</option>
                <option value="Plus de 3 fois par semaine">Plus de 3 fois par semaine</option>
              </select>
            ) : (
              <p className="text-[#717182] text-sm sm:text-base" style={{ fontSize: '14px' }}>
                {user.preferences.goOutFrequency}
              </p>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              style={{ fontWeight: 600 }}
            >
              Sauvegarder
            </button>
          )}
        </div>

        {/* Favorite Bars */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-[#1A1B2E] flex items-center gap-2 text-lg sm:text-xl" style={{ fontWeight: 600 }}>
            <Heart size={18} className="text-[#8A7CF5] sm:size-20" />
            Mes bars favoris
            <span className="text-[#717182] text-xs sm:text-sm" style={{ fontSize: '12px' }}>
              ({favoriteBars.length}/3)
            </span>
          </h3>

          {favoriteBars.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-[#717182] text-sm" style={{ fontSize: '14px' }}>
                Vous n'avez pas encore de bars favoris
              </p>
              <button
                onClick={() => navigate('/map')}
                className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white rounded-lg transition-colors text-sm sm:text-base"
                style={{ fontWeight: 600 }}
              >
                Découvrir des bars
              </button>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {favoriteBars.map((bar) => (
                <div
                  key={bar.id}
                  className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#E8EBF5] rounded-xl hover:bg-[#d8dbe5] transition-colors cursor-pointer"
                  onClick={() => {
                    // Ouvre directement la popup du bar
                    setSelectedBar(bar);
                    navigate('/map');
                  }}
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <h4 className="text-[#1A1B2E] text-sm sm:text-base" style={{ fontWeight: 600 }}>
                      {bar.name}
                    </h4>
                    <p className="text-[#717182] text-xs sm:text-sm" style={{ fontSize: '12px' }}>
                      {bar.address}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
                      {/* Stats synchronisées */}
                      <div className="flex items-center gap-1">
                        <div className="text-[#1A1B2E] text-xs sm:text-sm" style={{ fontWeight: 600 }}>
                          Ambiance:
                        </div>
                        <div className="text-[#1A1B2E] text-xs sm:text-sm font-bold">
                          {favoriteBarsStats[bar.id]?.average_mood 
                            ? favoriteBarsStats[bar.id].average_mood.toFixed(1) 
                            : 'N/A'
                          }/5
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-[#1A1B2E] text-xs sm:text-sm" style={{ fontWeight: 600 }}>
                          Votes:
                        </div>
                        <div className="text-[#1A1B2E] text-xs sm:text-sm font-bold">
                          {favoriteBarsStats[bar.id]?.total_votes || 0}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-[#1A1B2E] text-xs sm:text-sm" style={{ fontWeight: 600 }}>
                          Affluence:
                        </div>
                        <div className="text-[#1A1B2E] text-xs sm:text-sm font-bold">
                          {calculateCurrentCrowd(bar, favoriteBarsStats[bar.id])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white py-2 sm:py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          style={{ fontWeight: 600 }}
        >
          <LogOut size={16} className="sm:size-20" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}