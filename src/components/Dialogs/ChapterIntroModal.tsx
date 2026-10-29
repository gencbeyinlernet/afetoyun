import React from 'react';
import { Chapter } from '../../types/game';
import { soundEngine } from '../../game/audio';
import { ShieldAlert, BookOpen, ArrowRight, UserCheck } from 'lucide-react';

interface ChapterIntroModalProps {
  chapter: Chapter;
  onClose: () => void;
}

export const ChapterIntroModal: React.FC<ChapterIntroModalProps> = ({
  chapter,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              {chapter.simulatedTime}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              {chapter.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {chapter.subtitle}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Character Dialogue Box */}
        <div className="bg-slate-800/80 border border-slate-700/90 rounded-xl p-3.5 sm:p-4 flex gap-3.5 items-start">
          <div className="w-11 h-11 rounded-full bg-slate-700 border-2 border-sky-500/80 flex items-center justify-center text-sky-300 font-bold shrink-0 shadow-inner">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-white">{chapter.introDialogue.speaker}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                {chapter.introDialogue.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{chapter.introDialogue.message}"
            </p>
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Bu Bölümde Öğreneceğin Temel İlkeler
          </h4>
          <ul className="space-y-1.5">
            {chapter.learnedPrinciples.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-300">
                <span className="text-sky-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Göreve Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
