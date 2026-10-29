import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { soundEngine } from '../../game/audio';

interface FeedbackModalProps {
  isOpen: boolean;
  title: string;
  isSafe: boolean;
  feedbackText: string;
  sourceRef?: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  title,
  isSafe,
  feedbackText,
  sourceRef,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className={`border rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 ${
        isSafe ? 'bg-slate-900 border-emerald-500/80' : 'bg-slate-900 border-amber-500/80'
      }`}>
        
        {/* Header with Icon */}
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isSafe ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {isSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isSafe ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isSafe ? 'GÜVENLİ VE DOĞRU KARAR' : 'RİSKLİ VE TEHLİKELİ DAVRANIŞ'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {/* Feedback Rationale */}
        <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
          isSafe 
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' 
            : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
        }`}>
          <p className="font-semibold mb-1 text-white">Değerlendirme Sonucu:</p>
          <p>{feedbackText}</p>
        </div>

        {/* Reference & Source */}
        {sourceRef && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <Shield className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Resmî Referans: <strong className="text-slate-300">{sourceRef}</strong></span>
          </div>
        )}

        {/* Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isSafe
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <span>Anladım, Devam Et</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
