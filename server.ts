import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy Gemini client helper
function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY muhit o'zgaruvchisi topilmadi. Iltimos, Settings > Secrets panelidan sozlang yoki o'z shaxsiy kalitingizni kiriting.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory server-side quota tracking per user email
const serverQuotaStore = new Map<string, { date: string; count: number }>();

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "MayPrompt API" });
});

// Shot analysis endpoint
app.post("/api/analyze-shot", async (req, res) => {
  try {
    const {
      images,
      focusMode,
      customNote,
      styleModifier,
      preferredLanguage,
      userEmail,
      userPlan = 'free',
      customApiKey,
    } = req.body;

    // Enforce quota if user has no custom API key and is not Pro
    const effectivePlan = customApiKey?.trim() ? 'pro' : userPlan;
    const todayStr = new Date().toISOString().split('T')[0];

    if (effectivePlan !== 'pro') {
      const dailyMax = effectivePlan === 'plus' ? 30 : 5;
      const userKey = (userEmail || 'guest').toLowerCase().trim();
      const currentUsage = serverQuotaStore.get(userKey);

      if (currentUsage && currentUsage.date === todayStr) {
        if (currentUsage.count >= dailyMax) {
          return res.status(429).json({
            error: `Bugungi ${effectivePlan === 'plus' ? 'Gemini Plus (30)' : 'Gemini Free (5)'} tahlil limitingiz to'ldi (${currentUsage.count}/${dailyMax}). Cheklovsiz davom etish uchun Gemini Pro tarifiga o'ting yoki o'z shaxsiy Gemini API kalitingizni ulang.`,
            limitReached: true,
            plan: effectivePlan,
            limit: dailyMax,
            used: currentUsage.count,
          });
        }
        serverQuotaStore.set(userKey, { date: todayStr, count: currentUsage.count + 1 });
      } else {
        serverQuotaStore.set(userKey, { date: todayStr, count: 1 });
      }
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Hech bo'lmaganda bitta kadr (rasm) yuklanishi lozim." });
    }

    const ai = getGeminiClient(customApiKey);

    // Prepare multimodal parts from uploaded video frames/images
    const parts: any[] = [];

    for (let i = 0; i < Math.min(images.length, 5); i++) {
      const img = images[i];
      const dataUrl = typeof img === "string" ? img : img.dataUrl;
      if (!dataUrl) continue;

      const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    if (parts.length === 0) {
      return res.status(400).json({ error: "Rasm formatida xatolik yuz berdi. Iltimos qaytadan yuklang." });
    }

    const systemPrompt = `Siz MayPrompt - eng ilg'or kinooperator, rejissyor va AI Video Prompt Engineering (Runway Gen-3, Kling AI, Luma Dream Machine, OpenAI Sora, Midjourney v6.1, Flux.1) bo'yicha dunyo darajasidagi yetakchi mutaxassissiz.

Foydalanuvchi maqsadi: Real hayotda suratga olingan haqiqiy video yoki kadrlarni ko'rib, AI orqali (AI kontentmakerlar uchun) xuddi shu video kabi:
- Bir xil kamera rakursi (Camera angle, pitch, roll, height)
- Bir xil optika (Focal length, anamorphic bokeh, shallow depth of field)
- Bir xil kamera harakati (Dolly, Pan, Tilt, Zoom, Orbit, Crane, Handheld shakiness)
- Bir xil qahramonning feysi, nigohi, yuz mimikasi va gavda pozasi
- Bir xil yoritish sxemasi (Key, fill, rim light, color grade)
aniq, 100% replikatsiya qiluvchi professional AI promtlari va sozlamalarini yaratib berish.

Har bir tahlilda AI Video Makerlar uchun eng muhim 2 ta professional usulni taqdim eting:
1. IMAGE-TO-VIDEO (I2V) USULI (Eng yuqori 1-ga-1 o'xshashlik kafolati):
   - 1-kadr (Starting Frame): Midjourney v6.1 yoki Flux.1 uchun fotorealistik promt, bu orqali aynan o'sha kadr, poza, mimika va yorug'lik hosil qilinadi.
   - Harakat Promti (I2V Motion Prompt): Runway Gen-3 / Kling 1.5 / Luma da yuklangan rasm aynan videodagi kabi harakatlanishi uchun qisqa va qat'iy ko'rsatmalar.
2. TEXT-TO-VIDEO (T2V) USULI:
   - Runway Gen-3 Alpha Sintaksisi: [Camera Move: ...], [Lighting: ...], [Framing: ...], Action: ...
   - Kling AI Formati: Maxsus kamera harakat sliderlari (Pan, Tilt, Zoom, Roll) va Motion Brush yo'riqnomasi.
   - Sora / Luma Timeline: Vaqt kesimidagi harakat (0-2s, 2-4s...).
   - AI Video Negative Prompt: Morphing, yuz buzilishi (melting face), jello effekti, g'alati qo'l harakatlarini bloklash.

Foydalanuvchining qo'shimcha istagi: ${customNote || "Yo'q"}
Uslub o'zgartirish talabi: ${styleModifier || "Asliga sodiq (original)"}
Til: O'zbek tili (tahlil, yo'riqnomalar va tushuntirishlar o'zbek tilida, AI promptlari esa Midjourney, Flux, Runway, Kling uchun xalqaro ingliz tilida eng yuqori sifatda).

Javobni FAQAT quyidagi JSON formatida qaytaring:
{
  "summaryTitle": "Qisqa, jozibador sarlavha (masalan: 'Kinematografik Neon Portret: 50mm Sayoz Fokusda')",
  "genre": "Janr / Uslub (masalan: 'Kinematografik Drama / Cyberpunk')",
  "overview": "Videoning vizual g'oyasi, kamera atmosferasi va aktyor holati haqida chuqur 2-3 jumlalik tahlil",
  "rakursAndCamera": {
    "angle": "Kamera burchagi (rakurs) - masalan: 'Low-angle (pastdan yuqoriga 25 gradus qiya)'",
    "shotType": "Kadr turi - masalan: 'Medium Close-up (MCU)'",
    "movement": "Kamera harakati - masalan: 'Sekin oldinga siljish (Slow Dolly In) va mayin burilish'",
    "focalLength": "Fokus masofasi va optika - masalan: '50mm f/1.4 Anamorphic linza'",
    "depthOfField": "Fokus chuqurligi - masalan: 'Juda sayoz (f/1.4), orqa fon to'liq xira (creamy bokeh)'",
    "composition": "Kompozitsiya - masalan: 'Uchdan bir qoidasi (Rule of thirds), markazlashtirilgan nigoh'"
  },
  "lightingAndAtmosphere": {
    "style": "Yoritish uslubi - masalan: 'Moody Cinematic Chiaroscuro'",
    "keyLight": "Asosiy yorug'lik (Key light) joylashuvi va xususiyati",
    "fillLight": "To'ldiruvchi yorug'lik (Fill light) holati",
    "backgroundLight": "Orqa fon va kontur nurlari (Rim/Backlight)",
    "colorGrade": "Ranglar gammasi va tusi (Color grading)",
    "palette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4"]
  },
  "faceAndSubject": {
    "subjectDescription": "Qahramon yoki asosiy ob'ekt tavsifi (yoshi, ko'rinishi, xarakteri)",
    "expression": "Yuz mimikasi va emotsional holati (sirli, qat'iyatli, sokin)",
    "headTiltAndGaze": "Boshning burilishi va nigoh yo'nalishi (kamera linzasiga yoki 45 gradus chetga)",
    "poseAndBodyLanguage": "Gavda holati, yelka balandligi, tana tili va qo'llar",
    "stylingAndClothing": "Kiyim, soch turmagi va aksessuarlar"
  },
  "syomkaBlueprint": {
    "mobileFilmingTips": [
      "Telefon orqali suratga olish bo'yicha 1-maslahat",
      "2-maslahat",
      "3-maslahat"
    ],
    "recommendedSettings": "Kamera sozlamalari (Masalan: 4K 24fps / 60fps, 1/50 shutter, ISO 100-200, 2x telephoto)",
    "diyLighting": "Byudjetli yoki xonadagi vositalar bilan yorug'likni taqlid qilish usuli",
    "directorAdvice": "Rejissyor va operator uchun maxsus ekspert maslahati"
  },
  "prompts": {
    "midjourney": "Masterpiece photorealistic starting keyframe prompt for Midjourney v6.1 with cinematic lighting, exact camera angle, focal length, color grading, photorealism --ar 9:16 --v 6.1 --style raw",
    "fluxPrompt": "Flux.1 high-end photorealistic starting frame prompt capturing raw micro-textures, authentic skin pores, exact facial expression and head tilt",
    "soraPrompt": "Cinematic video generation prompt for Sora with exact timeline: Begins with [initial framing and pose], smoothly transitions with [camera movement], maintaining actor's gaze and authentic lighting",
    "runwayGen3": {
      "prompt": "[Camera Move: Low angle, slow smooth dolly forward] [Lighting: Cinematic moody rim light] A photorealistic sequence of the subject in exact pose, subtle head turn, steady gaze, film grain, 4k",
      "cameraMovementTag": "Low angle, Slow Dolly-in, Steady Cam",
      "motionStrength": 4
    },
    "klingAi": {
      "prompt": "Cinematic 4k video, subject maintaining exact facial expression and posture while camera performs subtle tracking motion, lifelike physics, photorealistic textures",
      "cameraSettings": {
        "pan": "0 (Yoki kerakli qiymat, masalan: +1.5)",
        "tilt": "-1.0 (Pastdan yuqoriga qarash burchagi)",
        "zoom": "+2.0 (Sekin yaqinlashish)",
        "roll": "0"
      },
      "motionBrushTips": "Kling AI Motion Brush: Yuz va ko'zlarga 2-darajali mayin harakat, soch tolalari va kiyimga tabiiy shamol tebranishi bering."
    },
    "imageToVideo": {
      "firstFramePrompt": "Starting image generation prompt (Midjourney/Flux) for generating the exact keyframe to upload into Runway or Kling",
      "motionPrompt": "Direct motion instruction to feed into Image-to-Video (I2V) box: 'Subject slowly raises chin, subtle breathing and blinking, camera slowly glides forward by 10%, maintaining crisp 50mm focus'",
      "recommendedTool": "Runway Gen-3 Alpha (I2V) yoki Kling AI 1.5 Professional Mode"
    },
    "videoNegativePrompt": "morphing faces, distorted hands, bad anatomy, warping background, jerky camera movement, plastic skin, low fps, blurry, oversaturated, watermark, sudden glitches",
    "uzbekShootingScript": "Operator, aktyor va montajchi uchun o'zbek tilidagi aniq syomka topshirig'i (Shotlist stsenariysi)"
  },
  "aiReplicationGuide": {
    "strategyOverview": "Ushbu videoni sun'iy intellektda 1-ga-1 takrorlash bo'yicha bosh strategiya tahlili",
    "recommendedWorkflow": [
      "1-qadam: Berilgan Midjourney yoki Flux prompti orqali videodagi boshlang'ich kadrni (Starting Frame) generatsiya qiling.",
      "2-qadam: Chiqqan eng yaxshi kadrni Runway Gen-3 yoki Kling AI-ning 'Image-to-Video' bo'limiga yuklang.",
      "3-qadam: Tavsiya etilgan kamera sozlamalari va Motion Promptni kiriting.",
      "4-qadam: Chiqqan videoni Topaz Video AI yoki CapCut-da 60fps va 4K sifatga ko'taring."
    ],
    "cameraPhysicsAdvice": "AI videoda kamera fizikasini buzilmasdan saqlash uchun muhim operatorlik sirlari"
  },
  "tags": ["Low-angle", "Cinematic", "50mm", "Reels", "Runway-Gen3", "Kling-AI", "I2V-Replication"]
}`;

    parts.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const responseText = response.text?.trim() || "{}";
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Clean potential backticks
      const clean = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      data = JSON.parse(clean);
    }

    const result = {
      id: "shot-" + Date.now(),
      timestamp: Date.now(),
      ...data,
    };

    res.json(result);
  } catch (error: any) {
    console.error("Error analyzing shot:", error);
    res.status(500).json({
      error: error.message || "Tahlil jarayonida kutilmagan xatolik yuz berdi.",
    });
  }
});

