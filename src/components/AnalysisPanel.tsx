import React, { useState } from 'react';
import {
  ShotAnalysisData,
} from '../types';
import {
  Camera,
  Sun,
  User,
  Film,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  RefreshCw,
  Send,
  Layers,
  Smartphone,
  Sliders,
  Maximize2,
  Eye,
  Crosshair,
  Lightbulb,
} from 'lucide-react';

interface AnalysisPanelProps {
  data: ShotAnalysisData;
  activeImages: string[];
  onRefinePrompt: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onReset: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  data,
  activeImages,
  onRefinePrompt,
  isRefining,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'i2v' | 'rakurs' | 'face' | 'lighting' | 'blueprint'>('prompts');
  const [generatorSubTab, setGeneratorSubTab] = useState<'i2v' | 'runway' | 'kling' | 'sora_flux' | 'workflow'>('i2v');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [refineText, setRefineText] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# ${data.summaryTitle}
*Janr:* ${data.genre}
*Sana:* ${new Date(data.timestamp).toLocaleString()}

## 1. Umumiy Tahlil
${data.overview}

---

## 2. Kamera Rakursi va Optika
- **Kamera Burchagi (Rakurs):** ${data.rakursAndCamera.angle}
- **Kadr Turi (Shot Type):** ${data.rakursAndCamera.shotType}
- **Kamera Harakati:** ${data.rakursAndCamera.movement}
- **Optika va Linza:** ${data.rakursAndCamera.focalLength}
- **Fokus Chuqurligi:** ${data.rakursAndCamera.depthOfField}
- **Kompozitsiya:** ${data.rakursAndCamera.composition}

---

## 3. Yuz Ifodasi, Nigoh va Poza
- **Qahramon:** ${data.faceAndSubject.subjectDescription}
- **Yuz Mimikasi:** ${data.faceAndSubject.expression}
- **Nigoh va Bosh Holati:** ${data.faceAndSubject.headTiltAndGaze}
- **Tana Pozitsiyasi:** ${data.faceAndSubject.poseAndBodyLanguage}
- **Kiyim va Faktura:** ${data.faceAndSubject.stylingAndClothing}

---

## 4. Yoritish Sxemasi va Rangi
- **Yoritish Uslubi:** ${data.lightingAndAtmosphere.style}
- **Asosiy Nur (Key Light):** ${data.lightingAndAtmosphere.keyLight}
- **To'ldiruvchi Nur (Fill Light):** ${data.lightingAndAtmosphere.fillLight}
- **Kontur Nurlari (Rim/Backlight):** ${data.lightingAndAtmosphere.backgroundLight}
- **Color Grading:** ${data.lightingAndAtmosphere.colorGrade}
- **Ranglar Palitrasi:** ${data.lightingAndAtmosphere.palette?.join(', ') || ''}

---

## 5. AI Video Maker Replikatsiya Markazi (Real Video -> AI Video)

### A. Image-to-Video (I2V) - 100% O'xshashlik Kafolati:
1. **Starting Frame Prompt (Midjourney v6.1 / Flux.1):**
\`\`\`
${data.prompts.imageToVideo?.firstFramePrompt || data.prompts.midjourney}
\`\`\`

2. **I2V Motion Prompt (Runway Gen-3 / Kling 1.5):**
\`\`\`
${data.prompts.imageToVideo?.motionPrompt || data.prompts.soraPrompt}
\`\`\`

### B. Runway Gen-3 Alpha Prompt:
\`\`\`
${data.prompts.runwayGen3?.prompt || data.prompts.soraPrompt}
\`\`\`
*Camera Move Tag:* ${data.prompts.runwayGen3?.cameraMovementTag || data.rakursAndCamera.movement}
*Motion Strength:* ${data.prompts.runwayGen3?.motionStrength || 4}

### C. Kling AI 1.5 Sozlamalari:
\`\`\`
${data.prompts.klingAi?.prompt || data.prompts.soraPrompt}
\`\`\`
- Pan: ${data.prompts.klingAi?.cameraSettings?.pan || '0'}
- Tilt: ${data.prompts.klingAi?.cameraSettings?.tilt || '0'}
- Zoom: ${data.prompts.klingAi?.cameraSettings?.zoom || '+2.0'}
- Roll: ${data.prompts.klingAi?.cameraSettings?.roll || '0'}
- Motion Brush: ${data.prompts.klingAi?.motionBrushTips || ''}

### D. Video Negative Prompt:
\`\`\`
${data.prompts.videoNegativePrompt || 'morphing faces, bad anatomy, warping background, jerky camera movement'}
\`\`\`

### E. O'zbekcha Rejissura & Operator Vazifasi:
${data.prompts.uzbekShootingScript}

*Yaratildi: MayPrompt AI Studio*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MayPrompt-${data.summaryTitle.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickRefinements = [
    "Kechki shahar foni va neon yoritish qo'sh",
    "Kamera tezroq yaqinlashsin (Fast push-in)",
    "Qahramon erkak kishiga o'zgartirilsin",
    "Anime / Makoto Shinkai kinematografik uslubi",
    "Smartfonda olish uchun batafsilroq ko'rsatma ber",
  ];

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim() || isRefining) return;
    await onRefinePrompt(refineText.trim());
    setRefineText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                {data.genre || 'Kinematografik'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
              {data.summaryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              {data.overview}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors border border-zinc-200"
              title="Markdown hisobotini saqlash"
            >
              <Download className="w-3.5 h-3.5" />
              Hisobot (.md)
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm shadow-orange-500/20 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Yangi tahlil
            </button>
          </div>
        </div>

        {/* Color Palette & Tags */}
        <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Palitra:</span>
            <div className="flex items-center gap-1.5">
              {data.lightingAndAtmosphere.palette?.map((hex, i) => (
                <button
                  key={i}
                  onClick={() => handleCopy(hex, `hex-${i}`)}
                  className="group relative w-6 h-6 rounded-md shadow-xs border border-black/10 transition-transform hover:scale-110"
                  style={{ backgroundColor: hex }}
                  title={`${hex} - nusxalash uchun bosing`}
                >
                  <span className="sr-only">{hex}</span>
                  {copiedKey === `hex-${i}` && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                      Nusxalandi!
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {data.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split: Visual Preview & Tabbed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Shot Frames */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-zinc-950 rounded-2xl p-3 border border-zinc-800 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-orange-400" />
                Tahlil qilingan kadr
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {activeImageIndex + 1} / {activeImages.length}
              </span>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              {activeImages[activeImageIndex] ? (
                <img
                  src={activeImages[activeImageIndex]}
                  alt="Analizlangan kadr"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-zinc-500">Kadr mavjud emas</div>
              )}

              {/* Angle Tag Overlay */}
              <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-[10px] font-semibold text-orange-300 px-2 py-0.5 rounded-md border border-white/10">
                {data.rakursAndCamera.angle}
              </div>

              {/* Lens Tag Overlay */}
              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded-md border border-white/10">
                {data.rakursAndCamera.focalLength}
              </div>
            </div>

            {/* Thumbnail selector if multiple frames */}
            {activeImages.length > 1 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {activeImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-orange-500 scale-105'
                        : 'border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Specs Pill */}
            <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-left">
              <div className="bg-zinc-900/90 p-2 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 block">Kadr masshtabi:</span>
                <span className="text-xs font-semibold text-zinc-200 line-clamp-1">
                  {data.rakursAndCamera.shotType}
                </span>
              </div>
              <div className="bg-zinc-900/90 p-2 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 block">Yoritish turi:</span>
                <span className="text-xs font-semibold text-amber-300 line-clamp-1">
                  {data.lightingAndAtmosphere.style}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Detailed Analysis & Prompts */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl overflow-x-auto border border-zinc-200">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'prompts'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Video Replikatsiya (Runway, Kling, MJ)
            </button>

            <button
              onClick={() => setActiveTab('rakurs')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'rakurs'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-orange-500" />
              Kamera &amp; Rakurs
            </button>

            <button
              onClick={() => setActiveTab('face')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'face'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-500" />
              Yuz &amp; Poza (Feys)
            </button>

            <button
              onClick={() => setActiveTab('lighting')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'lighting'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Yoritish &amp; Muhit
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'blueprint'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              Mobil Syomka Qo'llanmasi
            </button>
          </div>

          {/* TAB 1: AI VIDEO REPLIKATSIYA MARKAZI */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              {/* AI Video Replicator Sub-nav */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-3 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                      Real Videoni AI-da 100% O'xshatish Rejimi
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Generatorni tanlang:
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setGeneratorSubTab('i2v')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      generatorSubTab === 'i2v'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    🌟 I2V Master (Eng aniq usul)
                  </button>

                  <button
                    onClick={() => setGeneratorSubTab('runway')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      generatorSubTab === 'runway'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Runway Gen-3
                  </button>

                  <button
                    onClick={() => setGeneratorSubTab('kling')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      generatorSubTab === 'kling'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Kling AI 1.5/2.0
                  </button>

                  <button
                    onClick={() => setGeneratorSubTab('sora_flux')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      generatorSubTab === 'sora_flux'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    Sora &amp; Flux.1
                  </button>

                  <button
                    onClick={() => setGeneratorSubTab('workflow')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      generatorSubTab === 'workflow'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    AI Workflow &amp; Negative
                  </button>
                </div>
              </div>

              {/* SUBTAB 1: IMAGE-TO-VIDEO MASTER WORKFLOW */}
              {generatorSubTab === 'i2v' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 text-xs sm:text-sm text-violet-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-violet-900">
                      <Sparkles className="w-4 h-4 text-violet-600" />
                      Nima uchun I2V (Image-to-Video) eng mukammal usul?
                    </div>
                    <p className="text-xs text-violet-900/90 leading-relaxed">
                      AI videomakerlar real videodagi <strong>rakurs, yuz mimikasi, ko'z qarashi va yorug'likni 100% o'xshatish</strong> uchun to'g'ridan-to'g'ri matndan emas, avval <strong>1-kadri (Starting Frame)</strong>ni Midjourney yoki Flux-da yaratib, so'ngra Runway yoki Kling-ga rasm sifatida yuklab harakatlantiradilar. Bu kamera buzilishlarini 95% ga kamaytiradi.
                    </p>
                  </div>

                  {/* Step 1: Starting Keyframe Prompt */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] font-extrabold flex items-center justify-center">
                          1
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                          Boshlang'ich Kadr Promti (Midjourney v6.1 / Flux.1):
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(data.prompts.imageToVideo?.firstFramePrompt || data.prompts.midjourney, 'i2v-frame')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-colors border border-violet-200"
                      >
                        {copiedKey === 'i2v-frame' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kadr promtidan nusxa</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 break-words select-all">
                      {data.prompts.imageToVideo?.firstFramePrompt || data.prompts.midjourney}
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                      <span className="font-semibold text-zinc-700">Tavsiya:</span>
                      Midjourney-da <code>--ar 9:16 --v 6.1 --style raw</code> parametrlarida generatsiya qiling.
                    </div>
                  </div>

                  {/* Step 2: I2V Motion Prompt */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold flex items-center justify-center">
                          2
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                          Harakat Promti (I2V Motion Prompt — Runway &amp; Kling uchun):
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(data.prompts.imageToVideo?.motionPrompt || data.prompts.soraPrompt, 'i2v-motion')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors border border-rose-200"
                      >
                        {copiedKey === 'i2v-motion' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Harakat promtidan nusxa</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 break-words select-all">
                      {data.prompts.imageToVideo?.motionPrompt || data.prompts.soraPrompt}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Ushbu ko'rsatmani rasm yuklanganidan so'ng AI video generatorining matn qutisiga (Prompt box) joylashtiring.
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: RUNWAY GEN-3 ALPHA */}
              {generatorSubTab === 'runway' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                        <h4 className="text-sm font-bold text-zinc-900">
                          Runway Gen-3 Alpha Prompti (Kamera Teglari Bilan)
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(data.prompts.runwayGen3?.prompt || data.prompts.soraPrompt, 'runway-copy')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === 'runway-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 break-words select-all">
                      {data.prompts.runwayGen3?.prompt || data.prompts.soraPrompt}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-zinc-500 font-bold block uppercase">
                            Kamera Harakat Tegi (Camera Move Tag):
                          </span>
                          <button
                            onClick={() => handleCopy(data.prompts.runwayGen3?.cameraMovementTag || data.rakursAndCamera.movement, 'runway-tag')}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-200/80 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold transition-colors"
                          >
                            {copiedKey === 'runway-tag' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Nusxalandi!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Nusxa olish</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="text-xs font-bold text-rose-600 block mt-1">
                          {data.prompts.runwayGen3?.cameraMovementTag || data.rakursAndCamera.movement}
                        </code>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                        <span className="text-[11px] text-zinc-500 font-bold block uppercase">
                          Tavsiya Etilgan Harakat Kuchi (Motion Strength):
                        </span>
                        <span className="text-xs font-bold text-zinc-900 block mt-1">
                          {data.prompts.runwayGen3?.motionStrength || 4} / 10 (Haddan tashqari harakat yuzni buzmasligi uchun)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: KLING AI 1.5 / 2.0 */}
              {generatorSubTab === 'kling' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500" />
                        <h4 className="text-sm font-bold text-zinc-900">
                          Kling AI 1.5 / 2.0 Prompti va Kamera Sozlamalari
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(data.prompts.klingAi?.prompt || data.prompts.soraPrompt, 'kling-copy')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === 'kling-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 break-words select-all">
                      {data.prompts.klingAi?.prompt || data.prompts.soraPrompt}
                    </div>

                    {/* Kling Camera Controls Grid */}
                    <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-blue-600" />
                          Kling AI Kamera Sliderlari Qiymati:
                        </span>
                        <button
                          onClick={() => {
                            const settings = `Pan: ${data.prompts.klingAi?.cameraSettings?.pan || '0'}, Tilt: ${data.prompts.klingAi?.cameraSettings?.tilt || '-1.0'}, Zoom: ${data.prompts.klingAi?.cameraSettings?.zoom || '+2.0'}, Roll: ${data.prompts.klingAi?.cameraSettings?.roll || '0'}`;
                            handleCopy(settings, 'kling-sliders');
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-semibold transition-colors"
                        >
                          {copiedKey === 'kling-sliders' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Nusxalandi!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sozlamalardan nusxa</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <span className="text-[10px] text-zinc-500 block uppercase">Pan (Gorizontal)</span>
                          <span className="text-xs font-mono font-bold text-blue-700">
                            {data.prompts.klingAi?.cameraSettings?.pan || '0'}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <span className="text-[10px] text-zinc-500 block uppercase">Tilt (Vertikal)</span>
                          <span className="text-xs font-mono font-bold text-blue-700">
                            {data.prompts.klingAi?.cameraSettings?.tilt || '-1.0'}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <span className="text-[10px] text-zinc-500 block uppercase">Zoom (Yaqinlashish)</span>
                          <span className="text-xs font-mono font-bold text-blue-700">
                            {data.prompts.klingAi?.cameraSettings?.zoom || '+2.0'}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <span className="text-[10px] text-zinc-500 block uppercase">Roll (Og'ish)</span>
                          <span className="text-xs font-mono font-bold text-blue-700">
                            {data.prompts.klingAi?.cameraSettings?.roll || '0'}
                          </span>
                        </div>
                      </div>

                      {/* Motion Brush Advice */}
                      {data.prompts.klingAi?.motionBrushTips && (
                        <div className="text-[11px] text-blue-900 pt-1 leading-relaxed">
                          <strong>Motion Brush Tavsiyasi:</strong> {data.prompts.klingAi.motionBrushTips}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: SORA & FLUX.1 */}
              {generatorSubTab === 'sora_flux' && (
                <div className="space-y-4">
                  {/* Sora */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        OpenAI Sora &amp; Luma Dream Machine (Vaqt Bo'yicha Ketma-ketlik):
                      </h4>
                      <button
                        onClick={() => handleCopy(data.prompts.soraPrompt, 'sora-copy')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === 'sora-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 break-words select-all">
                      {data.prompts.soraPrompt}
                    </div>
                  </div>

                  {/* Flux.1 */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        Flux.1 Fotorealistik To'qimalar &amp; Mikro-Tafsilotlar:
                      </h4>
                      <button
                        onClick={() => handleCopy(data.prompts.fluxPrompt || data.prompts.midjourney, 'flux-copy')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === 'flux-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 break-words select-all">
                      {data.prompts.fluxPrompt || data.prompts.midjourney}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 5: AI WORKFLOW & NEGATIVE PROMPT */}
              {generatorSubTab === 'workflow' && (
                <div className="space-y-4">
                  {/* Negative Prompt */}
                  <div className="bg-rose-50/70 rounded-2xl border border-rose-200 p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                        <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                          🛡️ AI Video Negative Prompt (Yuz buzilishi va g'alati harakatlarga qarshi):
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(data.prompts.videoNegativePrompt || 'morphing faces, bad anatomy, warping background, jerky camera movement', 'neg-copy')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-200/80 hover:bg-rose-200 text-rose-900 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === 'neg-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="text-emerald-800">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-zinc-950 text-rose-300 p-3 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800 select-all">
                      {data.prompts.videoNegativePrompt || 'morphing faces, bad anatomy, warping background, jerky camera movement, plastic skin, flickering, distorted hands'}
                    </div>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      Ushbu salbiy promptni Runway, Kling yoki Luma-ning "Negative Prompt" bo'limiga kiritish kadrda sun'iy deformatsiyalarni oldini oladi.
                    </p>
                  </div>

                  {/* Workflow Steps */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-500" />
                        Haqiqiy Videoni AI-da Qayta Yaratish (Replication Workflow):
                      </h4>
                      <button
                        onClick={() => {
                          const workflowList = (data.aiReplicationGuide?.recommendedWorkflow || [
                            "1-qadam: Berilgan Midjourney yoki Flux prompti orqali videodagi 1-kadrni (Starting Frame) hosil qiling.",
                            "2-qadam: Kadrni Runway Gen-3 yoki Kling AI-ning 'Image-to-Video' bo'limiga yuklang.",
                            "3-qadam: Tavsiya etilgan kamera sozlamalari va Motion Promptni kiriting.",
                            "4-qadam: Chiqqan videoni CapCut yoki Topaz AI-da sifatini oshiring."
                          ]).join('\n');
                          handleCopy(workflowList, 'workflow-steps');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === 'workflow-steps' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(data.aiReplicationGuide?.recommendedWorkflow || [
                        "1-qadam: Berilgan Midjourney yoki Flux prompti orqali videodagi 1-kadrni (Starting Frame) hosil qiling.",
                        "2-qadam: Kadrni Runway Gen-3 yoki Kling AI-ning 'Image-to-Video' bo'limiga yuklang.",
                        "3-qadam: Tavsiya etilgan kamera sozlamalari va Motion Promptni kiriting.",
                        "4-qadam: Chiqqan videoni CapCut yoki Topaz AI-da sifatini oshiring."
                      ]).map((step, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2 text-xs text-zinc-800">
                          <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>

                    {data.aiReplicationGuide?.cameraPhysicsAdvice && (
                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
                        <strong>Kamera Fizikasi Tavsiyasi:</strong> {data.aiReplicationGuide.cameraPhysicsAdvice}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Uzbek Shotlist Script (Direct View) */}
              <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold text-amber-950">
                      O'zbek Tilidagi Rejissura &amp; Operator Vazifasi
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopy(data.prompts.uzbekShootingScript, 'uz')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
                  >
                    {copiedKey === 'uz' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800">Nusxalandi!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nusxa olish</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-wrap font-sans">
                  {data.prompts.uzbekShootingScript}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: KAMERA & RAKURS */}
          {activeTab === 'rakurs' && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-500" />
                Kamera Parametrlari &amp; Rakurs Tahlili
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase tracking-wider">
                    Rakurs Burchagi (Angle)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.rakursAndCamera.angle}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Kamera balandligi va ob'ektga nisbatan yo'nalishi.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase tracking-wider">
                    Kadr Masshtabi (Shot Type)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.rakursAndCamera.shotType}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Ekstremal yaqin, o'rta yoki umumiy kadr chegarasi.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase tracking-wider">
                    Kamera Harakati (Movement)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.rakursAndCamera.movement}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Dolly, Pan, Tilt, Steadicam yoki Handheld dinamikasi.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase tracking-wider">
                    Optika &amp; Linza (Focal Length)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.rakursAndCamera.focalLength}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Millimetr masofasi va optik xususiyati (anamorphic, prime).
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase tracking-wider">
                    Maydon Chuqurligi (Depth of Field)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.rakursAndCamera.depthOfField}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Bokeh va fokus sohasining tarqalishi.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase tracking-wider">
                    Kompozitsiya Qoidasi
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.rakursAndCamera.composition}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Kadr ichidagi geometrik chiziqlar va mutanosiblik.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: YUZ & POZA */}
          {activeTab === 'face' && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Yuz Mimikasi, Nigoh &amp; Obyekt Pozasi
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[11px] font-semibold text-blue-700 block uppercase tracking-wider">
                    Yuz Mimikasi &amp; Hissiy Ifoda
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-900 mt-1 font-medium leading-relaxed">
                    {data.faceAndSubject.expression}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    Boshning Burilishi &amp; Nigoh Yo'nalishi
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-900 mt-1 leading-relaxed">
                    {data.faceAndSubject.headTiltAndGaze}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    Gavda Holati, Tana Tili &amp; Qo'llar Harakati
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-900 mt-1 leading-relaxed">
                    {data.faceAndSubject.poseAndBodyLanguage}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    Kiyim, Uslub &amp; Vizual Detallar
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-900 mt-1 leading-relaxed">
                    {data.faceAndSubject.stylingAndClothing}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: YORITISH & MUHIT */}
          {activeTab === 'lighting' && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Yoritish Sxemasi &amp; Ranglar Atmosferasi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-semibold text-amber-700 block uppercase tracking-wider">
                    Yoritish Uslubi
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.lightingAndAtmosphere.style}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    Color Grading &amp; Rang Tusi
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                    {data.lightingAndAtmosphere.colorGrade}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    Asosiy Nur (Key Light)
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-800 mt-1">
                    {data.lightingAndAtmosphere.keyLight}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    To'ldiruvchi Nur (Fill Light)
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-800 mt-1">
                    {data.lightingAndAtmosphere.fillLight}
                  </p>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <span className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
                    Orqa Fon va Kontur Nurlari (Rim / Backlight)
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-800 mt-1">
                    {data.lightingAndAtmosphere.backgroundLight}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYOMKA BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  Real Hayotda Ushbu Kadrni Suratga Olish Rejasi
                </h3>
                <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                  Instagram Reels / TikTok
                </span>
              </div>

              {/* Recommended Camera Settings */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Tavsiya Etilgan Kamera Sozlamalari:
                </span>
                <p className="text-xs sm:text-sm font-mono text-emerald-950 font-bold mt-1">
                  {data.syomkaBlueprint.recommendedSettings}
                </p>
              </div>

              {/* Step by step mobile tips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-800 block">
                  Mobil Telefonda O'xshatish Sirlari:
                </span>
                <div className="space-y-2">
                  {data.syomkaBlueprint.mobileFilmingTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIY Lighting */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Byudjetli yoki DIY Yoritish Usuli:
                </span>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {data.syomkaBlueprint.diyLighting}
                </p>
              </div>

              {/* Director's Advice */}
              <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800">
                <span className="text-xs font-bold text-orange-400 block mb-1">
                  Rejissyor &amp; Operator Maslahati:
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {data.syomkaBlueprint.directorAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Prompt Refiner / Customizer Bar */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-2xl border border-orange-200/80 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs sm:text-sm font-bold text-orange-950">
                Promptni Moslashtirish &amp; O'zgartirish (AI Refinement):
              </h4>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {quickRefinements.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onRefinePrompt(chip)}
                  disabled={isRefining}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100/80 text-zinc-700 hover:text-orange-900 rounded-lg text-[11px] font-medium border border-orange-200/60 transition-colors shadow-2xs"
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleRefineSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="Masalan: 'Qahramon boshiga kepka kiysin va kadr sekin aylansin'..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-orange-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                disabled={isRefining}
              />
              <button
                type="submit"
                disabled={!refineText.trim() || isRefining}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-orange-600/20 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                {isRefining ? 'Yangilanmoqda...' : "O'zgartirish"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
