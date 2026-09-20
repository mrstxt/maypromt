import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, Sparkles, Key, Check, Flame, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkApiWindowStatus, WindowStatus } from '../utils/windowTiming';

export const MondayDropBanner: React.FC = () => {
  const { user, setCustomApiKey } = useAuth();
  const [testOverride, setTestOverride] = useState(false);
  const [windowStatus, setWindowStatus] = useState<WindowStatus>(() => checkApiWindowStatus(testOverride));
  const [apiKeyInput, setApiKeyInput] = useState(user?.customApiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live timer tick every 1 second
  useEffect(() => {
    const update = () => {
      setWindowStatus(checkApiWindowStatus(testOverride));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [testOverride]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!windowStatus.isOpen) {
      alert("VIP API kiritish oynasi ayni vaqtda yopiq! Faqat Dushanba soat 09:00 dan 19:00 gacha ochiladi.");
      return;
    }
    if (!apiKeyInput.trim()) {
      alert("Iltimos, haqiqiy Gemini API kalitini kiriting.");
      return;
    }
    setCustomApiKey(apiKeyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRemoveKey = () => {
    if (confirm("Haqiqatan ham shaxsiy API kalitni o'chirib, oddiy ta'rifga qaytmoqchimisiz?")) {
      setCustomApiKey('');
      setApiKeyInput('');
    }
  };

  const { isOpen, remainingTime } = windowStatus;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition-all">
      {/* Intrigue Header Banner */}
      <div
        className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white transition-colors ${
          isOpen
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'
            : 'bg-gradient-to-r from-zinc-900 via-zinc-800 to-orange-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
              isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500/30 border border-orange-400/40'
            }`}
          >
            {isOpen ? (
              <Unlock className="w-5 h-5 text-white" />
            ) : (
              <Lock className="w-5 h-5 text-orange-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                Haftalik VIP Drop
              </span>
              <span className="text-xs font-medium text-white/80 hidden sm:inline">
                Har Dushanba 09:00 — 19:00
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
              {isOpen
                ? '🟢 VIP OYNA OCHIQ! Shaxsiy API Kalitingizni Ulang'
                : '🔒 VIP API Kiritish Oynasi Hozircha Qulflangan'}
            </h4>
          </div>
        </div>

        {/* Countdown Ticker Box */}
        <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-2xl border border-white/10 backdrop-blur-xs shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 text-xs text-white/90">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin [animation-duration:8s]" />
            <span className="text-[11px] font-semibold text-white/80">
              {isOpen ? 'Yopilishiga:' : 'Ochilishiga:'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black text-amber-300">
            {remainingTime.days > 0 && (
              <span className="bg-white/10 px-1.5 py-0.5 rounded">
                {remainingTime.days}k
              </span>
            )}
            <span className="bg-white/10 px-1.5 py-0.5 rounded">
              {String(remainingTime.hours).padStart(2, '0')}s
            </span>
            <span>:</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded">
              {String(remainingTime.minutes).padStart(2, '0')}d
            </span>
            <span>:</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">
              {String(remainingTime.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Intrigue Story / Explanation */}
        <div className="text-xs text-zinc-600 leading-relaxed space-y-1.5">
          <p>
            <strong className="text-zinc-900 font-bold">Nega faqat dushanba kuni soat 9:00 dan 19:00 gacha?</strong>{' '}
            AI studiyamizda doimiy yuqori tezlik va barqaror server oqimini ta'minlash maqsadida, shaxsiy Gemini API kalitlarini qabul qilish oynasi haftasiga bir marta — <strong>faqat Dushanba kunlari</strong> faol bo'ladi.
          </p>
          <p className="text-zinc-500">
            Ushbu vaqtda kalitingizni ulab olsangiz, sizga avtomatik tarzda <strong>Cheklovsiz Gemini Pro</strong> rejimi ochiladi!
          </p>
        </div>

        {/* Existing Key Status */}
        {user?.customApiKey && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Sizda shaxsiy API kalit faol!</span>
                <span className="text-emerald-700 block text-[11px]">
                  Barcha cheklovlar bekor qilingan (Cheklovsiz Pro).
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveKey}
              className="px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
            >
              Kalitni o'chirish
            </button>
          </div>
        )}

        {/* Form or Lock State */}
        {isOpen ? (
          <form onSubmit={handleSaveKey} className="space-y-3 pt-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-orange-500" />
                Google AI Studio Gemini API Kalitingizni Kiriting:
              </label>
              <span className="text-[11px] font-bold text-emerald-600">
                ● Oyna ochiq
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                required
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (Gemini API kaliti)"
                className="flex-1 text-xs sm:text-sm bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono shadow-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {saveSuccess ? 'Muvaffaqiyatli Saqlandi!' : 'Pro Rejimni Faollashtirish'}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400">
              Kalitingiz faqat brauzeringiz va xavfsiz sessiyangizda saqlanadi, uchinchi shaxslarga berilmaydi.
            </p>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center mx-auto">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-zinc-800">
              API kiritish ayni daqiqada qulflangan
            </div>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              Dushanba kuni soat 09:00 da oyna avtomatik ochiladi. Tayyor bo'lib turing va cheklovsiz Pro imkoniyatini qo'lga kiriting!
            </p>
          </div>
        )}

        {/* Test Mode Switcher (For developer / evaluation convenience) */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Sinov rejimi: Dushanba oynasini kutmasdan darhol tekshirib ko'rish</span>
          </div>
          <button
            type="button"
            onClick={() => setTestOverride(!testOverride)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              testOverride
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            {testOverride ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-zinc-400" />}
            {testOverride ? 'Sinov Ochiq (Faol)' : 'Oynani Ochish (Sinov)'}
          </button>
        </div>
      </div>
    </div>
  );
};
