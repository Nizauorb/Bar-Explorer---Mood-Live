import { Users } from 'lucide-react';

export default function HeatmapLegend() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Users size={16} className="text-[#8A7CF5]" />
        <span className="text-xs font-semibold text-[#1A1B2E]">Affluence Actuelle</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-xs text-gray-600"> Faible affluence</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
        <span className="text-xs text-gray-600"> Affluence modérée</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-xs text-gray-600"> Forte affluence</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        <span className="text-xs text-gray-600"> Pas de données</span>
      </div>
    </div>
  );
}
