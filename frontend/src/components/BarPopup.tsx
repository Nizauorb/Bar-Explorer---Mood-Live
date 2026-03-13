import { useState } from 'react';
import type { Bar } from '../types';

interface BarPopupProps {
  bar: Bar;
  onClose: () => void;
  onVote?: (barId: number, ambianceScore: number, affluenceLevel: 'faible' | 'moyenne' | 'pleine') => void;
  onFavorite?: (barId: number) => void;
  isFavorite?: boolean;
}

const BarPopup: React.FC<BarPopupProps> = ({ bar, onClose, onVote, onFavorite, isFavorite }) => {
  const [ambianceScore, setAmbianceScore] = useState(bar.ambiance_score || 0);
  const [affluenceLevel, setAffluenceLevel] = useState<'faible' | 'moyenne' | 'pleine'>(bar.affluence_level || 'moyenne');

  const handleVote = () => {
    if (onVote) {
      onVote(bar.id, ambianceScore, affluenceLevel);
      onClose();
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(bar.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="be-card max-w-md w-full max-h-[80vh] overflow-y-auto relative">
        <div className="flex justify-between items-start mb-4">
          <h2 className="be-heading-2 text-lg">{bar.name}</h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-2xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Adresse */}
          <div>
            <p className="be-body text-text-muted">📍 {bar.address}</p>
          </div>

          {/* Description */}
          {bar.description && (
            <div>
              <p className="be-body">{bar.description}</p>
            </div>
          )}

          {/* Contact */}
          <div className="flex gap-4 text-sm">
            {bar.phone && (
              <span className="be-body">📞 {bar.phone}</span>
            )}
            {bar.website && (
              <a 
                href={bar.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="be-body text-primary hover:underline"
              >
                🌐 Site web
              </a>
            )}
          </div>

          {/* Vote actuel */}
          {bar.ambiance_score && (
            <div className="be-card bg-surface-muted">
              <h3 className="be-heading-3 mb-2">Vote actuel</h3>
              <div className="flex items-center gap-2 mb-2">
                <span>Ambiance:</span>
                <div className="flex gap-1">
                  {Array.from({length: 5}, (_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: i < (bar.ambiance_score || 0) ? '#8a7cf5' : '#e2e8f0'
                      }}
                    />
                  ))}
                </div>
                <span className="be-caption">{bar.ambiance_score}/5</span>
              </div>
              {bar.affluence_level && (
                <div className="flex items-center gap-2">
                  <span>Affluence:</span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${
                      bar.affluence_level === 'pleine' 
                        ? 'bg-error text-error-text'
                        : bar.affluence_level === 'moyenne'
                        ? 'bg-warning-bg text-warning-text'
                        : 'bg-success-bg text-success-text'
                    }
                  `}>
                    {bar.affluence_level}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Nouveau vote */}
          <div className="be-card bg-surface-muted">
            <h3 className="be-heading-3 mb-3">Noter ce bar</h3>
            
            {/* Ambiance */}
            <div className="mb-4">
              <label className="be-caption block mb-2">Ambiance (0-5)</label>
              <div className="flex gap-2">
                {Array.from({length: 6}, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setAmbianceScore(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      i <= ambianceScore 
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-surface-main border-border-default hover:border-primary'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Affluence */}
            <div className="mb-4">
              <label className="be-caption block mb-2">Affluence actuelle</label>
              <div className="flex gap-2">
                {(['faible', 'moyenne', 'pleine'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setAffluenceLevel(level)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      affluenceLevel === level
                        ? level === 'pleine' 
                          ? 'bg-error text-error-text'
                          : level === 'moyenne'
                          ? 'bg-warning-bg text-warning-text'
                          : 'bg-success-bg text-success-text'
                        : 'bg-surface-main border border-border-default hover:border-primary'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleVote}
              disabled={ambianceScore === 0}
              className="be-btn be-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voter
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleFavorite}
              className={`be-btn flex-1 ${
                isFavorite 
                  ? 'be-btn-secondary' 
                  : 'be-btn-primary'
              }`}
            >
              {isFavorite ? '❤️ Favori' : '🤍 Ajouter aux favoris'}
            </button>
            <button
              onClick={() => {
                // Partager position
                window.navigator.share?.({
                  title: bar.name,
                  text: `Viens au ${bar.name} ! ${bar.address}`,
                  url: window.location.href
                });
              }}
              className="be-btn be-btn-secondary"
            >
              📍 Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarPopup;
