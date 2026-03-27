import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { createVote, VoteRequest } from '../services/voteService';

export default function VoteModal() {
  const { selectedBar, setShowVoteModal, user, refreshBarStats  } = useApp();
  const [mood, setMood] = useState(3);
  const [crowd, setCrowd] = useState<'faible' | 'moyenne' | 'pleine'>('moyenne');
  const [isLoading, setIsLoading ] = useState(false);

  if (!selectedBar) return null;

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      return;
    }

    if (!user || isLoading) {
      return; 
    }

    setIsLoading(true);

    try {
      const voteData: VoteRequest = {
        bar_id: selectedBar.id,
        mood: Math.round(mood), // API attend un entier 0-5
        crowd,
        comment: `Ambiance: ${getMoodDescription(mood)}`,
      };

      const response = await createVote(voteData);

      if (response.success) {
        toast.success('Vote enregistré ! Merci pour votre contribution 🎉');
        setShowVoteModal(false);
        
        // Forcer le rechargement des stats dans BarPopup
        if (selectedBar) {
          // Déclencher un événement que BarPopup écoute
          const event = new CustomEvent('voteUpdated', { detail: { barId: selectedBar.id } });
          window.dispatchEvent(event);
        }
      }
    } catch (error: any) {
      console.error('Erreur vote:', error);
      if (error.message.includes('attendre')) {
        toast.error(error.message);
      } else {
        toast.error(error.message || 'Erreur lors du vote');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodDescription = (moodValue: number): string => {
    if (moodValue === 0) return '🤫 Très calme';
    if (moodValue <= 1) return '😌 Tranquille';
    if (moodValue <= 2) return '😊 Détendu';
    if (moodValue <= 3) return '🎵 Ambiance agréable';
    if (moodValue <= 4) return '🎉 Très animé';
    if (moodValue < 5) return '🔥 Ambiance de folie';
    return '🔥🔥 FIESTA TOTALE !';
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
                {getMoodDescription(mood)}
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
            disabled={isLoading}
            className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] disabled:bg-[#ccc] disabled:cursor-not-allowed text-white py-4 rounded-xl transition-colors shadow-lg"
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer mon vote'}
          </button>
        </div>
      </div>
    </>
  );
}
