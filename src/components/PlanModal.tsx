import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserPlan } from '../types';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  const { user, updatePlan, plans, tokenStatus, resetTokenBuffer } = useAuth();
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = user?.plan || 'free';

  const handleSelectPlan = (planId: UserPlan) => {
    updatePlan(planId);
    if (planId !== 'free') {
      resetTokenBuffer();
    }
    setSuccessNotice(`Siz muvaffaqiyatli ${plans[planId].name} tarifiga o'tdingiz!`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-zinc-200 relative my-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            MayPrompt &amp; Google Gemini Ta'riflari
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Uzluksiz Video Prompt &amp; Rejissura Rejalari
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            Google ekotizimiga ulanganingizda qulay token buferi va maxsus kamera/marketing vositalariga ega bo'lasiz.
          </p>
        </div>

        {/* Status notice if updated */}
        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center animate-in fade-in">
            {successNotice}
          </div>
        )}

        {/* Cooldown reminder if currently in cooldown */}
        {tokenStatus.inCooldown && currentPlan === 'free' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold">Gemini Free seans tokenlari tugagan:</span>{' '}
              Xavfsiz bufer 4-6 soatlik oraliqda tiklanmoqda ({tokenStatus.formattedCountdown}). Kutmasdan davom etish uchun quyidagi Plus yoki Pro tarifiga o'ting.
            </div>
          </div>
        )}

        {/* 3 Tier Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. FREE PLAN */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentPlan === 'free'
                ? 'border-zinc-900 ring-2 ring-zinc-900/10 bg-zinc-50/70'
                : 'border-zinc-200 bg-white hover:border-zinc-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Boshlang'ich
                </span>
                {currentPlan === 'free' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-white">
                    Faol Ta'rif
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-zinc-900">{plans.free.name}</h4>
                <div className="text-2xl font-bold text-zinc-900 mt-1">
                  $0 <span className="text-xs font-normal text-zinc-500">/ Google Free</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  {plans.free.tagline}
                </p>
              </div>

              <div className="h-px bg-zinc-200/80" />

              <div className="space-y-1.5 text-xs text-zinc-600">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Taqsimot qoidalari:
                </p>
                {plans.free.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] leading-snug">
                    <Check className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('free')}
              disabled={currentPlan === 'free'}
              className={`w-full mt-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                currentPlan === 'free'
                  ? 'bg-zinc-200/80 text-zinc-500 cursor-default'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
              }`}
            >
              {currentPlan === 'free' ? 'Joriy Reja' : 'Free Rejaga O\'tish'}
            </button>
          </div>

          {/* 2. PLUS PLAN (Google Plus + $2 Markup) */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentPlan === 'plus'
                ? 'border-zinc-900 ring-2 ring-zinc-900/10 bg-zinc-50/70'
                : 'border-zinc-200 bg-white hover:border-zinc-400'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-500" />
                  Uzluksiz Ishlash
                </span>
                {currentPlan === 'plus' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-white">
                    Faol Ta'rif
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-zinc-900">{plans.plus.name}</h4>
                <div className="text-2xl font-bold text-zinc-900 mt-1">
                  {plans.plus.priceLabel}
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Google ($9.99) + MayPrompt vositalari ($2.00)
                </p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  {plans.plus.tagline}
                </p>
              </div>

              <div className="h-px bg-zinc-200/80" />

              <div className="space-y-1.5 text-xs text-zinc-600">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Nimalar ochiladi:
                </p>
                {plans.plus.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] leading-snug">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('plus')}
              disabled={currentPlan === 'plus'}
              className={`w-full mt-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                currentPlan === 'plus'
                  ? 'bg-zinc-200/80 text-zinc-500 cursor-default'
                  : 'bg-zinc-900 hover:bg-black text-white shadow-2xs'
              }`}
            >
              {currentPlan === 'plus' ? 'Joriy Reja' : 'Plus Rejaga O\'tish'}
            </button>
          </div>

          {/* 3. PRO PLAN (Google One AI Premium + $2 Markup) */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative ${
              currentPlan === 'pro'
                ? 'border-zinc-900 ring-2 ring-zinc-900/15 bg-zinc-50/70'
                : 'border-zinc-300 bg-white hover:border-zinc-500'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Cheklovsiz Pro
                </span>
                {currentPlan === 'pro' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-white">
                    Faol Ta'rif
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-zinc-900">{plans.pro.name}</h4>
                <div className="text-2xl font-bold text-zinc-900 mt-1">
                  {plans.pro.priceLabel}
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Google One AI Pro ($19.99) + MayPrompt Studio ($2.00)
                </p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  {plans.pro.tagline}
                </p>
              </div>

              <div className="h-px bg-zinc-200/80" />

              <div className="space-y-1.5 text-xs text-zinc-600">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Maksimal imkoniyatlar:
                </p>
                {plans.pro.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] leading-snug font-medium">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('pro')}
              disabled={currentPlan === 'pro'}
              className={`w-full mt-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentPlan === 'pro'
                  ? 'bg-zinc-200/80 text-zinc-500 cursor-default'
                  : 'bg-zinc-900 hover:bg-black text-white shadow-2xs active:scale-98'
              }`}
            >
              {currentPlan === 'pro' ? 'Joriy Reja (Cheklovsiz)' : 'Cheklovsiz Pro-ga O\'tish'}
            </button>
          </div>
        </div>

        {/* Info footer */}
        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
            <span>
              Har qanday vaqtda bekor qilish yoki Google hisobingiz orqali shaxsiy API kalitini kiritish mumkin.
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">MayPrompt v2.2</span>
        </div>
      </div>
    </div>
  );
};
