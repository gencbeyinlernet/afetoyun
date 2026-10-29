import React from 'react';
import { 
  X, 
  Building2, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { MapBuilding } from '../../types/game';

interface ObjectInfoDrawerProps {
  building: MapBuilding | null;
  isInspected: boolean;
  onClose: () => void;
}

export const ObjectInfoDrawer: React.FC<ObjectInfoDrawerProps> = ({
  building,
  isInspected,
  onClose,
}) => {
  if (!building) return null;

  const getRiskBadge = () => {
    switch (building.riskCategory) {
      case 'flood':
        return { label: 'Sel & Taşkın Riski', bg: 'bg-red-950/80 text-red-300 border-red-700' };
      case 'landslide':
        return { label: 'Zemin / Heyelan Riski', bg: 'bg-amber-950/80 text-amber-300 border-amber-700' };
      case 'infrastructure':
        return { label: 'Altyapı & Drenaj', bg: 'bg-sky-950/80 text-sky-300 border-sky-700' };
      default:
        return { label: 'Güvenli Bölge / Hizmet', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700' };
    }
  };

  const badge = getRiskBadge();

  return (
    <div className="absolute top-20 right-4 z-30 w-80 sm:w-96 bg-slate-900/95 border border-slate-700/90 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-100 flex flex-col gap-3 animate-in slide-in-from-right duration-200 backdrop-blur-none">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="min-w-0">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.bg}`}>
            {badge.label}
          </span>
          <h3 className="text-base font-bold text-white mt-1.5 truncate">
            {building.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-slate-300">Konum: X:{building.tileX} Y:{building.tileY}</span>
        </div>

        {building.residentsCount !== undefined && building.residentsCount > 0 && (
          <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300">{building.residentsCount} Kişi</span>
          </div>
        )}
      </div>

      {/* Risk Description */}
      {building.riskDescription && (
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-200 block mb-1">Gözlem & Durum Raporu:</span>
          {building.riskDescription}
        </div>
      )}

      {/* Special Hazard Sign Details */}
      {building.signDetails && (
        <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-800/60 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block">Kritik Uyarı:</span>
            {building.signDetails}
          </div>
        </div>
      )}

      {/* Inspection status indicator */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
        <span className="text-slate-400">İnceleme Durumu:</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Kaydedildi
        </span>
      </div>

    </div>
  );
};
