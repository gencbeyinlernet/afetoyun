import React from 'react';
import { 
  Play, 
  GraduationCap, 
  FileCheck2, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  Waves, 
  Mountain, 
  CheckCircle2 
} from 'lucide-react';
import { soundEngine } from '../../game/audio';

interface WelcomeScreenProps {
  currentUser: import('../../services/supabase').AppUser | null;
  onOpenCommunity: () => void;
  onStartGame: () => void;
  onOpenTeacherMode: () => void;
  onOpenFamilyChecklist: () => void;
  onOpenAbout: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentUser,
  onOpenCommunity,
  onStartGame,
  onOpenTeacherMode,
  onOpenFamilyChecklist,
  onOpenAbout,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Top Left User / Community Quick Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onOpenCommunity}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-xl cursor-pointer ${
            currentUser?.role === 'admin'
              ? 'bg-amber-950 border-amber-500 text-amber-200 hover:bg-amber-900'
              : currentUser
              ? 'bg-sky-950 border-sky-500 text-sky-200 hover:bg-sky-900'
              : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
          }`}
          title="Kullanıcı Girişi, Skor Tablosu ve Sohbet"
        >
          <span>
            {currentUser?.role === 'admin'
              ? '👑 Yönetici (admin)'
              : currentUser
              ? `👤 ${currentUser.username}`
              : '👤 Giriş / Topluluk & Skorlar'}
          </span>
        </button>
      </div>

      {/* Background Graphic elements */}
      <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-slate-950 opacity-90 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-sky-950/25 via-transparent to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-6 sm:space-y-8 my-auto py-6">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Rize Yamaçdere Sel ve Heyelan Simülasyonu</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span className="text-red-500 font-mono">AFET</span>
            <span className="bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">72</span>
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-sky-400 tracking-wide">
            Mahalleni Kurtar!
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed pt-1">
            Afetten önce yaptığın hazırlıklar afet sırasındaki kararlarını; afet sırasındaki kararların ise sonraki 72 saatin nasıl geçeceğini belirler.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1 shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center mb-1.5">
              <Mountain className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white">İzometrik 3D Mahalle</h4>
            <p className="text-[11px] text-slate-400">
              40×30 karelik Yamaçdere haritasında dereyi, köprüleri, yamacı ve evleri keşfet.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1 shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center mb-1.5">
              <Waves className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white">9 Bölümlük Kurgusal Hikâye</h4>
            <p className="text-[11px] text-slate-400">
              T-48 hazırlık saatinden sel taşkını ve heyelan anına, 72 saatlik toparlanma kararları.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1 shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-1.5">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white">Gerçek Yaşama Aktarım</h4>
            <p className="text-[11px] text-slate-400">
              Sadece sanal puan değil; ailenle evde uygulayabileceğin yazdırılabilir kontrol listesi.
            </p>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-red-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Simülasyona Başla</span>
          </button>

          <button
            onClick={onOpenTeacherMode}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/80 font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Öğretmen Modu & Ön/Son Test</span>
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-1">
          <button
            onClick={onOpenFamilyChecklist}
            className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Aile Kontrol Listesi</span>
          </button>
          <span>•</span>
          <button
            onClick={onOpenAbout}
            className="hover:text-sky-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Proje & Resmî Kaynaklar</span>
          </button>
        </div>

        {/* Legal / Scientific Disclaimer */}
        <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-500 max-w-md mx-auto">
          Eğitsel simülasyondur; gerçek zamanlı meteorolojik afet tahmini veya acil müdahale sistemi değildir. Gerçek acil durumlarda 112 ve AFAD resmî talimatları esastır.
        </div>

      </div>
    </div>
  );
};
