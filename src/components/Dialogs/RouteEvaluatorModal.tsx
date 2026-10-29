import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { soundEngine } from '../../game/audio';

interface RouteEvaluatorModalProps {
  onSelectSafeRoute: () => void;
  onClose: () => void;
}

export const RouteEvaluatorModal: React.FC<RouteEvaluatorModalProps> = ({
  onSelectSafeRoute,
  onClose,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<'A' | 'B' | 'C' | null>(null);

  const routes = [
    {
      id: 'A' as const,
      name: 'Güzergâh A: Kuzey Ahşap Kestirme Köprüsü',
      distance: '350 Metre (En Kısa)',
      status: 'KAPALI & SU BASKININDA',
      isSafe: false,
      color: 'border-red-600/80 bg-red-950/30',
      description: 'Mesafe olarak en kısadır; ancak köprünün ahşap tabliyesi sel suları altındadır ve emniyet şeridiyle kapatılmıştır.',
      warning: '15 cm akıntılı su yayayı sürükler, su altındaki çökükler görünmez. Kestirme diye kapalı köprüye girmek hayati risktir!',
    },
    {
      id: 'B' as const,
      name: 'Güzergâh B: Güney Yüksek Beton Ana Köprü Rotası',
      distance: '650 Metre (Biraz Daha Uzun)',
      status: 'AÇIK VE AFAD ONAYLI',
      isSafe: true,
      color: 'border-emerald-500/80 bg-emerald-950/30',
      description: 'Yüksek beton ayaklı köprüden geçer. Dere taşkın kotunun 2.5 metre üzerindedir. Asfalt yollar açıktır.',
      warning: 'En güvenli ve doğrulanmış rotadır! Afet yönetiminde hızdan önce güvenlik ve doğrulanmış altyapı gelir.',
    },
    {
      id: 'C' as const,
      name: 'Güzergâh C: Dere Kıyısı Toprak Patika',
      distance: '480 Metre (Orta)',
      status: 'DURUMU TEYİTSİZ',
      isSafe: false,
      color: 'border-amber-600/80 bg-amber-950/30',
      description: 'Dere seddesine paralel gider. Resmî güvenlik kontrolü yapılmamıştır ve zemin balçığa dönmüştür.',
      warning: 'Dere yatağı kenarındaki dolgu zeminler ani selde altı oyularak nehre göçebilir. Teyitsiz kıyı yolları kullanılmaz!',
    },
  ];

  const handleConfirm = () => {
    if (selectedRoute === 'B') {
      soundEngine.playSuccess();
      onSelectSafeRoute();
    } else {
      soundEngine.playWarning();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Görev 4.3 — Güvenli Güzergâh Analizi
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Toplanma Alanına Tahliye Rotasını Belirle
            </h3>
            <p className="text-xs text-slate-400">
              Kuzey Köprüsü su altında kalarak kapatıldı. En kısa yolu değil, güvenliği kanıtlanmış rotayı seç.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Cards */}
        <div className="space-y-3">
          {routes.map((rt) => {
            const isSelected = selectedRoute === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedRoute(rt.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${rt.color} ${
                  isSelected ? 'ring-2 ring-sky-400 shadow-lg' : 'hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 font-bold text-xs flex items-center justify-center text-white border border-slate-700">
                      {rt.id}
                    </span>
                    <span className="font-bold text-sm text-white">{rt.name}</span>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                    rt.isSafe ? 'bg-emerald-800 text-emerald-100' : 'bg-red-800 text-red-100'
                  }`}>
                    {rt.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Mesafe: <strong className="text-slate-200">{rt.distance}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rt.description}
                </p>

                {isSelected && (
                  <div className={`mt-2.5 p-2.5 rounded-lg text-xs leading-relaxed ${
                    rt.isSafe 
                      ? 'bg-emerald-950/60 border border-emerald-700/60 text-emerald-200' 
                      : 'bg-red-950/60 border border-red-700/60 text-red-200'
                  }`}>
                    <span className="font-bold">{rt.isSafe ? 'Güvenlik Gerekçesi: ' : 'Tehlike Uyarısı: '}</span>
                    {rt.warning}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <span className="text-xs text-slate-400">
            {selectedRoute === 'B' ? '✅ Güvenli ve teyitli rota seçildi!' : 'Seçiminizi yapıp onaylayın.'}
          </span>
          <button
            onClick={handleConfirm}
            disabled={!selectedRoute}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
              selectedRoute === 'B'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : selectedRoute
                ? 'bg-red-700 hover:bg-red-600 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            Rotayı Onayla
          </button>
        </div>

      </div>
    </div>
  );
};
