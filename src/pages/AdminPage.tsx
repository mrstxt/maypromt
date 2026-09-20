import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  KeyRound,
  Sliders,
  DollarSign,
  BookOpen,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AdminPanel } from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    // Check if superadmin is logged in or if session is already unlocked
    if (user?.email?.toLowerCase() === 'baytirp.uz@gmail.com') return true;
    return sessionStorage.getItem('mayprompt_admin_session_auth') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Re-check when user auth state changes
  useEffect(() => {
    if (user?.email?.toLowerCase() === 'baytirp.uz@gmail.com') {
      setIsUnlocked(true);
    }
  }, [user]);

  const adminUrl = typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://mayprompt.vercel.app/admin';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(adminUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim();
    // Authorized codes: baytirp2026, admin2026, or master pass
    if (cleanCode === 'baytirp2026' || cleanCode === 'admin2026' || cleanCode === 'baytirp.uz') {
      setIsUnlocked(true);
      sessionStorage.setItem('mayprompt_admin_session_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg("Parol noto'g'ri. Iltimos, administrator parolini qayta tekshiring.");
    }
  };

  const handleBackToPlatform = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Standalone Admin Top Navigation Bar */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                MayPrompt Master Admin Panel
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Alohida Link
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Vercel mustaqil boshqaruv markazi (Platformadan ajratilgan)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all border border-zinc-700"
            title="Maxfiy admin havolasini nusxalash"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span className="hidden sm:inline">{copied ? "Nusxalandi!" : "Admin Linkini Olish"}</span>
          </button>

          <button
            onClick={handleBackToPlatform}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 text-xs font-semibold transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Platformaga Qaytish</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* URL Banner & Isolation Info */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-zinc-200">
                Alohida Maxfiy Vercel Linki:
              </p>
            </div>
            <p className="text-xs font-mono text-amber-300/90 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 select-all">
              {adminUrl}
            </p>
            <p className="text-[11px] text-zinc-400">
              Bu havola asosiy foydalanuvchi platformasida hech qayerda ko'rinmaydi va to'liq yopiq.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Nusxa Olindi" : "Linkni Nusxalash"}</span>
            </button>
          </div>
        </div>

        {/* Security Gate if not unlocked */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-white">Administrator Kirish</h2>
              <p className="text-xs text-zinc-400">
                Vercel alohida admin paneliga kirish uchun xavfsizlik parolini kiriting yoki <span className="text-amber-400 font-mono">baytirp.uz@gmail.com</span> hisobi bilan kiring.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Maxfiy PIN / Parol
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Admin parolini kiriting..."
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-2xs"
              >
                Panelni Ochish
              </button>
            </form>

            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              Eslatma: <code className="text-zinc-400">baytirp2026</code> yoki superadmin Google hisobi.
            </div>
          </div>
        ) : (
          /* Unlocked Admin Panel Dashboard in Light Container */
          <div className="bg-white text-zinc-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-zinc-800 overflow-hidden">
            <AdminPanel />
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="py-4 border-t border-zinc-900 bg-zinc-950 text-center text-[11px] text-zinc-600">
        MayPrompt Isolated Administration Center &bull; Production Ready for Vercel
      </footer>
    </div>
  );
};
