import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { authService, AppUser } from '../../services/supabase';
import { soundEngine } from '../../game/audio';

interface AuthModalProps {
  onSuccess: (user: AppUser) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    setLoading(true);

    if (isRegistering) {
      const res = await authService.register(username, password);
      setLoading(false);
      if (res.success && res.user) {
        soundEngine.playSuccess();
        setSuccessMsg(res.message);
        setTimeout(() => onSuccess(res.user!), 600);
      } else {
        soundEngine.playWarning();
        setErrorMsg(res.message);
      }
    } else {
      const res = await authService.login(username, password);
      setLoading(false);
      if (res.success && res.user) {
        soundEngine.playSuccess();
        setSuccessMsg(res.message);
        setTimeout(() => onSuccess(res.user!), 600);
      } else {
        soundEngine.playWarning();
        if (res.notRegistered) {
          setErrorMsg(res.message);
          setIsRegistering(true); // Automatically redirect to registration!
        } else {
          setErrorMsg(res.message);
        }
      }
    }
  };

  const fillAdmin = () => {
    setUsername('admin');
    setPassword('12345');
    setIsRegistering(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              AFET 72 Kullanıcı Girişi
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {isRegistering ? 'Yeni Kullanıcı Kaydı' : 'Giriş Yap'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Admin Credential Hint */}
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-200 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-amber-300 block">👑 Yönetici (Admin) Hesabı:</span>
            <span>Kullanıcı: <strong>admin</strong> | Şifre: <strong>12345</strong></span>
          </div>
          <button
            type="button"
            onClick={fillAdmin}
            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] cursor-pointer shrink-0 transition-colors"
          >
            Doldur
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="bg-red-950/50 border border-red-700/80 p-3 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/50 border border-emerald-700/80 p-3 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kullanici_adi"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {loading ? (
              <span>İşleniyor...</span>
            ) : isRegistering ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Kayıt Ol ve Giriş Yap</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap</span>
              </>
            )}
          </button>
        </form>

        {/* Switch Login / Register Toggle */}
        <div className="text-center pt-1 border-t border-slate-800">
          {isRegistering ? (
            <p className="text-xs text-slate-400">
              Zaten bir hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMsg(null);
                }}
                className="text-sky-400 hover:underline font-semibold cursor-pointer"
              >
                Giriş Yap
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Henüz kayıtlı değil misiniz?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMsg(null);
                }}
                className="text-sky-400 hover:underline font-semibold cursor-pointer"
              >
                Hemen Kayıt Olun
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
