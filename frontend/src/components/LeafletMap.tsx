import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Bar } from '../types';

interface LeafletMapProps {
  bars: Bar[];
  onBarClick?: (bar: Bar) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ bars, onBarClick, userLocation }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialiser la carte seulement si elle n'existe pas déjà
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([48.8566, 2.3522], 13);

      // Ajouter les tiles OpenStreetMap (gratuits)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Attendre que la carte soit complètement initialisée avant d'ajouter les marqueurs
    setTimeout(() => {
      if (!mapRef.current) return;

      // Nettoyer les marqueurs existants
      markersRef.current.forEach(marker => {
        mapRef.current!.removeLayer(marker);
      });
      markersRef.current = [];

      // Ajouter les marqueurs pour les bars
      bars.forEach(bar => {
        // Icône personnalisé pour les bars
        const barIcon = L.divIcon({
          html: `
            <div style="
              background-color: #8a7cf5;
              border: 2px solid white;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              color: white;
              font-weight: bold;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              🍺
            </div>
          `,
          className: 'custom-bar-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([bar.latitude, bar.longitude], { icon: barIcon });

        // Popup au survol et clic - seulement si des votes existent
        if (bar.votes && Array.isArray(bar.votes) && bar.votes.length > 0) {
          const popupContent = `
            <div style="
              padding: 10px;
              min-width: 200px;
              font-family: Arial, sans-serif;
            ">
              <h3 style="margin: 0 0 8px 0; color: #2d2d44; font-size: 16px;">
                ${bar.name}
              </h3>
              <p style="margin: 0 0 5px 0; color: #3d3d5c; font-size: 14px;">
                📍 ${bar.address}
              </p>
              ${bar.description ? `
                <p style="margin: 0 0 8px 0; color: #555; font-size: 13px; line-height: 1.4;">
                  ${bar.description}
                </p>
              ` : ''}
              <div style="margin-top: 12px; padding: 8px; background: #f8f9fa; border-radius: 6px;">
                <div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">
                  📊 Derniers votes
                </div>
                ${bar.votes.slice(-2).map((vote: any, index: number) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 11px;">
                    <span>
                      Ambiance: ${'⭐'.repeat(vote.ambiance_score || 0)} ${vote.ambiance_score || 0}/5
                    </span>
                    <span style="
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-size: 10px;
                      font-weight: bold;
                      background-color: ${
                        vote.affluence_level === 'pleine' ? '#f87171' :
                        vote.affluence_level === 'moyenne' ? '#f59e0b' : '#10b981'
                      };
                      color: white;
                    ">
                      ${vote.affluence_level}
                    </span>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top: 8px; display: flex; gap: 12px; font-size: 12px;">
                ${bar.phone ? `<span>📞 ${bar.phone}</span>` : ''}
                ${bar.website ? `
                  <a href="${bar.website}" target="_blank" style="color: #8a7cf5; text-decoration: none;">
                    🌐 Site web
                  </a>
                ` : ''}
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Ajouter le gestionnaire de clic
          marker.on('click', () => {
            if (onBarClick) {
              onBarClick(bar);
            }
          });

          marker.addTo(mapRef.current!);
          markersRef.current.push(marker);
        } else {
          // Marqueur sans popup si pas de votes
          marker.on('click', () => {
            if (onBarClick) {
              onBarClick(bar);
            }
          });
          marker.addTo(mapRef.current!);
          markersRef.current.push(marker);
        }
      });

      // Ajouter la position de l'utilisateur si disponible
      if (userLocation) {
        const userIcon = L.divIcon({
          html: `
            <div style="
              background-color: #65498d;
              border: 2px solid white;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              📍
            </div>
          `,
          className: 'custom-user-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(mapRef.current!);
      }
    }, 100); // Attendre 100ms pour s'assurer que le DOM est prêt

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [bars, onBarClick, userLocation]);

  return <div id="map" className="w-full h-full" />;
};

export default LeafletMap;
