import React from 'react';
import { DecisionDilemma } from '../../types/game';
import { ShieldCheck, HelpCircle, AlertOctagon, X } from 'lucide-react';

interface DecisionModalProps {
  dilemma: DecisionDilemma;
  taskId: string;
  onMakeDecision: (taskId: string, choiceId: string) => void;
  onClose: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  dilemma,
  taskId,
  onMakeDecision,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
                Kritik Karar Anı
              </span>
              <span className="text-xs text-slate-400">
                Danışman: {dilemma.characterName} ({dilemma.characterRole})
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {dilemma.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Situation / Dilemma Context */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <p className="font-semibold text-sky-300 mb-1">Durum Tespiti:</p>
          <p>{dilemma.context}</p>
        </div>

        {/* Official Guidance Note if available */}
        {dilemma.officialGuidance && (
          <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3 flex gap-2.5 items-start text-xs text-sky-200">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sky-300">Resmî Kılavuz İlkesi: </span>
              {dilemma.officialGuidance}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5 pt-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hangi Güvenli Kararı Almalısın?
          </p>
          {dilemma.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onMakeDecision(taskId, option.id)}
              className="w-full text-left p-3.5 rounded-xl border border-slate-700/90 bg-slate-800/80 hover:bg-slate-750 hover:border-sky-500/80 transition-all flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-700 group-hover:bg-sky-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs shadow-sm transition-colors">
                {option.id}
              </div>
              <div className="text-xs sm:text-sm text-slate-200 group-hover:text-white leading-relaxed">
                {option.text}
              </div>
            </button>
          ))}
        </div>

        {/* Source Reference Footer */}
        <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3 flex items-center justify-between">
          <span>Kaynak: {dilemma.sourceReference}</span>
          <span className="text-slate-400 font-medium">AFET 72 Simülasyonu</span>
        </div>

      </div>
    </div>
  );
};
