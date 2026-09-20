import React from 'react';
import { X, Camera, Sun, User, Sparkles, Smartphone, Layers } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900">
                MayPrompt Qo'llanmasi: Syomka &amp; Rakurs Tahlili
              </h3>
              <p className="text-xs text-zinc-500">
                Instagram / TikTok videolarni tahlil qilish va AI promptga aylantirish sirlari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-zinc-800 text-xs sm:text-sm">
          {/* Section 1: Loyiha Maqsadi */}
          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/70 space-y-2">
            <h4 className="text-sm font-bold text-orange-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              Loyiha Maqsadi va Imkoniyatlari:
            </h4>
            <p className="text-zinc-700 leading-relaxed text-xs">
              Instagram, Reels yoki kinoda ko'rgan ajoyib videoni tahlil qilib, operator qanday burchak (rakurs) tanlaganini, yorug'lik qayerdan tushganini, aktyor qanday poza va mimika berganini aniqlaydi. So'ngra buni <strong>Midjourney</strong>, <strong>Sora</strong>, <strong>Runway</strong> yoki o'zingiz telefon orqali suratga olishingiz uchun to'liq yo'riqnomaga aylantirib beradi.
            </p>
          </div>

          {/* Section 2: AI Video Replikatsiya Masterklassi */}
          <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200/80 space-y-3">
            <h4 className="text-sm font-bold text-violet-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              AI Kontentmakerlar uchun: Real Videoni AI-da Qayta Yaratish Sirlari:
            </h4>
            <div className="space-y-2 text-xs text-violet-950 leading-relaxed">
              <p>
                <strong>1. 100% O'xshashlik Kafolati — I2V (Image-to-Video):</strong> Matndan to'g'ridan-to'g'ri video generatsiya qilganda (T2V) AI kutilmagan yuz yoki rakurs chizib qo'yishi mumkin. Shuning uchun MayPrompt-da berilgan <em>Starting Keyframe Prompt</em> orqali avval Midjourney v6.1 yoki Flux-da birinchi kadrni oling.
              </p>
              <p>
                <strong>2. Runway Gen-3 &amp; Kamera Teglari:</strong> Runway-da <code>[Camera Move: Low angle, slow dolly forward]</code> kabi burchakli qavslar ichidagi maxsus deskriptorlar AI modeliga kameraning jismoniy holatini majburiy belgilaydi.
              </p>
              <p>
                <strong>3. Kling AI Kamera Sliderlari:</strong> Kling 1.5 va 2.0 versiyalarida <em>Zoom, Pan, Tilt, Roll</em> sozlamalarini MayPrompt ko'rsatgan aniq sonlar (masalan: Zoom +2.0, Tilt -1.0) ga to'g'rilang.
              </p>
              <p>
                <strong>4. Negative Promptning Ahamiyati:</strong> Videoda odam yuzi suyuqlashishi (melting face) yoki qo'llari g'alati buzilishi (morphing limbs) ning oldini olish uchun berilgan <em>Video Negative Prompt</em>dan har doim foydalaning.
              </p>
            </div>
          </div>

          {/* Section 3: Rakurs Turlari */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-orange-500" />
              Asosiy Kamera Rakurslari (Kino va Reels):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <strong className="text-xs font-bold text-zinc-900 block">Low-Angle (Pastki rakurs):</strong>
                <span className="text-[11px] text-zinc-600 leading-relaxed block mt-0.5">
                  Kamera pastda, ob'ektga yuqoriga qarab qaratilgan. Qahramonni kuchli, ulug'vor yoki dinamik ko'rsatadi (masalan, moda yurishi).
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <strong className="text-xs font-bold text-zinc-900 block">Dutch Angle (Qiyshiq burchak):</strong>
                <span className="text-[11px] text-zinc-600 leading-relaxed block mt-0.5">
                  Kamera gorizont chizig'iga nisbatan 15-45 gradus qiyshaytiriladi. Kuchli dramatik, sirli yoki notinch kayfiyat beradi.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <strong className="text-xs font-bold text-zinc-900 block">Eye-Level (Ko'z darajasi):</strong>
                <span className="text-[11px] text-zinc-600 leading-relaxed block mt-0.5">
                  Tomoshabin va qahramon o'rtasida to'g'ridan-to'g'ri samimiy, ishonchli bog'liqlik yaratuvchi tabiiy rakurs.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <strong className="text-xs font-bold text-zinc-900 block">Close-up &amp; Shallow DOF:</strong>
                <span className="text-[11px] text-zinc-600 leading-relaxed block mt-0.5">
                  Yuz mimikasi, ko'z ifodasi markazda, orqa fon esa yumshoq xiralashtirilgan (f/1.4 bokeh effekti).
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Syomka Qo'llanmasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              Instagram Reels uchun Syomka Maslahatlari:
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-700 list-disc list-inside">
              <li>Telefon linzasini har doim toza mato bilan artib oling.</li>
              <li>Ekspozitsiyani (yorug'lik darajasini) ekranga bosib turib -0.3 yoki -0.7 ga pasaytiring, bu kinematografik qorong'ilik beradi.</li>
              <li>Harakatli kadrlarda 60fps (yoki 120fps sekinlashtirilgan harakat) rejimini tanlang.</li>
              <li>Yuzning bir tomoniga yorug'lik tushirib, ikkinchi tomonini soyada qoldirish orqali hajm yarating.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};
