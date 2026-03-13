import { useState, useEffect } from 'react';
import './App.css';
import type { Bar } from './types';
import BarPopup from './components/BarPopup';
import LeafletMap from './components/LeafletMap';
import Login from './components/Login';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (authToken: string) => {
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  // Charger les bars depuis l'API
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bars`);
        if (!response.ok) {
          throw new Error('Failed to fetch bars');
        }
        const data = await response.json();
        if (data.success) {
          setBars(data.data);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching bars:', err);
        setError('Impossible de charger les bars');
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Geolocation not available or denied');
        }
      );
    }
  }, []);

  const handleBarClick = (bar: Bar) => {
    setSelectedBar(bar);
  };

  const handleClosePopup = () => {
    setSelectedBar(null);
  };

  const handleVote = async (barId: number, ambianceScore: number, affluenceLevel: 'faible' | 'moyenne' | 'pleine') => {
    try {
      // Récupérer le token JWT depuis le localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        alert('Vous devez être connecté pour voter');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bar_id: barId,
          ambiance_score: ambianceScore,
          affluence_level: affluenceLevel
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Vote enregistré avec succès !');
        
        // Recharger les bars pour mettre à jour les votes
        const barsResponse = await fetch(`${API_BASE_URL}/bars`);
        const barsData = await barsResponse.json();
        if (barsData.success) {
          setBars(barsData.data);
        }
      } else {
        // Gérer les erreurs spécifiques
        if (response.status === 429) {
          alert('Vous avez déjà voté pour ce bar récemment. Attendez 15 minutes avant de pouvoir voter à nouveau.');
        } else if (response.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
        } else {
          alert(data.error || 'Erreur lors du vote');
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher la page de login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="be-card">
          <div className="be-body">Chargement des bars...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="be-card">
          <div className="be-body text-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col items-center justify-center p-4">
      {/* Header - au-dessus de la carte */}
      <header className="bg-surface-dark text-text-inverse p-4 shadow-lg rounded-t-xl w-full max-w-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-bold">Bar Explorer</h1>
            <p className="be-caption mt-1 text-xs">Trouvez les bars les plus animés</p>
          </div>
          <button
            onClick={handleLogout}
            className="be-btn be-btn-secondary text-xs px-2"
          >
            🚪 Déconnexion
          </button>
        </div>
      </header>

      {/* Conteneur principal de la carte - taille fixe téléphone */}
      <div className="w-full max-w-md h-[500px] bg-white shadow-xl relative">
        {/* Carte - taille fixe */}
        <div className="w-full h-full">
          <LeafletMap 
            bars={bars} 
            onBarClick={handleBarClick}
            userLocation={userLocation}
          />
        </div>

        {/* Overlay pour les éléments UI au-dessus de la carte */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Les éléments avec pointer-events-auto peuvent interagir */}
        </div>
      </div>

      {/* Barre inférieure - en dessous de la carte */}
      <div className="bg-surface-main border-t border-border-default p-4 rounded-b-xl w-full max-w-md">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-xs pointer-events-auto">
            <span className="text-lg">🗺️</span>
            <span>Carte</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs pointer-events-auto">
            <span className="text-lg">🔍</span>
            <span>Rechercher</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs pointer-events-auto">
            <span className="text-lg">⭐</span>
            <span>Favoris</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs pointer-events-auto">
            <span className="text-lg">👤</span>
            <span>Profil</span>
          </button>
        </div>
      </div>

      {/* Popup du bar */}
      {selectedBar && (
        <BarPopup
          bar={selectedBar}
          onClose={handleClosePopup}
          onVote={handleVote}
        />
      )}
    </div>
  );
}

export default App;
