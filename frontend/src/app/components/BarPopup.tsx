import { useApp } from '../context/AppContext';
import { X, Heart, MapPin, Clock, DollarSign, Users as UsersIcon, TrendingUp } from 'lucide-react';

export default function BarPopup() {
  const { selectedBar, setSelectedBar, user, toggleFavorite, setShowVoteModal } = useApp();

  if (!selectedBar) return null;

  const isFavorite = user?.favoriteBarIds.includes(selectedBar.id);

  const getMoodLabel = (mood: number): string => {
    if (mood >= 4.5) return '🔥 Ambiance de folie !';
    if (mood >= 3.5) return '🎉 Très animé';
    if (mood >= 2.5) return '😊 Bonne ambiance';
    if (mood >= 1.5) return '😌 Tranquille';
    return '🤫 Calme';
  };

  const getCrowdLabel = (crowd: string): string => {
    if (crowd === 'pleine') return '🔴 Complet';
    if (crowd === 'moyenne') return '🟡 Modéré';
    return '🟢 Peu de monde';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-20"
        onClick={() => setSelectedBar(null)}
      />

      {/* Popup */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <button
            onClick={() => setSelectedBar(null)}
            className="w-10 h-10 rounded-full bg-[#E8EBF5] flex items-center justify-center hover:bg-[#d8dbe5] transition-colors"
          >
            <X size={20} className="text-[#1A1B2E]" />
          </button>

          <h2 className="text-[#1A1B2E] flex-1 text-center" style={{ fontSize: '24px', fontWeight: 600 }}>
            {selectedBar.name}
          </h2>

          <button
            onClick={() => toggleFavorite(selectedBar.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isFavorite
                ? 'bg-[#8A7CF5] text-white'
                : 'bg-[#E8EBF5] text-[#717182] hover:bg-[#d8dbe5]'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Image */}
          {selectedBar.imageUrl && (
            <img
              src={selectedBar.imageUrl}
              alt={selectedBar.name}
              className="w-full h-48 object-cover rounded-xl"
            />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedBar.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#E8EBF5] text-[#65498D] rounded-full"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Mood & Crowd Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#8A7CF5]/10 to-[#65498D]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-[#8A7CF5]" />
                <span className="text-[#717182]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  AMBIANCE
                </span>
              </div>
              <div className="text-[#1A1B2E]" style={{ fontSize: '20px', fontWeight: 700 }}>
                {selectedBar.currentMood.toFixed(1)}/5
              </div>
              <div className="text-[#717182]" style={{ fontSize: '12px' }}>
                {getMoodLabel(selectedBar.currentMood)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8A7CF5]/10 to-[#65498D]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <UsersIcon size={20} className="text-[#8A7CF5]" />
                <span className="text-[#717182]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  AFFLUENCE
                </span>
              </div>
              <div className="text-[#1A1B2E] capitalize" style={{ fontSize: '20px', fontWeight: 700 }}>
                {selectedBar.currentCrowd}
              </div>
              <div className="text-[#717182]" style={{ fontSize: '12px' }}>
                {getCrowdLabel(selectedBar.currentCrowd)}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#8A7CF5] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[#1A1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Adresse
                </div>
                <div className="text-[#717182]" style={{ fontSize: '14px' }}>
                  {selectedBar.address}
                </div>
              </div>
            </div>

            {selectedBar.hours && (
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#8A7CF5] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[#1A1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                    Horaires
                  </div>
                  <div className="text-[#717182]" style={{ fontSize: '14px' }}>
                    {selectedBar.hours}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <DollarSign size={20} className="text-[#8A7CF5] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[#1A1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Prix moyen
                </div>
                <div className="text-[#717182]" style={{ fontSize: '14px' }}>
                  {selectedBar.priceRange}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {selectedBar.description && (
            <div className="bg-[#E8EBF5] rounded-xl p-4">
              <p className="text-[#1A1B2E]" style={{ fontSize: '14px' }}>
                {selectedBar.description}
              </p>
            </div>
          )}

          {/* Services */}
          {selectedBar.services && selectedBar.services.length > 0 && (
            <div>
              <h4 className="text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedBar.services.map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-white border-2 border-[#E8EBF5] text-[#1A1B2E] rounded-lg"
                    style={{ fontSize: '12px' }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vote Count */}
          <div className="text-center text-[#717182]" style={{ fontSize: '12px' }}>
            {selectedBar.voteCount} personnes ont voté récemment
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-4">
            <button
              onClick={() => {
                setShowVoteModal(true);
              }}
              className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white py-4 rounded-xl transition-colors shadow-lg"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              Voter pour l'ambiance
            </button>

            <button
              className="w-full bg-white border-2 border-[#8A7CF5] text-[#8A7CF5] hover:bg-[#8A7CF5] hover:text-white py-4 rounded-xl transition-colors"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              Inviter des amis
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
