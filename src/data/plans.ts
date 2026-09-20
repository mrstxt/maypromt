import { PlanConfig, UserPlan } from '../types';

export const PLANS: Record<UserPlan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Gemini Free',
    geminiTier: 'Gemini 3.8 Flash (Standart)',
    dailyLimit: 5,
    isUnlimited: false,
    priceLabel: 'Bepul',
    tagline: 'Sinab ko\'rish va havaskor AI yaratuvchilar uchun',
    features: [
      'Kuniga 5 ta video/kadr tahlili',
      'Midjourney v6.1 & Flux.1 promtlari',
      'Runway Gen-3 va Kling AI 1.5 asosiy promtlari',
      'Standart tahlil tezligi',
      'Oddiy shotlist va rejissura tavsiyalari',
    ],
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    accentColor: 'border-zinc-300 hover:border-zinc-400',
  },
  plus: {
    id: 'plus',
    name: 'Gemini Plus',
    geminiTier: 'Gemini 3.8 Flash (Tezkor)',
    dailyLimit: 30,
    isUnlimited: false,
    priceLabel: 'Plus Reja',
    tagline: 'Faol blogerlar, SMM va AI video mutaxassislari uchun',
    features: [
      'Kuniga 30 ta yuqori sifatli video tahlil',
      'Image-to-Video (I2V) Starting Keyframe generatsiyasi',
      'Kling AI Kamera Sliderlari & Motion Brush yo\'riqnomasi',
      'Tezkor AI ishlov berish (2x tezroq)',
      'AI Video Negative Prompt himoyasi',
    ],
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: 'border-blue-400 hover:border-blue-500 shadow-blue-500/10',
  },
  pro: {
    id: 'pro',
    name: 'Gemini Pro (Cheklovsiz)',
    geminiTier: 'Gemini 3.8 Flash / Pro (Cheksiz)',
    dailyLimit: Infinity,
    isUnlimited: true,
    priceLabel: 'Cheklovsiz Pro',
    tagline: 'Professional AI studiyalar va kinooperatorlar uchun',
    features: [
      '🔥 CHEKLOVSIZ — Kunlik va oylik hech qanday cheklov yo\'q!',
      'To\'liq 100% Video Replikatsiya Markazi',
      '4K kadrlar va bir nechta harakat ketma-ketliklari',
      'VIP ustuvor AI hisoblash navbati',
      'Shaxsiy Gemini API kalitini kiritish imkoniyati',
      'Barcha eksport formatlari va to\'liq shotlist',
    ],
    badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent',
    accentColor: 'border-orange-500 shadow-orange-500/20 ring-2 ring-orange-500/20',
  },
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
