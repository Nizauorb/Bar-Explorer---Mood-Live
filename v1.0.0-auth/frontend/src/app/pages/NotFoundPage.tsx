import { useNavigate } from 'react-router';
import { MapPin } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #8A7CF5 0%, #65498D 100%)' }}>
      <div className="text-center">
        <div className="mb-6">
          <MapPin size={80} className="text-white mx-auto mb-4" />
          <h1 className="text-white mb-2" style={{ fontSize: '72px', fontWeight: 700 }}>
            404
          </h1>
          <h2 className="text-white mb-4" style={{ fontSize: '32px', fontWeight: 600 }}>
            Page introuvable
          </h2>
          <p className="text-white/80 mb-8" style={{ fontSize: '16px' }}>
            Oups ! On dirait que vous vous êtes perdu...
          </p>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="px-8 py-4 bg-white text-[#8A7CF5] hover:bg-white/90 rounded-xl transition-colors shadow-lg"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          Retour à la carte
        </button>
      </div>
    </div>
  );
}
