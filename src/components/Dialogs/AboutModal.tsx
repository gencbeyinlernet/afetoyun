import React from 'react';
import { X, ExternalLink, ShieldAlert, Award, BookOpen, Heart } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Proje ve Eğitsel Temeller
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              AFET 72 — Mahalleni Kurtar!
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vision & Pedagogy */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
          <p>
            Türkiye'de özellikle Doğu Karadeniz (Rize, Trabzon, Artvin) havzasında yaşanan sel ve heyelan afetlerinde en büyük can ve mal kayıpları; yetersiz hazırlık, risklerin zamanında fark edilmemesi, taşkın altındaki köprülerden geçmeye çalışma ve sosyal medyadaki bilgi kirliliğinden kaynaklanmaktadır.
          </p>
          <p>
            AFET 72, ortaokul ve lise öğrencilerinin güvenli bir simülasyon ortamında riskleri tespit etmesini, doğru kararlar almasını ve en önemlisi bu bilinci gerçek hayatta ailesiyle tamamlayacağı somut bir afet hazırlık kontrol listesine dönüştürmesini amaçlar.
          </p>
        </div>

        {/* Official References */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Resmî Kaynaklar ve Mevzuat Uyumu
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <strong className="text-white block">AFAD Heyelan Hazırlık Rehberi</strong>
                <span className="text-[11px] text-slate-400">Zemin çatlakları ve heyelan öncesi belirtiler</span>
              </div>
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <strong className="text-white block">AFAD Şiddetli Yağış ve Selden Korunma Kılavuzu</strong>
                <span className="text-[11px] text-slate-400">Sel sularından kaçınma, 15cm yaya ve 30cm araç eşiği</span>
              </div>
              <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <strong className="text-white block">MGM MeteoUYARI Renk Kodları</strong>
                <span className="text-[11px] text-slate-400">Yeşil, Sarı, Turuncu ve Kırmızı meteorolojik uyarılar</span>
              </div>
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <strong className="text-white block">Türkiye Afet Risk Azaltma Planı (TARAP)</strong>
                <span className="text-[11px] text-slate-400">Afet öncesi risk yönetimi ve toplum dayanıklılığı ilkeleri</span>
              </div>
              <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Target Audience & Academic value */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
          <strong className="text-white block mb-0.5">TÜBİTAK & TEKNOFEST Uygunluğu:</strong>
          Öğrencilerin ön test ve son test başarıları ölçülebilir; afet çantası kontrol listesi ile davranışa dönüşüm takip edilebilir.
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            Tamam
          </button>
        </div>

      </div>
    </div>
  );
};
