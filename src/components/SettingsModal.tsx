import React, { useState } from 'react';
import {
  X,
  Settings,
  Key,
  Flame,
  Clock,
  Check,
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Globe,
  Sliders,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkApiWindowStatus } from '../utils/windowTiming';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlans: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPlans,
}) => {
  const { user, setCustomApiKey, remainingQuota, dailyLimit, isUnlimited } = useAuth();
  const [testOverride, setTestOverride] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(user?.customApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoCopy, setAutoCopy] = useState(true);

  if (!isOpen) return null;

  const windowStatus = checkApiWindowStatus(testOverride);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!windowStatus.isOpen) {
      alert("VIP API kiritish oynasi ayni vaqtda yopiq! Faqat har Dushanba soat 09:00 dan 19:00 gacha ochiladi.");
      return;
    }
    if (!apiKeyInput.trim()) {
      alert("Iltimos, haqiqiy Gemini API kalitini kiriting.");
      return;
    }

    setCustomApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemoveKey = () => {
    if (confirm("Shaxsiy API kalitni o'chirib, oddiy rejaga qaytmoqchimisiz?")) {
      setCustomApiKey('');
      setApiKeyInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 relative my-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900">
              Ilova Sozlamalari &amp; API Boshqaruvi
            </h3>
            <p className="text-xs text-zinc-500">
              Shaxsiy hisob, Gemini API kalit va tizim parametrlari
            </p>
          </div>
        </div>

        {/* Section 1: User Profile & Plan Info */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-zinc-300"
            />
            <div>
              <div className="font-bold text-zinc-900">
                {user?.name || "Foydalanuvchi"}
              </div>
              <div className="text-zinc-500 font-mono text-[11px]">
                {user?.email || "baytirp.uz@gmail.com"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-800 font-bold uppercase tracking-wider text-[10px]">
              {user?.plan || 'free'} Rejasi
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenPlans();
              }}
              className="px-3 py-1 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
            >
              Ta'rifni almashtirish
            </button>
          </div>
        </div>

        {/* Section 2: Monday Drop VIP API Key Window */}
        <div className="rounded-2xl border border-zinc-200 p-5 space-y-3 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-orange-500" />
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                Shaxsiy Gemini API Kalit (Haftalik Dushanba Oynasi)
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className={`font-bold ${windowStatus.isOpen ? 'text-emerald-600' : 'text-zinc-500'}`}>
                {windowStatus.isOpen ? '🟢 Oyna ochiq' : `🔒 ${windowStatus.formattedTime}`}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            AI studiyamizda barqaror server sifatini ta'minlash maqsadida, shaxsiy API kalitlarini qabul qilish oynasi <strong>har haftaning Dushanba kuni soat 09:00 dan 19:00 gacha</strong> ochiladi. Kalit kiritilsa, hisobingizga avtomatik <strong>Cheklovsiz Pro</strong> yoqiladi.
          </p>

          {user?.customApiKey ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Sizda shaxsiy API kalit faol (Cheklovsiz Pro yoqilgan).</span>
              </div>
              <button
                onClick={handleRemoveKey}
                className="text-[11px] font-bold text-rose-700 hover:underline"
              >
                O'chirish
              </button>
            </div>
          ) : windowStatus.isOpen ? (
            <form onSubmit={handleSaveApiKey} className="space-y-2 pt-1">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy... (Gemini API kaliti)"
                  className="flex-1 text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  {savedSuccess ? 'Saqlandi!' : 'Kalitni Saqlash'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Kalit faqat sizning xavfsiz brauzeringizda saqlanadi.
              </p>
            </form>
          ) : (
            <div className="p-3.5 rounded-xl bg-zinc-100 text-zinc-600 text-xs flex items-center justify-between">
              <span>Hozirda kalit kiritish oynasi qulflangan (Dushanba 09:00 da ochiladi).</span>
              <button
                type="button"
                onClick={() => setTestOverride(!testOverride)}
                className="text-[11px] font-bold text-orange-600 hover:underline"
              >
                {testOverride ? 'Sinovni o\'chirish' : 'Sinovda ochish'}
              </button>
            </div>
          )}
        </div>

        {/* Section 3: App Preferences */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
            Qo'shimcha Qulayliklar:
          </h4>

          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 text-xs">
            <div className="flex items-center gap-2 text-zinc-700">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span>Interfeys Tili</span>
            </div>
            <span className="font-bold text-zinc-900">O'zbek tili (Lotin)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 text-xs">
            <div className="flex items-center gap-2 text-zinc-700">
              <Sliders className="w-4 h-4 text-zinc-400" />
              <span>Promt generatsiya qilinganda avtomatik nusxalash</span>
            </div>
            <button
              onClick={() => setAutoCopy(!autoCopy)}
              className="text-zinc-600"
            >
              {autoCopy ? <ToggleRight className="w-6 h-6 text-orange-500" /> : <ToggleLeft className="w-6 h-6 text-zinc-300" />}
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
