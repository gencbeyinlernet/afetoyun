import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  ShieldCheck, 
  FileCheck2, 
  RotateCcw, 
  Star, 
  CheckCircle2, 
  Compass, 
  Search, 
  Radio, 
  HeartHandshake, 
  Accessibility 
} from 'lucide-react';
import { ScoreBreakdown, AchievementBadge } from '../../types/game';

interface FinalReportModalProps {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  achievements: AchievementBadge[];
  onOpenChecklist: () => void;
  onRestart: () => void;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  Search,
  ShieldCheck,
  Compass,
  Radio,
  HeartHandshake,
  Accessibility,
  Award,
};

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  score,
  scoreBreakdown,
  achievements,
  onOpenChecklist,
  onRestart,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  }, []);

  const getTitleDegree = (s: number) => {
    if (s >= 95) return { title: 'Mahalle Hazırlık Elçisi', badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600' };
    if (s >= 85) return { title: 'Güvenli Karar Uzmanı', badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600' };
    if (s >= 70) return { title: 'Hazırlık Bilinci', badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-600' };
    if (s >= 50) return { title: 'Gelişen Farkındalık', badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-600' };
    return { title: 'Hazırlık Geliştirme Seviyesi', badgeColor: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  const degree = getTitleDegree(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-amber-500/80 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl text-slate-100 flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center space-y-1.5 border-b border-slate-800 pb-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500/80 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            72 Saatin Sonunda: Mahalle Başarı Raporu
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Yamaçdere Mahallesinde sel ve heyelan risklerini yönettin, kritik kararları başarıyla aldın!
          </p>
          <div className="pt-2">
            <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-md inline-block ${degree.badgeColor}`}>
              Derece: {degree.title}
            </span>
          </div>
        </div>

        {/* Score & Category Bars */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-300">Toplam Başarı Puanı:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{score}</span>
              <span className="text-xs text-slate-500">/ 100 Puan</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Riskleri Fark Etme</span>
                <span className="font-semibold text-slate-200">{scoreBreakdown.riskDetection} / 20</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(scoreBreakdown.riskDetection / 20) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Afet Öncesi Hazırlık</span>
                <span className="font-semibold text-slate-200">{scoreBreakdown.preparedness} / 25</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(scoreBreakdown.preparedness / 25) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Güvenli Karar Verme</span>
                <span className="font-semibold text-slate-200">{scoreBreakdown.safeDecisionMaking} / 30</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(scoreBreakdown.safeDecisionMaking / 30) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>İletişim ve Koordinasyon</span>
                <span className="font-semibold text-slate-200">{scoreBreakdown.communication} / 15</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(scoreBreakdown.communication / 15) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Kapsayıcı İhtiyaç Planlama</span>
                <span className="font-semibold text-slate-200">{scoreBreakdown.inclusivePlanning} / 10</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(scoreBreakdown.inclusivePlanning / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges Showcase */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Kazanılan Afet Elçisi Rozetleri
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {achievements.map((badge) => {
              const IconComp = BADGE_ICONS[badge.icon] || Star;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    badge.unlocked
                      ? 'bg-slate-800/90 border-amber-500/70 shadow-md'
                      : 'bg-slate-800/40 border-slate-800 opacity-40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    badge.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-500'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-white leading-tight">
                    {badge.title}
                  </span>
                  <span className="text-[9px] text-slate-400 line-clamp-1">
                    {badge.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Transfer CTA */}
        <div className="bg-emerald-950/40 border border-emerald-600/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-bold text-sm text-emerald-300 block">Şimdi Gerçek Hayata Aktar!</span>
            <p className="text-xs text-slate-300">
              Oyun puan kazandırdı; ancak asıl başarı aileni gerçek bir afete hazırlamaktır.
            </p>
          </div>
          <button
            onClick={onOpenChecklist}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Aile Listesini Oluştur</span>
          </button>
        </div>

        {/* Footer Restart */}
        <div className="flex justify-center pt-1">
          <button
            onClick={onRestart}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Simülasyonu Baştan Oyna</span>
          </button>
        </div>

      </div>
    </div>
  );
};
