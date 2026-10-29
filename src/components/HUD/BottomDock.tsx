import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Layers, 
  ArrowRight, 
  Package, 
  HelpCircle, 
  Compass, 
  ShieldAlert, 
  Radio 
} from 'lucide-react';
import { ChapterTask } from '../../types/game';
import { soundEngine } from '../../game/audio';

interface BottomDockProps {
  tasks: ChapterTask[];
  allTasksCompleted: boolean;
  activeLayers: {
    floodRisk: boolean;
    landslideRisk: boolean;
    closedRoads: boolean;
    safeRoutes: boolean;
  };
  onToggleLayer: (layerKey: 'floodRisk' | 'landslideRisk' | 'closedRoads' | 'safeRoutes') => void;
  onOpenTaskAction: (task: ChapterTask) => void;
  onCompleteChapter: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  tasks,
  allTasksCompleted,
  activeLayers = { floodRisk: true, landslideRisk: true, closedRoads: true, safeRoutes: false },
  onToggleLayer,
  onOpenTaskAction,
  onCompleteChapter,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const safeLayers = activeLayers || { floodRisk: true, landslideRisk: true, closedRoads: true, safeRoutes: false };
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-[940px] pointer-events-none transition-all duration-300">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="pointer-events-auto bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-4 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-none transition-transform"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Görev Panelini Göster</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Görünümü Genişlet (Zen Modu)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Dock Container */}
      {!isCollapsed && (
        <div className="pointer-events-auto bg-slate-900/95 text-slate-100 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Section 1: Active Objectives */}
          <div className="flex-1 min-w-0 pr-0 md:pr-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                Aktif Bölüm Görevleri
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                {completedCount} / {tasks.length} Tamamlandı
              </span>
            </div>

            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between gap-2 p-1.5 rounded-lg border text-xs transition-colors ${
                    task.completed
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate font-medium">{task.title}</span>
                    {task.targetCount && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        ({task.currentCount || 0}/{task.targetCount})
                      </span>
                    )}
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onOpenTaskAction(task);
                      }}
                      className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] shrink-0 cursor-pointer shadow-sm transition-colors"
                    >
                      {task.actionType === 'decision' && 'Karar Ver'}
                      {task.actionType === 'pack_bag' && 'Çantayı Aç'}
                      {task.actionType === 'verify_messages' && 'Mesajları İncele'}
                      {task.actionType === 'evaluate_route' && 'Rotayı Değerlendir'}
                      {task.actionType === 'inspect_objects' && 'Haritada Bul'}
                      {task.actionType === 'general' && 'İncele'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-800" />

          {/* Section 2: Risk Overlays & Filters */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              Harita Risk Katmanları
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onToggleLayer('floodRisk')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  safeLayers.floodRisk
                    ? 'bg-red-950/80 border-red-500 text-red-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 opacity-60'
                }`}
              >
                🌊 Sel Koridoru
              </button>
              <button
                onClick={() => onToggleLayer('landslideRisk')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  safeLayers.landslideRisk
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 opacity-60'
                }`}
              >
                ⚠️ Heyelan Yamacı
              </button>
              <button
                onClick={() => onToggleLayer('closedRoads')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  safeLayers.closedRoads
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 opacity-60'
                }`}
              >
                🛑 Kapalı Köprü/Yol
              </button>
              <button
                onClick={() => onToggleLayer('safeRoutes')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  safeLayers.safeRoutes
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 opacity-60'
                }`}
              >
                🟢 Güvenli Güzergâh
              </button>
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-800" />

          {/* Section 3: Next Chapter / Complete Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                if (allTasksCompleted) {
                  onCompleteChapter();
                }
              }}
              disabled={!allTasksCompleted}
              className={`w-full md:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                allTasksCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer ring-2 ring-emerald-400/50'
                  : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{allTasksCompleted ? 'Bölümü Tamamla' : 'Görevleri Bitir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
