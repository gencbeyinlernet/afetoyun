import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Droplets, 
  Utensils, 
  Flashlight, 
  Volume2, 
  Radio, 
  HeartPulse, 
  Pill, 
  FileText, 
  Tv, 
  Book, 
  Wind, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { BAG_ITEMS } from '../../data/bagItems';
import { soundEngine } from '../../game/audio';

interface BagPackerModalProps {
  initialPackedIds: string[];
  onConfirmBag: (packedItemIds: string[]) => void;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Droplets,
  Utensils,
  Flashlight,
  Volume2,
  Radio,
  HeartPulse,
  Pill,
  FileText,
  Package,
  Tv,
  Book,
  Wind,
};

export const BagPackerModal: React.FC<BagPackerModalProps> = ({
  initialPackedIds,
  onConfirmBag,
  onClose,
}) => {
  const [packedIds, setPackedIds] = useState<string[]>(initialPackedIds);
  const [selectedItemExplanation, setSelectedItemExplanation] = useState<string | null>(null);

  const totalWeight = packedIds.reduce((sum, id) => {
    const item = BAG_ITEMS.find(i => i.id === id);
    return sum + (item?.weightUnits || 0);
  }, 0);

  const MAX_CAPACITY = 8;

  const toggleItem = (itemId: string) => {
    const item = BAG_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    setSelectedItemExplanation(`${item.name}: ${item.explanation}`);

    if (packedIds.includes(itemId)) {
      soundEngine.playClick();
      setPackedIds(prev => prev.filter(id => id !== itemId));
    } else {
      if (totalWeight + item.weightUnits > MAX_CAPACITY) {
        soundEngine.playWarning();
        setSelectedItemExplanation(`Kapasite Aşıldı! Çanta en fazla ${MAX_CAPACITY} birim ağırlık taşıyabilir. Gereksiz eşyaları çıkarın.`);
        return;
      }
      soundEngine.playClick();
      setPackedIds(prev => [...prev, itemId]);
    }
  };

  const essentialPackedCount = packedIds.filter(id => {
    const it = BAG_ITEMS.find(i => i.id === id);
    return it?.isEssential;
  }).length;

  const unnecessaryPackedCount = packedIds.filter(id => {
    const it = BAG_ITEMS.find(i => i.id === id);
    return !it?.isEssential;
  }).length;

  const isValidBag = essentialPackedCount >= 5 && unnecessaryPackedCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Görev 2.1 — Afet Çantası Hazırlığı
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              72 Saatlik Afet ve Acil Durum Çantasını Paketle
            </h3>
            <p className="text-xs text-slate-400">
              Çantayı hafif, taşınabilir ve hayati tut. İlk 72 saat hayatta kalmayı sağlayacak temel malzemeleri seç.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capacity Bar & Status */}
        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span>Çanta Ağırlık / Hacim Kapasitesi</span>
              <span className={totalWeight > MAX_CAPACITY ? 'text-red-400' : 'text-emerald-400'}>
                {totalWeight} / {MAX_CAPACITY} Birim
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  totalWeight > MAX_CAPACITY ? 'bg-red-500' : totalWeight >= 6 ? 'bg-emerald-500' : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, (totalWeight / MAX_CAPACITY) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {essentialPackedCount} Hayati Eşya
            </span>
            {unnecessaryPackedCount > 0 && (
              <span className="flex items-center gap-1 text-red-400 font-semibold">
                <AlertCircle className="w-4 h-4" />
                {unnecessaryPackedCount} Hatalı / Ağır Eşya
              </span>
            )}
          </div>
        </div>

        {/* Explanation callout */}
        {selectedItemExplanation && (
          <div className="bg-sky-950/40 border border-sky-800/80 p-3 rounded-xl text-xs text-sky-200 leading-relaxed">
            {selectedItemExplanation}
          </div>
        )}

        {/* Item Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BAG_ITEMS.map((item) => {
            const isPacked = packedIds.includes(item.id);
            const IconComponent = ICON_MAP[item.iconName] || Package;

            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isPacked
                    ? item.isEssential
                      ? 'bg-emerald-950/60 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-red-950/60 border-red-500/80 ring-1 ring-red-500/50'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  isPacked 
                    ? item.isEssential ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs sm:text-[13px] text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 shrink-0">
                      {item.weightUnits} Br
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.explanation}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-3">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            {isValidBag 
              ? '✅ Çanta dengeli ve hazır! Hayati malzemeler seçildi.' 
              : '⚠️ En az 5 hayati malzeme seçilmeli ve gereksiz ağır eşyalar çıkarılmalıdır.'}
          </p>

          <button
            onClick={() => {
              if (isValidBag) {
                soundEngine.playSuccess();
                onConfirmBag(packedIds);
              } else {
                soundEngine.playWarning();
              }
            }}
            disabled={!isValidBag}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
              isValidBag
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            Afet Çantasını Onayla (+20 Puan)
          </button>
        </div>

      </div>
    </div>
  );
};
