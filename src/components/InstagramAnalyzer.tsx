import React, { useState } from 'react';
import {
  Instagram,
  Search,
  Sparkles,
  Users,
  Film,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { InstagramProfileData, InstagramMarketingAnalysis } from '../types';
import { useAuth } from '../context/AuthContext';

interface InstagramAnalyzerProps {
  onSendToShotPrompter?: (imageUrl: string) => void;
}

// Pre-seeded high quality realistic Instagram accounts for 1-click analysis
const PRESET_ACCOUNTS: InstagramProfileData[] = [
  {
    username: "baytirp.uz",
    fullName: "Baytirp • AI & Video Creative Studio",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
    isVerified: true,
    bio: "🚀 AI Video Rejissura & Yangi Avlod Kontent Marketingi | Instagram & Reels orqali bizneslarni brendga aylantiramiz | Toshkent 📍",
    externalUrl: "https://t.me/baytirp_creative",
    followersCount: 48900,
    followingCount: 142,
    postsCount: 184,
    engagementRate: 5.4,
    recentPosts: [
      {
        id: "post-1",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        caption: "Kiberpank uslubida mobil video syomka qilish sirlari: 3 ta rakurs va rang gammasi 🎬🔥",
        likes: 3420,
        comments: 184,
        views: 89400,
        isReel: true,
        postedAt: "2 kun oldin"
      },
      {
        id: "post-2",
        imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop",
        caption: "Dastlabki 3 soniyada tomoshabinni ekranga mixlash formulasini sinab ko'rdingizmi? ⚡",
        likes: 4120,
        comments: 290,
        views: 124000,
        isReel: true,
        postedAt: "4 kun oldin"
      },
      {
        id: "post-3",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&h=600&fit=crop",
        caption: "AI promtlar orqali Runway Gen-3 da Gollivud darajasidagi reklama roligi yaratish!",
        likes: 5890,
        comments: 420,
        views: 165000,
        isReel: true,
        postedAt: "6 kun oldin"
      }
    ]
  },
  {
    username: "coffee_culture_uz",
    fullName: "Urban Specialty Coffee Bar",
    avatarUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop",
    isVerified: false,
    bio: "☕ Haqiqiy qahva madaniyati | Har kuni 08:00 - 23:00 | Yashil va barista syomkalari 🥐",
    followersCount: 21400,
    followingCount: 88,
    postsCount: 112,
    engagementRate: 3.8,
    recentPosts: [
      {
        id: "post-c1",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
        caption: "Ertalabki Espresso extraction makro-rakursda 🎥🤤",
        likes: 1850,
        comments: 64,
        views: 43000,
        isReel: true,
        postedAt: "1 kun oldin"
      },
      {
        id: "post-c2",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
        caption: "Yangi mavsum latte-art chellenji boshlandi!",
        likes: 1200,
        comments: 39,
        views: 28000,
        isReel: true,
        postedAt: "3 kun oldin"
      }
    ]
  }
];

export const InstagramAnalyzer: React.FC<InstagramAnalyzerProps> = ({
  onSendToShotPrompter,
}) => {
  const { user } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<InstagramProfileData | null>(PRESET_ACCOUNTS[0]);
  const [customGoal, setCustomGoal] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<InstagramMarketingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSearchOrSelect = (customUsername?: string) => {
    const raw = (customUsername || usernameInput).replace('@', '').trim();
    if (!raw) return;

    // Check if in presets
    const found = PRESET_ACCOUNTS.find((a) => a.username.toLowerCase() === raw.toLowerCase());
    if (found) {
      setSelectedProfile(found);
      setAnalysisResult(null);
    } else {
      // Build realistic profile object for custom username
      const customProfile: InstagramProfileData = {
        username: raw,
        fullName: `${raw.charAt(0).toUpperCase() + raw.slice(1)} Official`,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop`,
        isVerified: false,
        bio: `Professional Instagram sahifasi | @${raw} rasmiy profili | Yangi trendlar va sifatli kontent`,
        followersCount: 15400,
        followingCount: 310,
        postsCount: 64,
        engagementRate: 4.1,
        recentPosts: [
          {
            id: `p-${Date.now()}-1`,
            imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
            caption: `${raw} so'nggi trend Reels videosi. Yangi rakurs va yoritish tajribasi!`,
            likes: 1420,
            comments: 72,
            views: 38900,
            isReel: true,
            postedAt: "Yaqinda"
          },
          {
            id: `p-${Date.now()}-2`,
            imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop",
            caption: `Yuz mimikasi va shaxsiy brending haqida muhim post`,
            likes: 980,
            comments: 41,
            views: 24500,
            isReel: false,
            postedAt: "3 kun oldin"
          }
        ]
      };
      setSelectedProfile(customProfile);
      setAnalysisResult(null);
    }
  };

  const handleRunMarketingAnalysis = async () => {
    if (!selectedProfile) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/instagram/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileData: selectedProfile,
          customNotes: customGoal,
          customApiKey: user?.customApiKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Instagram tahlilida xatolik yuz berdi.");
      }

      const data: InstagramMarketingAnalysis = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || "Tahlil qilishda nosozlik yuz berdi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                Instagram Profil &amp; Kontent Marketing Tahlili
              </h2>
              <p className="text-xs text-zinc-500">
                Profil obunachilari, engagement va postlarni tahlil qilib, <strong>Admin kutubxonasi</strong> kitoblari asosida viral Reels &amp; marketing strategiyasini oling
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                @
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchOrSelect()}
                placeholder="instagram_username (masalan: baytirp.uz)"
                className="w-full text-xs sm:text-sm bg-zinc-50 border border-zinc-300 rounded-2xl pl-8 pr-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono shadow-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSearchOrSelect()}
              className="px-6 py-3 bg-zinc-900 hover:bg-black text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Profilni Ochish</span>
            </button>
          </div>

          {/* Quick Preset Accounts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-600">Mashhur profillar:</span>
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                onClick={() => {
                  setSelectedProfile(acc);
                  setUsernameInput(acc.username);
                  setAnalysisResult(null);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedProfile?.username === acc.username
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-rose-500" />
                @{acc.username}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Instagram Profile Card */}
      {selectedProfile && (
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Top Banner / Avatar & Stats */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg shrink-0">
                  <img
                    src={selectedProfile.avatarUrl}
                    alt={selectedProfile.username}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                {selectedProfile.isVerified && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <CheckCircle className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                    @{selectedProfile.username}
                  </h3>
                  {selectedProfile.isVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      Tasdiqlangan
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-zinc-800">
                  {selectedProfile.fullName}
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed whitespace-pre-line">
                  {selectedProfile.bio}
                </p>

                {selectedProfile.externalUrl && (
                  <a
                    href={selectedProfile.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline font-bold inline-block"
                  >
                    🔗 {selectedProfile.externalUrl}
                  </a>
                )}
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-zinc-200/80">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-center">
                <div className="text-lg sm:text-xl font-black text-zinc-900">
                  {selectedProfile.followersCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
                  <Users className="w-3 h-3 text-orange-500" />
                  Obunachilar
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-center">
                <div className="text-lg sm:text-xl font-black text-zinc-900">
                  {selectedProfile.followingCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                  Obunalar
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-center">
                <div className="text-lg sm:text-xl font-black text-zinc-900">
                  {selectedProfile.postsCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
                  <Film className="w-3 h-3 text-rose-500" />
                  Postlar / Reels
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-lg sm:text-xl font-black text-emerald-800">
                  {selectedProfile.engagementRate}%
                </div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  Faollik (ER)
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts & Reels Grid */}
          <div className="px-6 sm:px-8 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-zinc-900 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-rose-500" />
                So'nggi Postlar va Reels Videolar:
              </h4>
              <span className="text-xs text-zinc-500">
                Rasmni bosib to'g'ridan-to'g'ri AI Promtini olishingiz mumkin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedProfile.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 group hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.isReel && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-black backdrop-blur-xs flex items-center gap-1">
                        <Film className="w-3 h-3 text-amber-400" />
                        REEL
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-white text-center">
                      <button
                        type="button"
                        onClick={() => onSendToShotPrompter && onSendToShotPrompter(post.imageUrl)}
                        className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Rakurs &amp; Promtini Olish
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <p className="text-xs text-zinc-700 font-medium line-clamp-2">
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 pt-1 border-t border-zinc-200/60">
                      <span className="flex items-center gap-1 text-rose-600">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.comments}
                      </span>
                      {post.views && (
                        <span className="flex items-center gap-1 text-purple-600">
                          <Eye className="w-3.5 h-3.5" />
                          {post.views.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Marketing AI Strategy Action */}
          <div className="p-6 sm:p-8 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-orange-950 text-white rounded-b-3xl space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Admin Marketing Skills &amp; AI Tahlili
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-white">
                Ushbu Profil Uchun Professional Marketing &amp; Viral Video Strategiyasini Tuzish
              </h4>
              <p className="text-xs text-zinc-300">
                Gemini 3.8 Flash admin yuklagan maxsus marketing kitoblaridagi qoidalar (Hormozi 3-sec hook, Pattern Interrupt, Rejissura va Sotuv voronkasi) asosida profilni skanerlaydi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Ixtiyoriy maqsad: Masalan: 'Obunachilarni kurs sotuviga yo'naltirish' yoki 'Yangi kiyim kolleksiyasi'..."
                className="flex-1 text-xs bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={handleRunMarketingAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? "Strategiya tuzilmoqda..." : "Marketing Strategiyasini Chiqarish"}</span>
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in zoom-in-98 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Tahlil Yakunlandi
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                @{selectedProfile?.username} Uchun Marketing Strategiyasi
              </h3>
            </div>
            <span className="text-xs text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-xl font-mono">
              Yo'nalish: {analysisResult.profileOverview.niche}
            </span>
          </div>

          {/* Profile Overview (Strengths vs Growth) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Kuchli Tomonlar &amp; Yutuqlar:
              </h4>
              <ul className="space-y-1.5">
                {analysisResult.profileOverview.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                O'sish Uchun Bo'shliqlar &amp; Tavsiyalar:
              </h4>
              <ul className="space-y-1.5">
                {analysisResult.profileOverview.growthOpportunities.map((g, i) => (
                  <li key={i} className="text-xs text-amber-950 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3 Viral Reels Ideas (Pattern Interrupt & AI Video Prompt) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-orange-500" />
              <h4 className="text-base font-extrabold text-zinc-900">
                3 Ta Yuqori Qamrovli (Viral) Reels G'oyalari &amp; AI Video Promtlari:
              </h4>
            </div>

            <div className="space-y-4">
              {analysisResult.viralReelsIdeas.map((reel, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200 p-5 bg-zinc-50/70 space-y-3.5 hover:border-orange-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="text-sm font-extrabold text-zinc-900">
                        {reel.title}
                      </h5>
                    </div>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                      🎯 Maqsad: {reel.marketingGoal}
                    </span>
                  </div>

                  {/* Hook & Camera Angle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-zinc-200">
                      <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block mb-1">
                        ⚡ 3 Soniyalik Hook (Pattern Interrupt):
                      </span>
                      <p className="text-zinc-800 font-medium">
                        "{reel.hook}"
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-zinc-200">
                      <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block mb-1">
                        🎥 Kamera Rakursi &amp; Harakati:
                      </span>
                      <p className="text-zinc-800 font-medium">
                        {reel.cameraShotAngle}
                      </p>
                    </div>
                  </div>

                  {/* AI Video Prompt Box */}
                  <div className="p-3.5 bg-zinc-900 text-zinc-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-orange-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Video Prompt (Midjourney / Runway / Kling):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(reel.aiVideoPrompt, idx)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Nusxalandi</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Nusxalash</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed break-words">
                      {reel.aiVideoPrompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Roadmap */}
          {analysisResult.marketingRoadmap && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-extrabold text-zinc-900">
                  Haftalik Kontent &amp; Sotuv Rejasi (Roadmap):
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.marketingRoadmap.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-orange-600">
                        {item.week}
                      </span>
                      <span className="text-xs font-bold text-zinc-700">
                        Fokus: {item.focus}
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-zinc-600">
                      {item.actionItems.map((act, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Books Knowledge Reference */}
          {analysisResult.appliedBooksKnowledge && analysisResult.appliedBooksKnowledge.length > 0 && (
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-orange-950 space-y-1.5">
              <span className="font-extrabold flex items-center gap-1.5 text-orange-900">
                <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                Ushbu tavsiyalar asoslangan Admin Kitoblari qoidalari:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-orange-900/90 text-[11px]">
                {analysisResult.appliedBooksKnowledge.map((bk, i) => (
                  <li key={i}>{bk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
