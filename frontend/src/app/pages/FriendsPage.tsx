import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Search, UserPlus, MapPin, Star } from 'lucide-react';

export default function FriendsPage() {
  const navigate = useNavigate();
  const { friends, bars } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  const filteredFriends = friends.filter(friend =>
    friend.pseudo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBarName = (barId?: string) => {
    if (!barId) return null;
    const bar = bars.find(b => b.id === barId);
    return bar?.name;
  };

  return (
    <div className="min-h-screen bg-[#E8EBF5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8A7CF5] to-[#65498D] px-6 py-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/map')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          <h1 className="text-white" style={{ fontSize: '24px', fontWeight: 700 }}>
            Mes Amis
          </h1>

          <button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <UserPlus size={20} className="text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ami..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="mx-6 -mt-6 mb-6 bg-white rounded-2xl shadow-lg p-6 space-y-4 animate-in slide-in-from-top">
          <h3 className="text-[#1A1B2E]" style={{ fontSize: '18px', fontWeight: 600 }}>
            Ajouter un ami
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Pseudo de votre ami..."
              className="flex-1 px-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
            />
            <button className="px-6 py-3 bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white rounded-lg transition-colors shadow-lg">
              <UserPlus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="px-6 pb-6 space-y-3">
        {filteredFriends.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-[#1A1B2E] mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>
              Aucun ami trouvé
            </h3>
            <p className="text-[#717182]" style={{ fontSize: '14px' }}>
              {searchQuery
                ? 'Essayez une autre recherche'
                : 'Ajoutez des amis pour voir leur activité'}
            </p>
          </div>
        ) : (
          <>
            {/* Best Friend (First in list) */}
            {filteredFriends[0] && (
              <div className="bg-gradient-to-br from-[#8A7CF5] to-[#65498D] rounded-2xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Star size={24} className="text-yellow-300" fill="currentColor" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white overflow-hidden ring-4 ring-white/30">
                      <img
                        src={filteredFriends[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${filteredFriends[0].pseudo}`}
                        alt={filteredFriends[0].pseudo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {filteredFriends[0].isOnline && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
                        {filteredFriends[0].pseudo}
                      </h3>
                      <span className="px-2 py-0.5 bg-yellow-300 text-[#65498D] rounded-full" style={{ fontSize: '10px', fontWeight: 700 }}>
                        MEILLEUR AMI
                      </span>
                    </div>
                    {filteredFriends[0].currentBar ? (
                      <div className="flex items-center gap-1 text-white/90">
                        <MapPin size={14} />
                        <span style={{ fontSize: '12px' }}>
                          {getBarName(filteredFriends[0].currentBar)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/70" style={{ fontSize: '12px' }}>
                        {filteredFriends[0].isOnline ? 'En ligne' : 'Hors ligne'}
                      </span>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-white text-[#8A7CF5] rounded-lg hover:bg-white/90 transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>
                    Inviter
                  </button>
                </div>
              </div>
            )}

            {/* Other Friends */}
            {filteredFriends.slice(1).map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-[#E8EBF5] overflow-hidden">
                      <img
                        src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.pseudo}`}
                        alt={friend.pseudo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {friend.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      {friend.pseudo}
                    </h3>
                    {friend.currentBar ? (
                      <div className="flex items-center gap-1 text-[#8A7CF5]">
                        <MapPin size={14} />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>
                          {getBarName(friend.currentBar)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#717182]" style={{ fontSize: '12px' }}>
                        {friend.isOnline ? 'En ligne' : 'Hors ligne'}
                      </span>
                    )}
                  </div>
                  {friend.currentBar && (
                    <button className="px-4 py-2 bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white rounded-lg transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>
                      Rejoindre
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
