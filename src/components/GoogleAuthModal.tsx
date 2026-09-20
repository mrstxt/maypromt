import React, { useState } from 'react';
import { X, CheckCircle2, Shield, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (email: string) => {
    loginWithGoogle(email);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      alert("Iltimos, to'g'ri Google elektron pochta manzilini (Gmail) kiriting.");
      return;
    }
    loginWithGoogle(customEmail.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Branding Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto shadow-2xs">
            {/* Colorful Google G SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
            Google orqali ro'yxatdan o'tish
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Videolarni tahlil qilish va kinematik promtlar olish uchun Google profilingiz bilan kiring.
          </p>
        </div>

        {/* Current logged in status if already signed in */}
        {user ? (
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-zinc-300 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-900 truncate">{user.name}</div>
                <div className="text-xs text-zinc-500 truncate">{user.email}</div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-200 text-zinc-800">
                Faol
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs text-zinc-600">
              <span>Tarifingiz:</span>
              <span className="font-semibold text-zinc-900 capitalize">
                {user.plan} tarifi
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                Davom etish
              </button>
              <button
                onClick={() => {
                  logout();
                  setIsCustomMode(true);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-medium transition-colors"
              >
                Chiqish
              </button>
            </div>
          </div>
        ) : (
          /* Google Sign-in options */
          <div className="space-y-3">
            {/* Primary Google One-Click Button */}
            <button
              onClick={() => handleQuickLogin('baytirp.uz@gmail.com')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 transition-all text-left shadow-2xs group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  B
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-900 truncate">
                    baytirp.uz@gmail.com
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Google hisobi orqali davom etish
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 group-hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition-colors shrink-0">
                Kirish &rarr;
              </span>
            </button>

            {!isCustomMode ? (
              <button
                onClick={() => setIsCustomMode(true)}
                className="w-full py-2.5 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors font-medium border border-dashed border-zinc-300"
              >
                Boshqa Google pochta bilan kirish...
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-2.5 pt-1">
                <label className="text-xs font-semibold text-zinc-700 block">
                  Google Pochta (Gmail):
                </label>
                <input
                  type="email"
                  required
                  placeholder="nomingiz@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full text-xs bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-mono"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                  >
                    Google Bilan Kirish
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium"
                  >
                    Bekor
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <span>Google xavfsiz autentifikatsiyasi</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
