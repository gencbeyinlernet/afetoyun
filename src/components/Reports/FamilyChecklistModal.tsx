import React from 'react';
import { 
  X, 
  Printer, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  FileCheck, 
  Home, 
  Download 
} from 'lucide-react';
import { FamilyChecklistItem } from '../../types/game';
import { soundEngine } from '../../game/audio';

interface FamilyChecklistModalProps {
  checklist: FamilyChecklistItem[];
  onToggleItem: (id: string) => void;
  onClose: () => void;
}

export const FamilyChecklistModal: React.FC<FamilyChecklistModalProps> = ({
  checklist,
  onToggleItem,
  onClose,
}) => {
  const completedCount = checklist.filter(i => i.completed).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none print:m-0">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 print:border-black">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700 print:bg-gray-100 print:text-black">
                Gerçek Hayata Aktarım Çıktısı
              </span>
              <span className="text-xs text-slate-400 print:text-gray-600">
                AFET 72 Eğitim Modülü
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 print:text-black">
              Kişisel & Aile Afet Hazırlık Kontrol Listesi
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600">
              Bu listeyi ailenizle birlikte tamamlayın, çıktısını alıp buzdolabınıza veya kapınızın arkasına asın!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Tracker */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between text-xs print:bg-gray-50 print:border-gray-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 print:text-green-700" />
            <div>
              <span className="font-bold text-white print:text-black">Hazırlık Durumu: </span>
              <span className="text-slate-300 print:text-gray-700">{completedCount} / {checklist.length} Madde Tamamlandı</span>
            </div>
          </div>
          <span className="font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/60 print:bg-green-100 print:text-green-800">
            %{Math.round((completedCount / checklist.length) * 100)} Tamamlandı
          </span>
        </div>

        {/* Checklist items */}
        <div className="space-y-2.5 my-1">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundEngine.playClick();
                onToggleItem(item.id);
              }}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer print:border-gray-300 ${
                item.completed
                  ? 'bg-emerald-950/30 border-emerald-600/70 text-emerald-100 print:bg-white print:text-black'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 print:bg-white print:text-black'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 print:text-green-700" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 print:text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300 mr-2 print:bg-gray-200 print:text-black">
                  {item.category}
                </span>
                <span className={`text-xs sm:text-sm leading-relaxed ${
                  item.completed ? 'font-medium' : ''
                }`}>
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Print & Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-3 print:hidden">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            * Gerçek kişisel verileriniz hiçbir sunucuya gönderilmez; tamamen cihazınızda yerel kalır.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Yazdır / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Listeyi Kaydet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
