import { useState, useEffect } from 'react';
import './App.css';
import type { Bar } from './types';
import BarPopup from './components/BarPopup';
import LeafletMap from './components/LeafletMap';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bar_id: barId,
          ambiance_score: ambianceScore,
          affluence_level: affluenceLevel
        })
      });
      
      if (response.ok) {
        // Recharger les bars pour mettre à jour les votes
        const barsResponse = await fetch(`${API_BASE_URL}/bars`);
        const barsData = await barsResponse.json();
        if (barsData.success) {
          setBars(barsData.data);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

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
    <div className="min-h-screen bg-surface-muted relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-surface-dark text-text-inverse p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Bar Explorer - Mood Live</h1>
          <p className="be-caption mt-1">Trouvez les bars les plus animés en temps réel</p>
        </div>
      </header>

      {/* Carte */}
      <main className="h-screen pt-20">
        <LeafletMap 
          bars={bars} 
          onBarClick={handleBarClick}
          userLocation={userLocation}
        />
      </main>

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
