import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  FileCheck2, 
  Info, 
  CloudRain, 
  Sun, 
  AlertTriangle 
} from 'lucide-react';
import { soundEngine } from '../../game/audio';
import { MeteoWarningColor } from '../../types/game';

interface TopBarProps {
  chapterTitle: string;
  simulatedTime: string;
  meteoWarning: MeteoWarningColor;
  score: number;
  currentUser: import('../../services/supabase').AppUser | null;
  onOpenCommunity: () => void;
  onOpenTeacherMode: () => void;
  onOpenFamilyChecklist: () => void;
  onOpenAbout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  chapterTitle,
  simulatedTime,
  meteoWarning,
  score,
  currentUser,
  onOpenCommunity,
  onOpenTeacherMode,
  onOpenFamilyChecklist,
  onOpenAbout,
}) => {
  const [muted, setMuted] = useState(soundEngine.getMuted());

  const handleAudioToggle = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
  };

  const getMeteoBadge = () => {
    switch (meteoWarning) {
      case 'red':
        return { label: 'KIRMIZI UYARI', bg: 'bg-red-600 text-white', icon: AlertTriangle };
      case 'orange':
        return { label: 'TURUNCU KOD', bg: 'bg-amber-600 text-white', icon: AlertTriangle };
      case 'yellow':
        return { label: 'SARI KOD', bg: 'bg-amber-400 text-slate-900', icon: CloudRain };
      default:
        return { label: 'YEŞİL - NORMAL', bg: 'bg-emerald-600 text-white', icon: Sun };
    }
  };

  const meteo = getMeteoBadge();
  const MeteoIcon = meteo.icon;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4 flex items-center justify-between gap-2">
      {/* Brand & Chapter Status */}
      <div className="pointer-events-auto bg-slate-900/90 text-white border border-slate-700/80 rounded-xl px-3 sm:px-4 py-2 shadow-xl flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black tracking-wider text-white shadow-md text-sm">
            72
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">AFET 72</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Yamaçdere</span>
            </div>
            <p className="text-xs text-sky-400 font-medium truncate max-w-[150px] sm:max-w-[240px]">
              {chapterTitle}
            </p>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-700" />

        {/* User / Community / Admin Top-Left Button */}
        <button
          onClick={onOpenCommunity}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md cursor-pointer ${
            currentUser?.role === 'admin'
              ? 'bg-amber-950 border-amber-500 text-amber-200 hover:bg-amber-900'
              : currentUser
              ? 'bg-sky-950 border-sky-500 text-sky-200 hover:bg-sky-900'
              : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
          }`}
          title="Topluluk, Liderlik Tablosu, Sohbet ve Yönetim"
        >
          <span>
            {currentUser?.role === 'admin'
              ? '👑 Yönetici (admin)'
              : currentUser
              ? `👤 ${currentUser.username}`
              : '👤 Giriş / Topluluk'}
          </span>
        </button>

        <div className="hidden md:block h-6 w-px bg-slate-700" />

        {/* Simulated Time */}
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">Simülasyon Zamanı</span>
          <span className="text-xs font-semibold text-emerald-400">{simulatedTime}</span>
        </div>
      </div>

      {/* Meteo Warning & Score Center/Right */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Meteo Warning Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${meteo.bg}`}>
          <MeteoIcon className="w-3.5 h-3.5" />
          <span>{meteo.label}</span>
        </div>

        {/* Score Badge */}
        <div className="bg-slate-900/90 text-white border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Puan:</span>
          <span className="text-sm font-black text-amber-400">{score}</span>
          <span className="text-[11px] text-slate-500">/100</span>
        </div>

        {/* Global Sound Toggle */}
        <button
          onClick={handleAudioToggle}
          title={muted ? 'Sesi Aç' : 'Sesi Kapat'}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 p-2.5 rounded-xl shadow-xl transition-colors cursor-pointer"
        >
          {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Teacher Mode Button */}
        <button
          onClick={onOpenTeacherMode}
          title="Öğretmen Modu & Ön/Son Test"
          className="bg-indigo-950/90 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/80 px-2.5 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden lg:inline">Öğretmen Modu</span>
        </button>

        {/* Family Checklist Button */}
        <button
          onClick={onOpenFamilyChecklist}
          title="Aile Afet Hazırlık Kontrol Listesi"
          className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 px-2.5 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4" />
          <span className="hidden lg:inline">Aile Kontrol Listesi</span>
        </button>

        {/* Info & TARAP / AFAD About Modal */}
        <button
          onClick={onOpenAbout}
          title="Proje & Resmî Kaynaklar"
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 p-2.5 rounded-xl shadow-xl transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
