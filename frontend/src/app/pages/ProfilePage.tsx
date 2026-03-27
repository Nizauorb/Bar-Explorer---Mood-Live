// frontend/src/app/pages/ProfilePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { ArrowLeft, Edit3, Heart, Music, Calendar, LogOut } from 'lucide-react';
import { useBarsStats } from '../hooks/useBarsStats';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, setSelectedBar } = useApp();
  const { bars } = useBarsStats();
  const [isEditing, setIsEditing] = useState(false);
  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [goOutFrequency, setGoOutFrequency] = useState(user?.preferences?.goOutFrequency || '');
  const [musicGenres, setMusicGenres] = useState(user?.preferences?.musicGenres || []);

  if (!user) {
    navigate('/');
    return null;
  }

  const favoriteBars = bars.filter(bar => user.favoriteBarIds.includes(bar.id));

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
      <div className="bg-gradient-to-br from-[#8A7CF5] to-[#65498D] px-6 py-6 pb-20 relative">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/map')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          <h1 className="text-white" style={{ fontSize: '24px', fontWeight: 700 }}>
            Mon Profil
          </h1>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Edit3 size={20} className="text-white" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-xl overflow-hidden mb-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.pseudo}`}
              alt={user.pseudo}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white mb-1" style={{ fontSize: '28px', fontWeight: 700 }}>
            {user.pseudo}
          </h2>
          <p className="text-white/80" style={{ fontSize: '14px' }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 pb-6 space-y-4">
        {/* Preferences Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-[#1A1B2E] flex items-center gap-2" style={{ fontSize: '20px', fontWeight: 600 }}>
            <Music size={20} className="text-[#8A7CF5]" />
            Préférences
          </h3>

          {/* Music Genres */}
          <div>
            <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Styles musicaux
            </label>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                musicGenreOptions.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleMusicGenre(genre)}
                    className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                      musicGenres.includes(genre)
                        ? 'bg-[#8A7CF5] text-white border-[#8A7CF5]'
                        : 'bg-white text-[#717182] border-[#E8EBF5] hover:border-[#8A7CF5]'
                    }`}
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {genre}
                  </button>
                ))
              ) : (
                user.preferences.musicGenres.map(genre => (
                  <span
                    key={genre}
                    className="px-3 py-2 bg-[#8A7CF5] text-white rounded-lg"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {genre}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Go Out Frequency */}
          <div>
            <label className="flex items-center gap-2 text-[#1A1B2E] mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              <Calendar size={18} className="text-[#8A7CF5]" />
              Fréquence de sortie
            </label>
            {isEditing ? (
              <select
                value={goOutFrequency}
                onChange={(e) => setGoOutFrequency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
              >
                <option value="">Sélectionner...</option>
                <option value="Rarement">Rarement</option>
                <option value="1 fois par semaine">1 fois par semaine</option>
                <option value="2-3 fois par semaine">2-3 fois par semaine</option>
                <option value="Plus de 3 fois par semaine">Plus de 3 fois par semaine</option>
              </select>
            ) : (
              <p className="text-[#717182]" style={{ fontSize: '14px' }}>
                {user.preferences.goOutFrequency}
              </p>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white py-3 rounded-lg transition-colors"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              Sauvegarder
            </button>
          )}
        </div>

        {/* Favorite Bars */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-[#1A1B2E] flex items-center gap-2" style={{ fontSize: '20px', fontWeight: 600 }}>
            <Heart size={20} className="text-[#8A7CF5]" />
            Mes bars favoris
            <span className="text-[#717182]" style={{ fontSize: '14px' }}>
              ({favoriteBars.length}/3)
            </span>
          </h3>

          {favoriteBars.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#717182]" style={{ fontSize: '14px' }}>
                Vous n'avez pas encore de bars favoris
              </p>
              <button
                onClick={() => navigate('/map')}
                className="mt-4 px-6 py-2 bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white rounded-lg transition-colors"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Découvrir des bars
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteBars.map((bar) => (
                <div
                  key={bar.id}
                  className="flex items-center gap-4 p-4 bg-[#E8EBF5] rounded-xl hover:bg-[#d8dbe5] transition-colors cursor-pointer"
                  onClick={() => {
                    // Ouvre directement la popup du bar
                    setSelectedBar(bar);
                    navigate('/map');
                  }}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#8A7CF5] flex items-center justify-center text-white flex-shrink-0">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      {bar.name}
                    </h4>
                    <p className="text-[#717182]" style={{ fontSize: '12px' }}>
                      {bar.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 700 }}>
                      {typeof bar.average_mood === 'string' ? parseFloat(bar.average_mood).toFixed(1) : (bar.average_mood || 0).toFixed(1)}
                    </div>
                    <div className="text-[#717182]" style={{ fontSize: '10px' }}>
                      /5
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
          className="w-full bg-white border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}