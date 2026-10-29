import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Share2, 
  Clock, 
  MessageSquareWarning 
} from 'lucide-react';
import { SocialMessage } from '../../types/game';
import { soundEngine } from '../../game/audio';

interface MisinformationModalProps {
  onComplete: (scoreGained: number) => void;
  onClose: () => void;
}

const MESSAGES_SAMPLE: SocialMessage[] = [
  {
    id: 'msg_1',
    sender: 'Meteoroloji Genel Müdürlüğü & AFAD',
    platform: 'Resmî Açıklama',
    timestamp: 'Bugün 14:15',
    text: 'METEOUYARI: Doğu Karadeniz ve Rize havzasında beklenen şiddetli sağanak yağışlar nedeniyle TURUNCU UYARI verilmiştir. Dere yatakları ve dik yamaçlardan uzak durulmalı, resmî yönlendirmeler takip edilmelidir.',
    realType: 'verified_official',
    feedback: 'Doğru! Kurum adı, uyarı rengi, somut saat ve yetkili yönlendirme içeren resmî teyitli açıklamadır.',
  },
  {
    id: 'msg_2',
    sender: 'İsimsiz Komşu (WhatsApp İleri İletildi)',
    platform: 'WhatsApp Ses Kaydı',
    timestamp: 'Bugün 14:40',
    text: '"Arkadaşlar dağdaki baraj kapakları patlamış, su 10 dakikaya mahalleyi basacakmış, hemen arabalara atlayıp kaçın!"',
    realType: 'misleading',
    feedback: 'Doğru Tespit! Kaynağı meçhul, paniğe sevk eden, trafik kilitlenmesine yol açabilecek dezenformasyon örneğidir. Kesinlikle yayılmamalıdır.',
  },
  {
    id: 'msg_3',
    sender: 'Sosyal Medya Kullanıcısı',
    platform: 'Eski Haber Ekranı',
    timestamp: '3 Yıl Önceki Tarih Kırpılmış',
    text: '"Yamaçdere köprüsü tamamen çöktü haberiniz olsun!" (Görselde 2021 yılına ait başka bir ilçenin sel fotoğrafı yer alıyor).',
    realType: 'needs_verification',
    feedback: 'Harika Analiz! Tarihi kırpılmış eski felaket görselleri bağlamından koparılarak kriz anında korku ve güvensizlik yaratır. Tarih kontrolü yapılmalıdır.',
  },
];

export const MisinformationModal: React.FC<MisinformationModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [answers, setAnswers] = useState<Record<string, 'verified_official' | 'needs_verification' | 'misleading'>>({});

  const handleSelect = (msgId: string, type: 'verified_official' | 'needs_verification' | 'misleading') => {
    soundEngine.playClick();
    setAnswers(prev => ({ ...prev, [msgId]: type }));
  };

  const isAllAnswered = MESSAGES_SAMPLE.every(m => answers[m.id]);

  const handleSubmit = () => {
    let correctCount = 0;
    MESSAGES_SAMPLE.forEach(m => {
      if (answers[m.id] === m.realType) correctCount++;
    });

    if (correctCount >= 2) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playWarning();
    }

    onComplete(correctCount * 5); // up to 15 points
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Görev 3.2 & 7.1 — Bilgi Doğrulama Atölyesi
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Afet İletişimi: Resmî Bilgi vs. Sosyal Medya Dedikodusu
            </h3>
            <p className="text-xs text-slate-400">
              Aşağıdaki 3 iletiyi dikkatle incele ve doğru güvenlik kategorisiyle eşleştir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Cards */}
        <div className="space-y-3">
          {MESSAGES_SAMPLE.map((msg) => {
            const currentChoice = answers[msg.id];
            return (
              <div 
                key={msg.id}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-sky-300 flex items-center gap-1">
                    <MessageSquareWarning className="w-3.5 h-3.5" />
                    {msg.sender}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 italic">
                  "{msg.text}"
                </p>

                {/* Selection Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handleSelect(msg.id, 'verified_official')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      currentChoice === 'verified_official'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ✅ Resmî & Doğrulanmış
                  </button>

                  <button
                    onClick={() => handleSelect(msg.id, 'needs_verification')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      currentChoice === 'needs_verification'
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ⚠️ Teyit Gerekli / Eski
                  </button>

                  <button
                    onClick={() => handleSelect(msg.id, 'misleading')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      currentChoice === 'misleading'
                        ? 'bg-red-950 border-red-500 text-red-300'
                        : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    🚫 Asılsız / Dedikodu
                  </button>
                </div>

                {/* Feedback shown if choice made */}
                {currentChoice && (
                  <p className="text-[11px] text-slate-300 bg-slate-900/40 p-2 rounded border border-slate-700/50">
                    {msg.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
              isAllAnswered
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            Sınıflandırmayı Onayla (+15 Puan)
          </button>
        </div>

      </div>
    </div>
  );
};
