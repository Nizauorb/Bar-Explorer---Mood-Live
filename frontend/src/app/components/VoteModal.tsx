import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function VoteModal() {
  const { selectedBar, setShowVoteModal, updateBarMood, user } = useApp();
  const [mood, setMood] = useState(3);
  const [crowd, setCrowd] = useState<'faible' | 'moyenne' | 'pleine'>('moyenne');

  if (!selectedBar) return null;

  const handleSubmit = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      return;
    }

    updateBarMood(selectedBar.id, {
      userId: user.id,
      barId: selectedBar.id,
      mood,
      crowd,
    });

    toast.success('Vote enregistré ! Merci pour votre contribution 🎉');
    setShowVoteModal(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setShowVoteModal(false)}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl max-w-md mx-auto animate-in fade-in zoom-in">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[#1A1B2E]" style={{ fontSize: '24px', fontWeight: 600 }}>
            Voter
          </h2>
          <button
            onClick={() => setShowVoteModal(false)}
            className="w-10 h-10 rounded-full bg-[#E8EBF5] flex items-center justify-center hover:bg-[#d8dbe5] transition-colors"
          >
            <X size={20} className="text-[#1A1B2E]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="text-center">
            <p className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
              {selectedBar.name}
            </p>
            <p className="text-[#717182]" style={{ fontSize: '14px' }}>
              Partagez l'ambiance actuelle
            </p>
          </div>

          {/* Mood Slider */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#8A7CF5]" />
              <label className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                Ambiance générale
              </label>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={mood}
                onChange={(e) => setMood(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#E8EBF5] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #FBBF24 40%, #F59E0B 60%, #EF4444 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[#717182]">
                <span>🤫 Calme</span>
                <span className="text-[#1A1B2E]" style={{ fontSize: '18px', fontWeight: 700 }}>
                  {mood.toFixed(1)}
                </span>
                <span>🔥 Fiesta</span>
              </div>
            </div>

            {/* Mood description */}
            <div className="text-center py-3 px-4 bg-gradient-to-r from-[#8A7CF5]/10 to-[#65498D]/10 rounded-xl">
              <span className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                {mood === 0 && '🤫 Très calme'}
                {mood > 0 && mood <= 1 && '😌 Tranquille'}
                {mood > 1 && mood <= 2 && '😊 Détendu'}
                {mood > 2 && mood <= 3 && '🎵 Ambiance agréable'}
                {mood > 3 && mood <= 4 && '🎉 Très animé'}
                {mood > 4 && mood < 5 && '🔥 Ambiance de folie'}
                {mood === 5 && '🔥🔥 FIESTA TOTALE !'}
              </span>
            </div>
          </div>

          {/* Crowd Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-[#8A7CF5]" />
              <label className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                Affluence estimée
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setCrowd('faible')}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  crowd === 'faible'
                    ? 'border-[#10B981] bg-[#10B981]/10'
                    : 'border-[#E8EBF5] hover:border-[#8A7CF5]'
                }`}
              >
                <div className="text-2xl mb-1">🟢</div>
                <div className="text-[#1A1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Faible
                </div>
              </button>

              <button
                onClick={() => setCrowd('moyenne')}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  crowd === 'moyenne'
                    ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                    : 'border-[#E8EBF5] hover:border-[#8A7CF5]'
                }`}
              >
                <div className="text-2xl mb-1">🟡</div>
                <div className="text-[#1A1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Moyenne
                </div>
              </button>

              <button
                onClick={() => setCrowd('pleine')}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  crowd === 'pleine'
                    ? 'border-[#EF4444] bg-[#EF4444]/10'
                    : 'border-[#E8EBF5] hover:border-[#8A7CF5]'
                }`}
              >
                <div className="text-2xl mb-1">🔴</div>
                <div className="text-[#1A1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Pleine
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#E8EBF5] rounded-xl p-3 text-center">
            <p className="text-[#717182]" style={{ fontSize: '12px' }}>
              ⚠️ Vous pouvez voter toutes les 15 minutes
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] text-white py-4 rounded-xl transition-colors shadow-lg"
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            Envoyer mon vote
          </button>
        </div>
      </div>
    </>
  );
}
