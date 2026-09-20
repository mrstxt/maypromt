import React, { useState } from 'react';
import { Youtube, Search, Sparkles, ExternalLink, Play, AlertCircle, ArrowRight } from 'lucide-react';

interface YouTubeInputProps {
  onAnalyzeThumbnail: (thumbnailUrl: string, title: string) => void;
  isAnalyzing: boolean;
}

const POPULAR_YOUTUBE_SAMPLES = [
  {
    title: "Cinematic Drone & City Lighting (Cyberpunk)",
    url: "https://www.youtube.com/watch?v=21X5lGlDOfg",
    id: "21X5lGlDOfg",
    tag: "Kino & Rakurs",
  },
  {
    title: "Viral Reels Portrait & Dynamic Camera Move",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    id: "dQw4w9WgXcQ",
    tag: "Reels & Mimika",
  },
  {
    title: "Fast Car Action Shot (Teal & Orange)",
    url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    id: "kJQP7kiw5Fk",
    tag: "Avto & Harakat",
  }
];

export const YouTubeInput: React.FC<YouTubeInputProps> = ({
  onAnalyzeThumbnail,
  isAnalyzing,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<{
    videoId: string;
    thumbnails: string[];
    selectedThumbnail: string;
    title: string;
    embedUrl: string;
  } | null>(null);

  const handleFetchInfo = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/youtube/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "YouTube video ma'lumotlarini yuklab bo'lmadi.");
      }

      const data = await res.json();
      setVideoInfo(data);
    } catch (err: any) {
      setError(err.message || "Havola noto'g'ri yoki YouTube videosi topilmadi.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!videoInfo) return;
    onAnalyzeThumbnail(videoInfo.selectedThumbnail, videoInfo.title);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <Youtube className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900">
            YouTube Video &amp; Shorts Integratsiyasi
          </h3>
          <p className="text-xs text-zinc-500">
            YouTube havolasini kiriting: video kadrlari va rakurslari avtomatik ajratilib, AI promtga aylanadi
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo()}
              placeholder="https://www.youtube.com/watch?v=... yoki youtu.be/... shorts/..."
              className="w-full text-xs sm:text-sm bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono shadow-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => handleFetchInfo()}
            disabled={!url.trim() || loading}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {loading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Yuklash</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Popular Presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-600">
          Yoki sinab ko'rish uchun mashhur YouTube Shorts/Videolar:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {POPULAR_YOUTUBE_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleFetchInfo(sample.url);
              }}
              className="p-3 rounded-2xl border border-zinc-200 hover:border-rose-400 hover:bg-rose-50/30 text-left transition-all group"
            >
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">
                {sample.tag}
              </span>
              <span className="text-xs font-bold text-zinc-800 group-hover:text-rose-600 line-clamp-1 mt-0.5">
                {sample.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Preview Card */}
      {videoInfo && (
        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative group shadow-sm">
            <img
              src={videoInfo.selectedThumbnail}
              alt="YouTube Thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to hqdefault
                (e.target as HTMLImageElement).src = videoInfo.thumbnails[1] || videoInfo.thumbnails[0];
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={`https://www.youtube.com/watch?v=${videoInfo.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white/90 text-zinc-900 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                YouTube-da ko'rish
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <h4 className="text-sm font-extrabold text-zinc-900">
                {videoInfo.title}
              </h4>
              <p className="text-xs text-zinc-500">
                Yuqori aniqlikdagi kadr (1080p / 4K) AI tahlili uchun tayyor
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? "Tahlil qilinmoqda..." : "Videoni Tahlil Qilish & Promt Olish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
