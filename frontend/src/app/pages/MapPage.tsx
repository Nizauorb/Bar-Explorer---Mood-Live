import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { User, MapPin, Search, Filter, Users } from 'lucide-react';
import BarPopup from '../components/BarPopup';
import VoteModal from '../components/VoteModal';
import HeatmapLegend from '../components/HeatmapLegend';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const getMarkerColor = (mood: number): string => {
  if (mood >= 4) return '#EF4444';
  if (mood >= 3) return '#F59E0B';
  if (mood >= 2) return '#FBBF24';
  return '#10B981';
};

const createCustomIcon = (mood: number) => {
  const color = getMarkerColor(mood);
  const svgIcon = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="3"/>
    </svg>
  `;
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function MapPage() {
  const navigate = useNavigate();
  const { bars, locationEnabled, setLocationEnabled, selectedBar, setSelectedBar, showVoteModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [48.8566, 2.3522], // Paris
      zoom: 13,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers and circles when bars change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.remove());
    circlesRef.current.forEach(circle => circle.remove());
    markersRef.current = [];
    circlesRef.current = [];

    // Add circles for heatmap
    bars.forEach(bar => {
      const circle = L.circle([bar.latitude, bar.longitude], {
        radius: bar.currentMood * 100,
        fillColor: getMarkerColor(bar.currentMood),
        fillOpacity: 0.2,
        color: getMarkerColor(bar.currentMood),
        opacity: 0.4,
        weight: 2,
      }).addTo(mapRef.current!);
      circlesRef.current.push(circle);
    });

    // Add markers for bars
    bars.forEach(bar => {
      const marker = L.marker([bar.latitude, bar.longitude], {
        icon: createCustomIcon(bar.currentMood),
      })
        .bindPopup(`<div class="text-sm"><strong>${bar.name}</strong></div>`)
        .on('click', () => setSelectedBar(bar))
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [bars, setSelectedBar]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/30 to-transparent">
        <button
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <User size={24} className="text-[#8A7CF5]" />
        </button>

        <button
          onClick={() => setLocationEnabled(!locationEnabled)}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            locationEnabled
              ? 'bg-[#8A7CF5] text-white'
              : 'bg-white text-[#8A7CF5]'
          }`}
        >
          <MapPin size={24} />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-3">
        {/* Friends and Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/friends')}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Users size={24} className="text-[#8A7CF5]" />
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717182]" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un bar..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-lg border-2 border-transparent focus:border-[#8A7CF5] focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
              showFilters
                ? 'bg-[#8A7CF5] text-white'
                : 'bg-white text-[#8A7CF5]'
            }`}
          >
            <Filter size={24} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 space-y-3">
            <h3 className="text-[#1A1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
              Filtres
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Ambiance forte', 'Calme', 'DJ', 'Rock', 'Jazz', 'Budget <15€', 'Terrasse'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-full border-2 border-[#8A7CF5] text-[#8A7CF5] hover:bg-[#8A7CF5] hover:text-white transition-colors"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bar Detail Popup */}
      {selectedBar && <BarPopup />}

      {/* Vote Modal */}
      {showVoteModal && <VoteModal />}

      {/* Heatmap Legend */}
      <div className="absolute top-20 right-4 z-10">
        <HeatmapLegend />
      </div>
    </div>
  );
}
