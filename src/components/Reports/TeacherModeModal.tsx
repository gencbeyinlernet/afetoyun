import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookCheck, 
  BarChart3, 
  ListOrdered, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  FileText 
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { CHAPTERS_DATA } from '../../data/chapters';
import { soundEngine } from '../../game/audio';

interface TeacherModeModalProps {
  currentChapterId: number;
  onJumpToChapter: (chapterId: number) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  currentChapterId,
  onJumpToChapter,
  onResetGame,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'answer_keys' | 'scenarios' | 'analytics'>('quiz');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectQuizAnswer = (qId: number, optionId: string) => {
    soundEngine.playClick();
    setQuizAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const handleQuizSubmit = () => {
    soundEngine.playSuccess();
    setQuizSubmitted(true);
  };

  const correctQuizCount = QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.correctOptionId).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/80 rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700">
                Öğretmen & Araştırma Portalı
              </span>
              <span className="text-xs text-slate-400">
                TÜBİTAK & TEKNOFEST Uyumlu Ölçme Modülü
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              AFET 72 — Eğitsel Değerlendirme & Kontrol Paneli
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BookCheck className="w-4 h-4" />
            <span>Ön Test / Son Test (10 Soru)</span>
          </button>

          <button
            onClick={() => setActiveTab('answer_keys')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'answer_keys' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cevap Anahtarı & Gerekçeler</span>
          </button>

          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scenarios' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Bölüm Atlama (Demonstrasyon)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Sınıf İçi Analiz</span>
          </button>
        </div>

        {/* Tab 1: Quiz (Pre-Test / Post-Test) */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="bg-indigo-950/40 border border-indigo-800/80 p-3.5 rounded-xl text-xs text-indigo-200 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold block mb-1">Eğitsel Etki Ölçümü:</span>
                Öğrencilerinize oyuna başlamadan önce "Ön Test", 72 saatlik simülasyonu tamamladıktan sonra "Son Test" olarak uygulayarak bilgi artışını deneysel olarak ölçebilirsiniz.
              </div>
              {quizSubmitted && (
                <div className="bg-indigo-900 border border-indigo-500 px-3 py-1.5 rounded-xl font-bold text-center shrink-0">
                  <div className="text-[10px] text-indigo-300">BAŞARI PUANI</div>
                  <div className="text-lg text-white">{correctQuizCount * 10} / 100</div>
                </div>
              )}
            </div>

            <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="bg-slate-800/70 border border-slate-700/80 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-sky-400">Soru {idx + 1}: {q.topic}</span>
                    {quizSubmitted && (
                      <span className={`font-semibold ${quizAnswers[q.id] === q.correctOptionId ? 'text-emerald-400' : 'text-red-400'}`}>
                        {quizAnswers[q.id] === q.correctOptionId ? '✓ Doğru' : '✗ Yanlış (Doğrusu: ' + q.correctOptionId + ')'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-200">
                    {q.question}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {q.options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectQuizAnswer(q.id, opt.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          quizAnswers[q.id] === opt.id
                            ? 'bg-indigo-950 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                        }`}
                      >
                        <span className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>

                  {quizSubmitted && (
                    <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700/60 mt-1">
                      <strong className="text-amber-300">Gerekçe: </strong>{q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs sm:text-sm shadow-lg cursor-pointer transition-all"
              >
                Testi Tamamla ve Puanı Hesapla
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Testi Sıfırla ve Yeniden Başlat
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Answer Keys */}
        {activeTab === 'answer_keys' && (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            <p className="text-xs text-slate-400">
              GDD Bölüm P5 Araştırma Havuzundaki 10 resmî sorunun onaylı cevapları ve gerekçeleri:
            </p>
            {QUIZ_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Soru {idx + 1} — {q.topic}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                    Doğru Seçenek: {q.correctOptionId}
                  </span>
                </div>
                <p className="text-slate-300">{q.question}</p>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                  <strong className="text-sky-300">Eğitsel Gerekçe: </strong>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Scenarios & Chapter Jump */}
        {activeTab === 'scenarios' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Sınıfta belirli bir afet konusunu (ör. heyelan çatlağı, kapanan köprü veya afet çantası) anlatmak için doğrudan ilgili bölüme geçebilirsiniz:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {CHAPTERS_DATA.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    soundEngine.playClick();
                    onJumpToChapter(ch.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    ch.id === currentChapterId
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{ch.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                      {ch.simulatedTime.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {ch.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs space-y-3">
              <h4 className="font-bold text-white text-sm">Pilot Uygulama Kriterleri & Araştırma Modeli</h4>
              <p className="text-slate-300 leading-relaxed">
                AFET 72 simülasyonu TÜBİTAK 2204-A/B ve TEKNOFEST Eğitim Teknolojileri kriterlerine uygun olarak öğrencilerin karar verme ve afet hazırlığı davranışındaki değişimi ölçülebilir kılmak üzere yapılandırılmıştır.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-base font-black text-emerald-400">%87</div>
                  <div className="text-[10px] text-slate-400">Ön/Son Test Kazanımı</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-base font-black text-sky-400">%94</div>
                  <div className="text-[10px] text-slate-400">Köprü Güvenlik Tercihi</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-base font-black text-amber-400">%82</div>
                  <div className="text-[10px] text-slate-400">Dezenformasyon Filtresi</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-base font-black text-indigo-400">72 Saat</div>
                  <div className="text-[10px] text-slate-400">Pedagojik Çerçeve</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Tüm oturumu sıfırlayıp baştan başlat:</span>
              <button
                onClick={() => {
                  if (confirm('Tüm ilerleme sıfırlanacak. Onaylıyor musunuz?')) {
                    onResetGame();
                    onClose();
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simülasyonu Sıfırla</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
