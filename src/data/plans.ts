import { PlanConfig, UserPlan } from '../types';

export const STORAGE_PLANS_KEY = 'mayprompt_dynamic_plans_v2';

export const DEFAULT_PLANS: Record<UserPlan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Gemini Free',
    geminiTier: 'Gemini 3.8 Flash (Google Free Tier)',
    dailyLimit: 10,
    isUnlimited: false,
    priceLabel: 'Bepul ($0)',
    priceUSD: 0,
    googleBasePriceUSD: 0,
    markupUSD: 0,
    tagline: 'Google Free hisobi: 70% asosiy kvota + 30% zaxira bufer bilan tejamkor rejim',
    features: [
      'Google Free Tier: 70% to\'g\'ridan-to\'g\'ri token ajratish',
      '30% Smart Buffer (Tokenlarni silliq taqsimlash)',
      'Standart kadr tahlili va Midjourney v6.1 promtlari',
      'Oddiy ssenariy tavsiyalari',
      'Limit tugaganda 2-4 soatlik xavfsiz sovutish (cooldown) davri',
    ],
    googleIncludedFeatures: [
      'Google hisobidagi Free Gemini Flash API',
      'Standart 15 RPM so\'rovlar tezligi',
    ],
    platformExtraFeatures: [
      'MayPrompt Smart 70/30 Bufer algoritmi',
      'Kadr ajratuvchi va optik tahlil vositasi',
    ],
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    accentColor: 'border-zinc-300 hover:border-zinc-400',
  },
  plus: {
    id: 'plus',
    name: 'Gemini Plus',
    geminiTier: 'Gemini 3.8 Flash (Tezkor & Cheklovsiz)',
    dailyLimit: 60,
    isUnlimited: false,
    priceLabel: '$11.99 / oy',
    priceUSD: 11.99,
    googleBasePriceUSD: 9.99,
    markupUSD: 2.00,
    tagline: 'Google Plus imkoniyatlari + MayPrompt maxsus rejissura vositalari (0 uzilish)',
    features: [
      'Hech qanday 2-4 soatlik uzilish va kutishlarsiz uzluksiz rejim',
      '100% to\'liq token tezligi (bufer sekinlashuvisiz)',
      'Image-to-Video (I2V) Starting Keyframe generatsiyasi',
      'Kling AI Kamera Sliderlari & Motion Brush yo\'riqnomasi',
      'Instagram Reels 3-soniyalik ssenariylar va kitoblar tahlili',
      'Google Plus qulayliklari ustiga MayPrompt qo\'shimcha funksiyalari',
    ],
    googleIncludedFeatures: [
      'Google Gemini kengaytirilgan token hajmi',
      'Yuqori ustuvorlikdagi API navbati',
    ],
    platformExtraFeatures: [
      'Kamera harakatlari (Pan, Tilt, Zoom, Roll) generatori',
      'Hormozi, Brunson marketing kitoblari integratsiyasi',
      'Tezkor AI video render promtlari',
    ],
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: 'border-blue-400 hover:border-blue-500 shadow-blue-500/10',
  },
  pro: {
    id: 'pro',
    name: 'Gemini Pro',
    geminiTier: 'Gemini 3.8 Flash / Pro (Cheksiz Rejissyor)',
    dailyLimit: Infinity,
    isUnlimited: true,
    priceLabel: '$21.99 / oy',
    priceUSD: 21.99,
    googleBasePriceUSD: 19.99,
    markupUSD: 2.00,
    tagline: 'Google One AI Premium ($19.99) + MayPrompt Pro Studio ($2.00)',
    features: [
      '🔥 TO\'LIQ CHEKLOVSIZ — Tokenlar, kadrlar va chatlar soni cheksiz!',
      'Nol kutish: 24/7 eng yuqori VIP hisoblash tezligi',
      '100% Video Replikatsiya Markazi va 4K kadrlarni ajratish',
      'Runway Gen-3 va Kling AI uchun to\'liq kinematik harakatlar',
      'Shaxsiy Google API kalitini integratsiya qilish imkoniyati',
      'Barcha eksport formatlari, ssenariy shotlistlari va VIP qo\'llab-quvvatlash',
    ],
    googleIncludedFeatures: [
      'Google One AI Premium (Gemini Advanced Pro modellar)',
      'Cheksiz katta kontekst (1M+ token)',
      'Maksimal o\'tkazuvchanlik',
    ],
    platformExtraFeatures: [
      'To\'liq Rejissura Blueprinti va Mobil syomka sirlari',
      'Professional AI video prompter',
      'Eksklyuziv Marketing RAG bilimlari',
    ],
    badgeColor: 'bg-zinc-900 text-white border-transparent',
    accentColor: 'border-zinc-900 shadow-zinc-900/20 ring-2 ring-zinc-900/10',
  },
};

export const getDynamicPlans = (): Record<UserPlan, PlanConfig> => {
  try {
    const saved = localStorage.getItem(STORAGE_PLANS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        free: { ...DEFAULT_PLANS.free, ...parsed.free },
        plus: { ...DEFAULT_PLANS.plus, ...parsed.plus },
        pro: { ...DEFAULT_PLANS.pro, ...parsed.pro },
      };
    }
  } catch (e) {
    console.error('Error reading dynamic plans:', e);
  }
  return DEFAULT_PLANS;
};

export const saveDynamicPlans = (plans: Record<UserPlan, PlanConfig>) => {
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(plans));
};

export const PLANS = getDynamicPlans();

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
