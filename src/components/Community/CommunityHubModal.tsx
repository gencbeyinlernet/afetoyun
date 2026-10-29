import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trophy, 
  MessageSquare, 
  Lock, 
  Bot, 
  Database, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Send, 
  UserCheck, 
  LogOut, 
  ShieldAlert, 
  Clock, 
  Award 
} from 'lucide-react';
import { 
  AppUser, 
  ScoreRecord, 
  ChatMessage, 
  leaderboardService, 
  chatService, 
  SUPABASE_SQL_SETUP 
} from '../../services/supabase';
import { soundEngine } from '../../game/audio';

interface CommunityHubModalProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export const CommunityHubModal: React.FC<CommunityHubModalProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'public_chat' | 'private_chat' | 'ai_advisor' | 'sql_setup'>('leaderboard');
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateTarget, setPrivateTarget] = useState<string>('admin');
  const [copiedSql, setCopiedSql] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit Score state for Admin
  const [editingScore, setEditingScore] = useState<ScoreRecord | null>(null);
  const [editScoreVal, setEditScoreVal] = useState<number>(0);
  const [editBadgesVal, setEditBadgesVal] = useState<number>(0);

  // AI Chat state
  const [aiChatLog, setAiChatLog] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Merhaba! Ben Yamaçdere Yapay Zekâ Afet Danışmanınız Derya. Sel, heyelan, afet çantası veya güvenli tahliye hakkında bana her türlü soruyu sorabilirsiniz.',
      time: 'Şimdi',
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Load Leaderboard scores
  const loadScores = async () => {
    setLoading(true);
    const data = await leaderboardService.getScores();
    setScores(data);
    setLoading(false);
  };

  // Load Messages
  const loadMessages = async () => {
    if (activeTab === 'public_chat') {
      const data = await chatService.getMessages(null);
      setMessages(data);
    } else if (activeTab === 'private_chat') {
      const target = currentUser?.role === 'admin' ? privateTarget : currentUser?.username;
      if (target) {
        const data = await chatService.getMessages(target);
        setMessages(data);
      }
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [activeTab, privateTarget]);

  // Handle Public or Private Message Send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    soundEngine.playClick();
    const receiver = activeTab === 'private_chat' ? (currentUser.role === 'admin' ? privateTarget : 'admin') : null;
    await chatService.sendMessage(currentUser.username, newMessage.trim(), receiver);
    setNewMessage('');
    loadMessages();
  };

  // Admin delete score
  const handleDeleteScore = async (username: string) => {
    if (!confirm(`"${username}" kullanıcısının skor kaydını silmek istediğinize emin misiniz?`)) return;
    soundEngine.playWarning();
    await leaderboardService.adminDeleteScore(username);
    loadScores();
  };

  // Admin update score
  const handleSaveEditedScore = async () => {
    if (!editingScore) return;
    soundEngine.playSuccess();
    await leaderboardService.adminUpdateScore(editingScore.username, editScoreVal, editBadgesVal);
    setEditingScore(null);
    loadScores();
  };

  // AI Advisor question submit
  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const q = aiInput.trim();
    setAiInput('');
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAiChatLog(prev => [...prev, { sender: 'user', text: q, time: nowStr }]);
    setAiLoading(true);

    // Knowledge-grounded AI Disaster Advisor Response
    setTimeout(() => {
      let response = '';
      const lower = q.toLowerCase();
      if (lower.includes('sel') || lower.includes('su') || lower.includes('köprü')) {
        response = 'Sel ve taşkın anında AFAD rehberlerine göre 15 cm akıntılı su bir insanı devirebilir, 30 cm su ise araçları sürükler. Kapalı köprülere asla girmeyin ve yüksek doğrulanmış güzergâhları tercih edin.';
      } else if (lower.includes('heyelan') || lower.includes('çatlak') || lower.includes('yamaç')) {
        response = 'Yamaçlardaki yeni zemin çatlakları ve eğilen telefon direkleri heyelanın en kesin habercisidir. Çatlağın kenarına yaklaşmayın, derhal güvenli mesafeye çekilerek 112 / AFAD\'a bildirin.';
      } else if (lower.includes('çanta') || lower.includes('malzeme') || lower.includes('radyo')) {
        response = 'Afet çantası ilk 72 saat hayatta kalmayı sağlamalıdır. En az 3 litre su, konserve gıdalar, pilli radyo, el feneri, düdük, temel ilk yardım kiti ve kronik ilaç yedekleri zorunludur.';
      } else if (lower.includes('toplanma') || lower.includes('nereye')) {
        response = 'Acil toplanma alanları hem taşkın kotunun hem de heyelan etki alanının dışında, helikopter inişine ve ambulans erişimine uygun düzlük alanlardır. Yamaçdere\'de Doğu Spor Sahası ve Batı Yüksek Platosu doğrulanmıştır.';
      } else {
        response = 'TÜBİTAK ve TARAP prensiplerine göre afet yönetiminde en kritik unsur hazırlık ve resmî teyittir. Kaynağı belirsiz sosyal medya dedikodularını yaymayınız, MGM MeteoUYARI ve Valilik açıklamalarını takip ediniz.';
      }

      setAiChatLog(prev => [...prev, { sender: 'ai', text: response, time: nowStr }]);
      setAiLoading(false);
      soundEngine.playSuccess();
    }, 700);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    soundEngine.playSuccess();
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} dk ${s} sn`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[94vh] overflow-hidden">
        
        {/* Header with User Info */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
                Topluluk, Skorlar & Yönetim Portalı
              </span>
              {currentUser?.role === 'admin' && (
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-600">
                  👑 SİSTEM YÖNETİCİSİ (ADMIN)
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              AFET 72 — Mahalle Dayanışma & Karar Merkezi
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-300">👤 {currentUser.username}</span>
                <button
                  onClick={onLogout}
                  title="Çıkış Yap"
                  className="p-1 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Giriş Yap / Kayıt Ol
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Liderlik & Puan Tablosu</span>
          </button>

          <button
            onClick={() => setActiveTab('public_chat')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'public_chat' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ortak Mahalle Sohbeti</span>
          </button>

          <button
            onClick={() => setActiveTab('private_chat')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'private_chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Yönetici ile Özel Sohbet</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_advisor')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_advisor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Yapay Zekâ Afet Danışmanı</span>
          </button>

          <button
            onClick={() => setActiveTab('sql_setup')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql_setup' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase SQL Kurulumu</span>
          </button>
        </div>

        {/* TAB 1: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Mahalledeki tüm oyuncuların puanları, tamamladıkları bölümler ve oyun süreleri:</span>
              {currentUser?.role === 'admin' && (
                <span className="text-amber-400 font-bold">
                  👑 Yönetici yetkisi aktif: Puanları düzeltebilir veya silebilirsiniz.
                </span>
              )}
            </div>

            {/* Score Table */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Sıra</th>
                    <th className="py-2.5 px-3">Kullanıcı</th>
                    <th className="py-2.5 px-3 text-right">Puan</th>
                    <th className="py-2.5 px-3 text-center">Bölüm</th>
                    <th className="py-2.5 px-3 text-center">Süre</th>
                    <th className="py-2.5 px-3 text-center">Rozet</th>
                    {currentUser?.role === 'admin' && <th className="py-2.5 px-3 text-right">Yönetim</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {scores.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500">
                        Henüz skor kaydedilmemiş. Simülasyonu oynadıkça puanlar burada listelenir.
                      </td>
                    </tr>
                  ) : (
                    scores.map((sc, idx) => (
                      <tr key={sc.id || idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                          <span>{sc.username}</span>
                          {sc.username === 'admin' && (
                            <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-700">
                              Yönetici
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-amber-400 text-sm">
                          {sc.score}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-300">
                          Bölüm {sc.chapter_reached}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {formatDuration(sc.play_duration_seconds)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-400 font-semibold">
                          {sc.badges_count} 🎖️
                        </td>
                        {currentUser?.role === 'admin' && (
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingScore(sc);
                                  setEditScoreVal(sc.score);
                                  setEditBadgesVal(sc.badges_count);
                                }}
                                title="Puanı Düzenle"
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteScore(sc.username)}
                                title="Skoru Sil"
                                className="p-1 rounded bg-slate-800 hover:bg-red-950 text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Admin Edit Modal inline dialog */}
            {editingScore && (
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-white">
                  "{editingScore.username}" Puanını Düzenle:
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-slate-400">Puan:</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editScoreVal}
                    onChange={(e) => setEditScoreVal(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white font-bold"
                  />
                  <label className="text-slate-400">Rozet:</label>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={editBadgesVal}
                    onChange={(e) => setEditBadgesVal(Number(e.target.value))}
                    className="w-14 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white font-bold"
                  />
                  <button
                    onClick={handleSaveEditedScore}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingScore(null)}
                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 & 3: CHAT (PUBLIC & PRIVATE) */}
        {(activeTab === 'public_chat' || activeTab === 'private_chat') && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {activeTab === 'private_chat' && currentUser?.role === 'admin' && (
              <div className="flex items-center gap-2 text-xs bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 font-semibold">Özel Mesajlaşılacak Kullanıcı:</span>
                <select
                  value={privateTarget}
                  onChange={(e) => setPrivateTarget(e.target.value)}
                  className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-1 text-xs"
                >
                  <option value="ahmet_rize53">ahmet_rize53</option>
                  <option value="mert_gonullu">mert_gonullu</option>
                  <option value="elif_ogretmen">elif_ogretmen</option>
                  {scores.filter(s => s.username !== 'admin').map(s => (
                    <option key={s.username} value={s.username}>{s.username}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Message History list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  {activeTab === 'public_chat' 
                    ? 'Ortak sohbette henüz mesaj yok. İlk mesajı siz yazın!'
                    : 'Yönetici ile özel sohbet henüz başlamadı. Sorunuzu yazıp gönderebilirsiniz.'}
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = currentUser?.username === m.sender_username;
                  const isAdmin = m.sender_username === 'admin';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400">
                        <span className={`font-bold ${isAdmin ? 'text-amber-400' : 'text-sky-400'}`}>
                          {isAdmin ? '👑 Yönetici (admin)' : m.sender_username}
                        </span>
                        <span>•</span>
                        <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`p-2.5 rounded-2xl max-w-md text-xs sm:text-[13px] leading-relaxed ${
                        isMe
                          ? 'bg-sky-600 text-white rounded-tr-none'
                          : isAdmin
                          ? 'bg-amber-950/80 border border-amber-700/80 text-amber-100 rounded-tl-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Send Input Bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  !currentUser 
                    ? 'Mesaj göndermek için giriş yapmalısınız...'
                    : activeTab === 'public_chat'
                    ? 'Tüm mahalleye açık mesaj yazın...'
                    : 'Yöneticiye özel mesaj yazın...'
                }
                disabled={!currentUser}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!currentUser || !newMessage.trim()}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gönder</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: AI DISASTER ADVISOR */}
        {activeTab === 'ai_advisor' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div className="bg-emerald-950/40 border border-emerald-800/80 p-3 rounded-xl text-xs text-emerald-200">
              <strong className="block mb-0.5">🤖 Derya AI — Afet ve Risk Danışmanı</strong>
              AFAD, TARAP ve Meteoroloji Genel Müdürlüğü standartlarıyla eğitilmiş yapay zekâ danışmanınıza sel ve heyelan riskleri, toplanma alanları ve kriz kararları hakkında soru sorun.
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              {aiChatLog.map((log, i) => (
                <div key={i} className={`flex flex-col ${log.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-0.5">
                    {log.sender === 'user' ? 'Sen' : 'Derya (Afet Danışmanı)'} • {log.time}
                  </span>
                  <div className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed ${
                    log.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-emerald-950/60 border border-emerald-700/60 text-emerald-100 rounded-tl-none'
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="text-xs text-slate-400 italic">Derya düşünüyor...</div>
              )}
            </div>

            <form onSubmit={handleAiAsk} className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Örn: Heyelan çatlağı gördüğümde ne yapmalıyım? / Kapalı köprüden neden geçilmez?"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>Danış</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: SUPABASE SQL SETUP SCRIPT */}
        {activeTab === 'sql_setup' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">
            <div className="bg-purple-950/40 border border-purple-800/80 p-3.5 rounded-xl text-xs text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <strong className="block text-white mb-0.5">Supabase Veritabanı Kurulum Talimatı:</strong>
                Aşağıdaki SQL betiğini kopyalayıp <strong>Supabase Dashboard -&gt; SQL Editor</strong> alanına yapıştırıp <strong>Run</strong> butonuna basmanız yeterlidir. Tüm tablolar (kullanıcılar, skorlar, mesajlar) ve izinler otomatik kurulur.
              </div>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Kopyalandı!' : 'SQL Kodunu Kopyala'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
