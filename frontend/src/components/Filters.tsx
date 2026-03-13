import { useState } from 'react';

interface FiltersProps {
  onFiltersChange: (filters: FiltersState) => void;
}

export interface FiltersState {
  budget: string;
  style_musical: string;
  ambiance_min: string;
  ambiance_max: string;
  affluence: string;
}

const Filters: React.FC<FiltersProps> = ({ onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    budget: '',
    style_musical: '',
    ambiance_min: '',
    ambiance_max: '',
    affluence: ''
  });

  const budgetOptions = [
    { value: '€', label: '€ Pas cher' },
    { value: '€€', label: '€€ Modéré' },
    { value: '€€€', label: '€€€ Cher' },
    { value: '€€€€', label: '€€€€ Très cher' }
  ];

  const styleMusicalOptions = [
    { value: 'rock', label: '🎸 Rock' },
    { value: 'electro', label: '🎧 Electro' },
    { value: 'jazz', label: '🎺 Jazz' },
    { value: 'rap', label: '🎤 Rap' },
    { value: 'pop', label: '🎵 Pop' },
    { value: 'reggae', label: '🌺 Reggae' },
    { value: 'salsa', label: '💃 Salsa' },
    { value: 'variété', label: '🎼 Variété' },
    { value: 'indé', label: '🎸 Indé' },
    { value: 'classique', label: '🎻 Classique' }
  ];

  const ambianceOptions = [
    { value: '0', label: '0 😴' },
    { value: '1', label: '1 😐' },
    { value: '2', label: '2 😕' },
    { value: '3', label: '3 🙂' },
    { value: '4', label: '4 😊' },
    { value: '5', label: '5 🎉' }
  ];

  const affluenceOptions = [
    { value: 'faible', label: '🟢 Faible' },
    { value: 'moyenne', label: '🟡 Moyenne' },
    { value: 'pleine', label: '🔴 Pleine' }
  ];

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      budget: '',
      style_musical: '',
      ambiance_min: '',
      ambiance_max: '',
      affluence: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="relative">
      {/* Bouton d'ouverture des filtres */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`be-btn flex items-center gap-2 ${hasActiveFilters ? 'be-btn-primary' : 'be-btn-secondary'}`}
      >
        <span>🔍</span>
        <span>Filtres</span>
        {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full"></span>}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Panneau des filtres */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-surface-main border border-border-default rounded-lg shadow-lg z-50 p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="be-heading-3">Filtrer les bars</h3>
            <button
              onClick={resetFilters}
              className="be-btn be-btn-secondary text-xs"
            >
              Réinitialiser
            </button>
          </div>

          <div className="space-y-4">
            {/* Budget */}
            <div>
              <label className="be-caption block mb-2">💰 Budget</label>
              <select
                value={filters.budget}
                onChange={(e) => handleFilterChange('budget', e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg bg-surface-main text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">Tous les budgets</option>
                {budgetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style musical */}
            <div>
              <label className="be-caption block mb-2">🎵 Style musical</label>
              <select
                value={filters.style_musical}
                onChange={(e) => handleFilterChange('style_musical', e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg bg-surface-main text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">Tous les styles</option>
                {styleMusicalOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ambiance */}
            <div>
              <label className="be-caption block mb-2">⭐ Ambiance</label>
              <div className="flex gap-2">
                <select
                  value={filters.ambiance_min}
                  onChange={(e) => handleFilterChange('ambiance_min', e.target.value)}
                  className="flex-1 px-3 py-2 border border-border-default rounded-lg bg-surface-main text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">Min</option>
                  {ambianceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="flex items-center text-text-muted">-</span>
                <select
                  value={filters.ambiance_max}
                  onChange={(e) => handleFilterChange('ambiance_max', e.target.value)}
                  className="flex-1 px-3 py-2 border border-border-default rounded-lg bg-surface-main text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">Max</option>
                  {ambianceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Affluence */}
            <div>
              <label className="be-caption block mb-2">👥 Affluence</label>
              <select
                value={filters.affluence}
                onChange={(e) => handleFilterChange('affluence', e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg bg-surface-main text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">Toutes les affluences</option>
                {affluenceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
