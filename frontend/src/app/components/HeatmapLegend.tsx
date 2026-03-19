export default function HeatmapLegend() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h4 className="text-[#1A1B2E] mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>
        Légende de la carte
      </h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#EF4444]"></div>
          <span className="text-[#717182]" style={{ fontSize: '12px' }}>
            🔥 Ambiance de folie (4-5)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
          <span className="text-[#717182]" style={{ fontSize: '12px' }}>
            🎉 Très animé (3-4)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FBBF24]"></div>
          <span className="text-[#717182]" style={{ fontSize: '12px' }}>
            😊 Agréable (2-3)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#10B981]"></div>
          <span className="text-[#717182]" style={{ fontSize: '12px' }}>
            🤫 Calme (0-2)
          </span>
        </div>
      </div>
    </div>
  );
}
