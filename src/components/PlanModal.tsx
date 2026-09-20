import React from 'react';
import { X, Check, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../data/plans';
import { UserPlan } from '../types';
import { MondayDropBanner } from './MondayDropBanner';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  const { user, updatePlan } = useAuth();

  if (!isOpen) return null;

  const currentPlan = user?.plan || 'free';

  const handleSelectPlan = (planId: UserPlan) => {
    updatePlan(planId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 relative my-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            MayPrompt Ta'riflar &amp; Limitlar
          </div>
          <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Gemini Video Prompt Rejalari
          </h3>
          <p className="text-xs text-zinc-500">
            Har bir Google foydalanuvchisi uchun moslashtirilgan video tahlil va AI replikatsiya kvotasi.
          </p>
        </div>

        {/* 3 Tier Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* FREE PLAN */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentPlan === 'free'
                ? 'border-zinc-900 ring-2 ring-zinc-900/10 bg-zinc-50/50'
                : 'border-zinc-200 bg-white hover:border-zinc-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Boshlang'ich
                </span>
                {currentPlan === 'free' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-900 text-white">
                    Faol Ta'rif
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-zinc-900">Gemini Free</h4>
                <div className="text-2xl font-extrabold text-zinc-900 mt-1">
                  5 <span className="text-xs font-medium text-zinc-500">ta / kun</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {PLANS.free.tagline}
                </p>
              </div>

              <div className="h-px bg-zinc-200" />

              <ul className="space-y-2 text-xs text-zinc-600">
                {PLANS.free.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('free')}
              disabled={currentPlan === 'free'}
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentPlan === 'free'
                  ? 'bg-zinc-200 text-zinc-600 cursor-default'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
              }`}
            >
              {currentPlan === 'free' ? 'Joriy Ta\'rif' : 'Free Ta\'rifga O\'tish'}
            </button>
          </div>

          {/* PLUS PLAN */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentPlan === 'plus'
                ? 'border-blue-600 ring-2 ring-blue-600/15 bg-blue-50/20'
                : 'border-zinc-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Blogerlar Uchun
                </span>
                {currentPlan === 'plus' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                    Faol Ta'rif
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-zinc-900">Gemini Plus</h4>
                <div className="text-2xl font-extrabold text-blue-600 mt-1">
                  30 <span className="text-xs font-medium text-zinc-500">ta / kun</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {PLANS.plus.tagline}
                </p>
              </div>

              <div className="h-px bg-zinc-200" />

              <ul className="space-y-2 text-xs text-zinc-600">
                {PLANS.plus.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('plus')}
              disabled={currentPlan === 'plus'}
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentPlan === 'plus'
                  ? 'bg-blue-100 text-blue-700 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {currentPlan === 'plus' ? 'Joriy Ta\'rif' : 'Plus Ta\'rifni Tanlash'}
            </button>
          </div>

          {/* PRO PLAN (UNLIMITED) */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              currentPlan === 'pro'
                ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20'
                : 'border-zinc-200 bg-white hover:border-orange-300'
            }`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[9px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
              Cheklovsiz
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  VIP Pro Rejim
                </span>
                {currentPlan === 'pro' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white">
                    Faol Ta'rif
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-zinc-900">Gemini Pro</h4>
                <div className="text-2xl font-extrabold text-orange-600 mt-1 flex items-baseline gap-1">
                  Cheksiz <span className="text-xs font-medium text-zinc-500">/ kuniga cheklov yo'q</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {PLANS.pro.tagline}
                </p>
              </div>

              <div className="h-px bg-zinc-200" />

              <ul className="space-y-2 text-xs text-zinc-700 font-medium">
                {PLANS.pro.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('pro')}
              disabled={currentPlan === 'pro'}
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentPlan === 'pro'
                  ? 'bg-orange-100 text-orange-800 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20'
              }`}
            >
              {currentPlan === 'pro' ? 'Joriy Ta\'rif (Cheklovsiz)' : 'Cheklovsiz Pro-ga O\'tish'}
            </button>
          </div>
        </div>

        {/* Monday VIP Drop Banner Component */}
        <div className="pt-2">
          <MondayDropBanner />
        </div>
      </div>
    </div>
  );
};