// Prompt refinement endpoint (e.g. changing style, adding specific camera directions)
app.post("/api/refine-prompt", async (req, res) => {
  try {
    const { currentData, instruction, customApiKey } = req.body;
    if (!currentData || !instruction) {
      return res.status(400).json({ error: "Kerakli ma'lumotlar yetarli emas." });
    }

    const ai = getGeminiClient(customApiKey);
    const promptText = `Siz MayPrompt mutaxassisisiz. Mavjud tahlil ma'lumotlari:
${JSON.stringify(currentData, null, 2)}

Foydalanuvchi quyidagi o'zgartirishni so'ramoqda:
"${instruction}"

Iltimos, ushbu talab bo'yicha promtlarni va AI Video replikatsiya sozlamalarini yangilang va JSON ko'rinishida qaytaring:
{
  "updatedPrompts": {
    "midjourney": "...",
    "fluxPrompt": "...",
    "soraPrompt": "...",
    "runwayGen3": {
      "prompt": "...",
      "cameraMovementTag": "...",
      "motionStrength": 4
    },
    "klingAi": {
      "prompt": "...",
      "cameraSettings": {
        "pan": "...",
        "tilt": "...",
        "zoom": "...",
        "roll": "..."
      },
      "motionBrushTips": "..."
    },
    "imageToVideo": {
      "firstFramePrompt": "...",
      "motionPrompt": "...",
      "recommendedTool": "..."
    },
    "videoNegativePrompt": "...",
    "uzbekShootingScript": "..."
  },
  "explanation": "Qanday o'zgartirishlar kiritilgani haqida o'zbek tilida qisqa izoh"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error refining prompt:", error);
    res.status(500).json({ error: error.message || "Tahrirlashda xatolik yuz berdi." });
  }
});

// ==========================================
// MARKETING KNOWLEDGE BASE (BOOKS / PDF SKILLS)
// ==========================================
interface ServerMarketingBook {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  keyInsights: string[];
  contentSnippet: string;
  uploadedAt: string;
  active: boolean;
}

const marketingKnowledgeBase: ServerMarketingBook[] = [
  {
    id: "book-1",
    title: "Viral Reels & Hook Psixologiyasi (3 Soniyalik Qoida)",
    author: "Alex Hormozi & Brendan Kane",
    category: "Reels & Shorts Viralligi",
    summary: "Videoning dastlabki 2.5 soniyasida inson dopaminini ushlab qoluvchi vizual kutilmagan harakat (Pattern Interrupt) va 'Curiosity Gap' yaratish formulasi.",
    keyInsights: [
      "1. Pattern Interrupt: Harakat orqaga yoki g'ayritabiiy burchakdan boshlanishi (Kamera pastdan tez ko'tarilishi)",
      "2. Aniq muammo yoki daxshatli savol: Birinchi jumla umumiy salomlashish emas, balki to'g'ridan-to'g'ri tomoshabin og'rig'iga teginishi kerak",
      "3. Micro-pacing: Har 2-3 soniyada kamera rakursi yoki kadr masshtabi (Cut-in / Zoom) o'zgarishi lozim",
      "4. Sound Design: Dastlabki kadrda quloqqa sezilarli whoosh yoki kutilmagan sfx bo'lishi saqlanish foizini 40% ga oshiradi"
    ],
    contentSnippet: "Reels va qisqa videolarda tomoshabin 1-soniyada videoda qolish-qolmaslikni hal qiladi. Shu sababli boshlang'ich kadr kameraning eng keskin rakursida (Low Angle + Whip Pan) olinishi va yuzdagi emotsiya haddan tashqari ekspressiv bo'lishi shart.",
    uploadedAt: "2026-03-10",
    active: true,
  },
  {
    id: "book-2",
    title: "Kopirayting va Sotuv Voronkasi (Storytelling Sales)",
    author: "Russell Brunson & Donald Miller",
    category: "Sotuv va Konversiya",
    summary: "Kontentmaker shunchaki chiroyli video emas, balki tomoshabinni 'Qahramon' qilib, mahsulotni uning 'Yo'lboshchisi' (Guide) sifatida ko'rsatishi kerak bo'lgan SB7 tizimi.",
    keyInsights: [
      "1. Character & Problem: Mijoz xohlayotgan narsa va unga xalaqit berayotgan ichki/tashqi to'siq",
      "2. Guide with Empathy & Authority: Kontentmaker o'zini xaloskor emas, tajribali yo'l ko'rsatuvchi sifatida tutishi",
      "3. 3-bosqichli aniq reja (Call-to-Action): 'Profil shapkasidagi havola', 'Izohda PROMT deb yozing'",
      "4. Stakes: Agar ushbu xatoni davom ettirsa nima yo'qotishi haqida ogohlantirish"
    ],
    contentSnippet: "Har bir reels videoning oxiri aniq bitta mikro-harakatga chaqirishi kerak. 'Obuna bo'ling, layk bosing, do'stlarga ulashing' kabi 3 ta narsani birdan so'rash konversiyani 70% ga tushiradi. Faqat bitta chaqiriq: 'Izohda KOD deb yozing'!",
    uploadedAt: "2026-03-12",
    active: true,
  },
  {
    id: "book-3",
    title: "Kinooperatorlik: Rakurs, Yorug'lik va Rang Psixologiyasi",
    author: "Blain Brown & Roger Deakins",
    category: "Syomka & Rejissura",
    summary: "Kamera burchaklarining psixologik ta'siri: pastdan olish (qudrat), yuqoridan olish (ojizlik), Golland burchagi (xavotir va sir). Rim light va rang kontrastining mahsulot idrokiga ta'siri.",
    keyInsights: [
      "1. Dutch Angle (15-30 daraja qiyalik) tomoshabinda shubha va intriga uyg'otadi",
      "2. Rim/Hair light orqa fondan subyektni ajratib, mobil videoga 10,000$ lik kino sifati illyuziyasini beradi",
      "3. Teal & Orange yoki Warm/Cool kontrasti inson yuzini tabiiy jozibador qiladi",
      "4. Focal Length: 35mm baquvvat hikoya uchun, 85mm f/1.4 esa orqa fonni erigan qilib xaridor e'tiborini mahsulotga mixlash uchun"
    ],
    contentSnippet: "Kamera faqat harakatlanuvchi obyekt bor joyda harakat qilishi kerak (Motivated Camera Movement). Bejizga harakatlanayotgan kamera arzon taassurot qoldiradi.",
    uploadedAt: "2026-03-15",
    active: true,
  }
];

// Admin Knowledge Base Endpoints
app.get("/api/admin/books", (_req, res) => {
  res.json({ books: marketingKnowledgeBase });
});

app.post("/api/admin/books", (req, res) => {
  const { title, author, category, summary, keyInsights, contentSnippet } = req.body;
  if (!title || !summary) {
    return res.status(400).json({ error: "Kitob nomi va qisqacha mazmuni kiritilishi shart." });
  }

  const newBook: ServerMarketingBook = {
    id: `book-${Date.now()}`,
    title: title.trim(),
    author: (author || "Marketing Eksperti").trim(),
    category: (category || "Marketing & Kontent").trim(),
    summary: summary.trim(),
    keyInsights: Array.isArray(keyInsights) && keyInsights.length > 0 ? keyInsights : [summary.trim()],
    contentSnippet: (contentSnippet || summary).trim(),
    uploadedAt: new Date().toISOString().split("T")[0],
    active: true,
  };

  marketingKnowledgeBase.unshift(newBook);
  res.json({ success: true, book: newBook, total: marketingKnowledgeBase.length });
});

app.delete("/api/admin/books/:id", (req, res) => {
  const { id } = req.params;
  const index = marketingKnowledgeBase.findIndex((b) => b.id === id);
  if (index !== -1) {
    marketingKnowledgeBase.splice(index, 1);
    res.json({ success: true, message: "Kitob bilimi o'chirildi." });
  } else {
    res.status(404).json({ error: "Kitob topilmadi." });
  }
});

// YouTube Video URL Parser & Metadata Endpoint
app.post("/api/youtube/info", (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "YouTube havolasi kiritilmadi." });
    }

    // Extract YouTube ID from various formats (shorts, watch, youtu.be, embed)
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      return res.status(400).json({ error: "Noto'g'ri YouTube havolasi formati." });
    }

    const maxresThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hqThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const mqThumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    res.json({
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnails: [maxresThumbnail, hqThumbnail, mqThumbnail],
      selectedThumbnail: maxresThumbnail,
      title: `YouTube Video (${videoId})`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "YouTube ma'lumotlarini olishda xatolik." });
  }
});

// Instagram Profile & Marketing Analysis Endpoint (Gemini + Knowledge Base RAG)
app.post("/api/instagram/analyze", async (req, res) => {
  try {
    const { profileData, customNotes, customApiKey } = req.body;
    if (!profileData || !profileData.username) {
      return res.status(400).json({ error: "Instagram profil ma'lumotlari kiritilmadi." });
    }

    const ai = getGeminiClient(customApiKey);

    // Prepare marketing books knowledge context
    const knowledgeContext = marketingKnowledgeBase
      .filter((b) => b.active)
      .map(
        (b) => `--- [KITOB/MAHORAT: ${b.title} (${b.author})] ---
Mavzu: ${b.category}
Asosiy g'oyalar:
${b.keyInsights.join("\n")}
Qoidalar: ${b.contentSnippet}`
      )
      .join("\n\n");

    const promptText = `Siz MayPrompt-ning eng yuqori darajadagi Instagram Marketing va AI Video Rejissura bosh mutaxassisisiz.
Quyida tahlil qilinayotgan Instagram profili va uning so'nggi postlari berilgan:

PROFIL MA'LUMOTLARI:
- Username: @${profileData.username}
- Ism/Nomi: ${profileData.fullName || profileData.username}
- Bio tavsifi: ${profileData.bio || "Mavjud emas"}
- Obunachilar: ${profileData.followersCount?.toLocaleString() || "12,500"}
- Obunalar: ${profileData.followingCount || 240}
- Jami postlar: ${profileData.postsCount || 85}
- O'rtacha Engagement: ${profileData.engagementRate || 4.2}%
${customNotes ? `- Foydalanuvchi qo'shimcha maqsadi: ${customNotes}` : ""}

POSTLAR HAMDA REELS MA'LUMOTLARI:
${JSON.stringify(profileData.recentPosts || [], null, 2)}

SIZ FOYDALANISHINGIZ SHART BO'LGAN ADMINNING MAXSUS MARKETING VA REJISSURA KITOBLARI (KNOWLEDGE BASE):
${knowledgeContext}

VAZIFA:
Ushbu Instagram profilining auditoriyasini, vizual estetikasini, kamchiliklarini chuqur tahlil qiling va ADMIN KITOBLARIDAGI qoidalarga (3-soniyalik hook, pattern interrupt, camera rakurslari, sotuv voronkasi) tayanib, aniq, amaliy, yuqori darajali marketing va video kontent strategiyasini JSON formatida taqdim eting.

JAVOBNI FAQAT QUYIDAGI JSON FORMATIDA QAYTARISHINGIZ SHART:
{
  "profileOverview": {
    "niche": "Profil yo'nalishi va asosiy pozitsiyasi",
    "strengths": [
      "Profilning 2-3 ta asosiy yutug'i va kuchi"
    ],
    "growthOpportunities": [
      "Profilni o'stirish uchun 2-3 ta asosiy bo'shliq va xatolar"
    ]
  },
  "contentStrategy": {
    "topFormats": [
      "Eng ko'p ko'rish va obunachi olib keluvchi 3 ta format"
    ],
    "idealPostingTimes": [
      "Ushbu auditoriya uchun eng maqbul 2 ta vaqt oralig'i"
    ],
    "lightingAndVisualTips": [
      "Kamera optikasi, yoritish va kadr estetikasi bo'yicha 3 ta maslahat"
    ]
  },
  "viralReelsIdeas": [
    {
      "title": "Reels g'oyasi nomi",
      "hook": "Dastlabki 3 soniyadagi gap va ekrandagi harakat (Pattern Interrupt)",
      "cameraShotAngle": "Kamera rakursi va optikasi (masalan: 35mm pastdan yuqoriga tez harakat)",
      "aiVideoPrompt": "Ushbu rolikni AI-da (Midjourney/Runway/Kling) generatsiya qilish uchun to'liq inglizcha promt",
      "marketingGoal": "Ushbu reels orqali erishiladigan marketing maqsadi (Masalan: Sotuv yoki Obunachi)"
    },
    {
      "title": "2-Reels g'oyasi nomi",
      "hook": "Dastlabki 3 soniyadagi gap va kadr",
      "cameraShotAngle": "Kamera rakursi",
      "aiVideoPrompt": "AI Video Prompt",
      "marketingGoal": "Marketing maqsadi"
    },
    {
      "title": "3-Reels g'oyasi nomi",
      "hook": "Dastlabki 3 soniyadagi gap va kadr",
      "cameraShotAngle": "Kamera rakursi",
      "aiVideoPrompt": "AI Video Prompt",
      "marketingGoal": "Marketing maqsadi"
    }
  ],
  "marketingRoadmap": [
    {
      "week": "1-Hafta",
      "focus": "Fokus mavzusi",
      "actionItems": [
        "1-qadam",
        "2-qadam"
      ]
    },
    {
      "week": "2-Hafta",
      "focus": "Fokus mavzusi",
      "actionItems": [
        "1-qadam",
        "2-qadam"
      ]
    }
  ],
  "appliedBooksKnowledge": [
    "Ushbu tahlilda qaysi marketing kitoblarining qaysi aniq qoidalaridan foydalanilgani"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error analyzing Instagram:", error);
    res.status(500).json({ error: error.message || "Instagram profilini tahlil qilishda xatolik yuz berdi." });
  }
});

// Interactive AI Director & Prompt Assistant Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contextData, customApiKey, attachedImage } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Xabarlar tarixi topilmadi." });
    }

    const ai = getGeminiClient(customApiKey);

    const systemInstruction = `Siz MayPrompt loyihasining Bosh Rejissyori, AI Video Prompt Muhandisi va Professional Marketing Strategisiz.
Vazifangiz:
1. Foydalanuvchiga videolarni tahlil qilish, kamera rakurslarini (Low angle, Dutch angle, Drone shot, Dolly zoom), yoritish sxemalarini (Rembrandt, Rim light, Neon cyberpunk) va AI video generatorlari (Midjourney v6, Runway Gen-3, Kling AI, Sora, Flux) uchun aniq promptlar yozishda yordam berish.
2. Instagram, YouTube va Reels uchun viral ssenariylar, 3 soniyalik hooklar va marketing strategiyalari taklif qilish.
3. Foydalanuvchi biror o'zgartirish so'rasa, har doim darhol nusxalab AI-ga tashlash mumkin bo'lgan inglizcha tayyor promtni alohida ajratib bering.
4. O'zbek tilida juda professional, samimiy va lo'nda javob bering.

Hozirgi faol kontekst (agar mavjud bo'lsa):
${contextData ? JSON.stringify(contextData, null, 2) : "Kontekst yo'q, umumiy rejissura yordami"}`;

    const promptMessages = messages.map((m: any, idx: number) => {
      const isLastUserMsg = idx === messages.length - 1 && m.sender === "user";
      const parts: any[] = [{ text: m.content || "Kadrni tahlil qiling" }];

      // Check if image is attached to this message or provided globally
      const imgToAttach = m.attachedImage || (isLastUserMsg ? attachedImage : null);
      if (imgToAttach && typeof imgToAttach === "string") {
        const match = imgToAttach.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (match) {
          parts.unshift({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
        }
      }

      return {
        role: m.sender === "user" ? "user" : "model",
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptMessages as any,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "Javob shakllantirilmadi.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: error.message || "Chat serverida xatolik yuz berdi." });
  }
});

// Vite middleware setup (development) or static asset serving (production)
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MayPrompt server running at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
