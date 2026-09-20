import React, { useState, useEffect } from 'react';
import { AppSidebar } from './components/AppSidebar';
import { AIChatPanel } from './components/AIChatPanel';
import { ExtensionModal, ActiveExtensionModal } from './components/ExtensionModal';
import { CameraToolsModal } from './components/CameraToolsModal';
import { ExtensionType } from './components/ExtensionsBar';
import { GuideModal } from './components/GuideModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { PlanModal } from './components/PlanModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationPopover } from './components/NotificationPopover';
import { AdminPage } from './pages/AdminPage';
import { useAuth } from './context/AuthContext';
import { ShotAnalysisData, SampleVideoItem, ChatMessage, ChatSession } from './types';
import {
  PanelLeft,
  Sparkles,
  Film,
  Camera,
  Layers,
  HelpCircle,
  Settings as SettingsIcon,
  AlertCircle,
  Eye,
  CheckCircle2,
  Aperture
} from 'lucide-react';

const CHAT_STORAGE_KEY = 'mayprompt_chat_sessions_v2';
const SHOT_HISTORY_KEY = 'mayprompt_history_v1';

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-msg",
  sender: "assistant",
  content: `Assalomu alaykum! Men **MayPrompt Rejissura va AI Video Prompt Muhandisiman** 🎬

Quyidagi masalalarda sizga yordam bera olaman:
1. Istalgan kadringizni **Midjourney, Runway Gen-3, Kling AI** yoki **Sora** uchun mukammal promptga aylantirish.
2. Kamera rakurslari (Low angle, Dutch angle, Dolly zoom, Drone shot) va yoritish sxemalarini o'zgartirish.
3. Instagram Reels va YouTube Shorts uchun **viral 3-soniyalik ssenariylar** yozish.

Quyidagi extensionlardan birini tanlang yoki savolingizni to'g'ridan-to'g'ri yozing!`,
  timestamp: "Hozir",
};

export default function App() {
  const { user, canAnalyze, recordUsage, isUnlimited, dailyLimit } = useAuth();

  // Route isolation for dedicated Vercel admin panel
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return path.startsWith('/admin') || search.includes('admin=true') || hash === '#admin';
    }
    return false;
  });

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        setIsAdminRoute(path.startsWith('/admin') || search.includes('admin=true') || hash === '#admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sidebar toggle state (desktop & mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default-session');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // Attached image or shot data for current chat
  const [attachedImageForChat, setAttachedImageForChat] = useState<string | null>(null);
  const [activeContextShot, setActiveContextShot] = useState<ShotAnalysisData | null>(null);

  // Extension Modals
  const [activeExtensionModal, setActiveExtensionModal] = useState<ActiveExtensionModal>(null);
  const [isCameraToolsOpen, setIsCameraToolsOpen] = useState<boolean>(false);

  // Core Video / Analysis processing
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ShotAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // System Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPlansOpen, setIsPlansOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Initialize and load chat sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          if (parsed[0].contextData) {
            setActiveContextShot(parsed[0].contextData);
          }
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default session if none exists
    const defaultSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "Yangi Rejissura Loyihasi",
      updatedAt: Date.now(),
      messages: [INITIAL_MESSAGE],
      contextData: null,
    };
    setChatSessions([defaultSession]);
    setCurrentSessionId(defaultSession.id);
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setChatSessions(updated);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage fallback
    }
  };

  // Get current active session
  const currentSession =
    chatSessions.find((s) => s.id === currentSessionId) ||
    chatSessions[0] || {
      id: currentSessionId,
      title: "Yangi Loyiha",
      updatedAt: Date.now(),
      messages: [INITIAL_MESSAGE],
    };

  // Handler: Create New Chat
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "Yangi Rejissura Loyihasi",
      updatedAt: Date.now(),
      messages: [INITIAL_MESSAGE],
      contextData: null,
      attachedImage: undefined,
    };
    const updated = [newSession, ...chatSessions];
    saveSessions(updated);
    setCurrentSessionId(newSession.id);
    setActiveContextShot(null);
    setAttachedImageForChat(null);
  };

  // Handler: Select Session
  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    const found = chatSessions.find((s) => s.id === id);
    if (found?.contextData) {
      setActiveContextShot(found.contextData);
      setAnalysisResult(found.contextData);
    }
  };

  // Handler: Delete Session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = chatSessions.filter((s) => s.id !== id);
    if (filtered.length === 0) {
      const fallback: ChatSession = {
        id: `session-${Date.now()}`,
        title: "Yangi Loyiha",
        updatedAt: Date.now(),
        messages: [INITIAL_MESSAGE],
      };
      saveSessions([fallback]);
      setCurrentSessionId(fallback.id);
    } else {
      saveSessions(filtered);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
    }
  };

  // Handler: Send Message in Chat
  const handleSendMessage = async (text: string, attachedImg?: string) => {
    if (!text && !attachedImg) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedImage: attachedImg || undefined,
    };

    const updatedMessages = [...currentSession.messages, userMsg];

    // Update session title dynamically from first message if default
    let sessionTitle = currentSession.title;
    if (sessionTitle === "Yangi Rejissura Loyihasi" || sessionTitle === "Yangi Loyiha") {
      sessionTitle = text.slice(0, 32) + (text.length > 32 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...currentSession,
      title: sessionTitle,
      updatedAt: Date.now(),
      messages: updatedMessages,
      contextData: activeContextShot,
    };

    const newSessions = chatSessions.map((s) =>
      s.id === currentSession.id ? updatedSession : s
    );
    saveSessions(newSessions);

    // Clear attached image after sending
    setAttachedImageForChat(null);
    setIsSendingMessage(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          contextData: activeContextShot || null,
          attachedImage: attachedImg || null,
          customApiKey: user?.customApiKey,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat javobida xatolik yuz berdi");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        content: data.reply || "Uzr, javob olib bo'lmadi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, botMsg];
      const finalizedSession = {
        ...updatedSession,
        messages: finalMessages,
      };

      saveSessions(
        chatSessions.map((s) => (s.id === currentSession.id ? finalizedSession : s))
      );
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        content: "Kechirasiz, javob olishda server bilan bog'lanib bo'lmadi. Qaytadan urinib ko'ring.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...updatedMessages, errMsg];
      saveSessions(
        chatSessions.map((s) =>
          s.id === currentSession.id ? { ...updatedSession, messages: finalMessages } : s
        )
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handler: Extension selection
  const handleSelectExtension = (ext: ExtensionType) => {
    if (ext === 'camera_tools') {
      setIsCameraToolsOpen(true);
      return;
    }
    if (ext === 'video') {
      setActiveExtensionModal('video_upload');
      return;
    }
    if (ext === 'youtube') {
      setActiveExtensionModal('youtube');
      return;
    }
    if (ext === 'instagram') {
      setActiveExtensionModal('instagram');
      return;
    }
  };

  // Video and Image Analysis Processing
  const handleVideoSelected = (file: File) => {
    setError(null);
    setVideoFile(file);
    setActiveImages([]);
  };

  const triggerShotAnalysis = async (imagesToAnalyze: string[], customTitle?: string) => {
    if (!imagesToAnalyze || imagesToAnalyze.length === 0) return;

    const quotaCheck = canAnalyze();
    if (!quotaCheck.allowed) {
      setError(quotaCheck.reason || "Tahlil kvotasi tugadi.");
      setIsPlansOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const steps = [
      "Kadrlarning vizual geometriyasi tekshirilmoqda...",
      "Kamera rakursi va fokal masofa o'lchanmoqda...",
      "Yuz mimikasi, ko'z qarashi va poza tahlil qilinmoqda...",
      "Yoritish sxemasi va ranglar gammasi ajratilmoqda...",
      "Midjourney, Runway va Kling promtlari shakllantirilmoqda...",
    ];

    let stepIndex = 0;
    setAnalyzingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setAnalyzingStep(steps[stepIndex]);
    }, 1200);

    try {
      const res = await fetch('/api/analyze-shot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesToAnalyze.map((url) => ({ dataUrl: url })),
          focusMode: 'all',
          customNote: customTitle || '',
          styleModifier: 'original',
          preferredLanguage: 'uz',
          userEmail: user?.email,
          userPlan: user?.plan || 'free',
          customApiKey: user?.customApiKey,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 429 || errData.limitReached) {
          setIsPlansOpen(true);
        }
        throw new Error(errData.error || "Tahlil jarayonida xatolik yuz berdi");
      }

      const data: ShotAnalysisData = await res.json();
      data.thumbnail = imagesToAnalyze[0];

      setAnalysisResult(data);
      setActiveContextShot(data);
      recordUsage();

      // Automatically inform AI Chat about the analyzed shot
      const shotNotice = `🎬 Yangi kadr tahlil qilindi: "${data.summaryTitle}".
- Rakurs & Optika: ${data.rakursAndCamera?.angle}, ${data.rakursAndCamera?.focalLength}
- Midjourney promti: ${data.prompts?.midjourney}
- Runway Gen-3: ${data.prompts?.runwayGen3?.prompt}
- Kling AI Harakat: Pan: ${data.prompts?.klingAi?.cameraSettings?.pan}, Tilt: ${data.prompts?.klingAi?.cameraSettings?.tilt}`;

      handleSendMessage(shotNotice, imagesToAnalyze[0]);
      setActiveExtensionModal('full_analysis');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Tahlil qilishda nosozlik yuz berdi");
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handleRefinePrompt = async (instruction: string) => {
    if (!analysisResult) return;
    setIsRefining(true);
    try {
      const res = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentData: analysisResult,
          instruction,
          customApiKey: user?.customApiKey,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Tahrirlashda xatolik yuz berdi");
      }

      const responseData = await res.json();
      if (responseData.updatedPrompts) {
        const updated: ShotAnalysisData = {
          ...analysisResult,
          prompts: {
            ...analysisResult.prompts,
            ...responseData.updatedPrompts,
          },
        };
        setAnalysisResult(updated);
        setActiveContextShot(updated);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Tahrirlashda nosozlik yuz berdi");
    } finally {
      setIsRefining(false);
    }
  };

  // Open direct file dialog from input or sidebar
  const handleOpenFileUpload = () => {
    setActiveExtensionModal('video_upload');
  };

  // Standalone dedicated Vercel Admin Panel route (Completely isolated from main platform)
  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans">
      {/* 1. LEFT SIDEBAR (ChatGPT / Claude AI Style) */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onOpenFileUpload={handleOpenFileUpload}
        onOpenYouTubeInput={() => setActiveExtensionModal('youtube')}
        activeContextShot={activeContextShot}
        onClearContextShot={() => setActiveContextShot(null)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenExtension={handleSelectExtension}
      />

      {/* 2. MAIN WORKSPACE (Center Canvas) */}
      <div
        className={`flex-1 flex flex-col h-full min-w-0 transition-all duration-200 ${
          isSidebarOpen ? 'lg:pl-64' : 'pl-0'
        }`}
      >
        {/* Minimalist Top App Header */}
        <header className="h-13 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Sidebar yopish" : "Sidebar ochish"}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Current Project / Session Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-zinc-900 truncate">
                {currentSession.title}
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* If there is active analysis, button to view full analysis */}
            {analysisResult && (
              <button
                type="button"
                onClick={() => setActiveExtensionModal('full_analysis')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
              >
                <Film className="w-3.5 h-3.5 text-zinc-600" />
                <span className="hidden sm:inline">Kadr Tahlili</span>
              </button>
            )}

            {/* Notification Popover (VIP Drop alerts) */}
            <NotificationPopover onOpenSettings={() => setIsSettingsOpen(true)} />

            {/* Google Sign-in / User avatar button */}
            {user ? (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                title={`${user.name} (${user.email})`}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-zinc-300"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-medium transition-colors shadow-2xs"
              >
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="hidden sm:inline">Google orqali kirish</span>
              </button>
            )}

            {/* Guide modal button */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              title="Qo'llanma & Yordam"
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Settings button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Sozlamalar"
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Error Banner if any */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-800 font-bold text-xs"
            >
              Yopish
            </button>
          </div>
        )}

        {/* MAIN BODY: AI CHAT (Markazda to'liq AI Chat) */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          <AIChatPanel
            messages={currentSession.messages}
            onSendMessage={handleSendMessage}
            isSending={isSendingMessage}
            currentShotData={activeContextShot}
            attachedImage={attachedImageForChat}
            onClearAttachedImage={() => setAttachedImageForChat(null)}
            onOpenFileUpload={handleOpenFileUpload}
            onOpenExtension={handleSelectExtension}
            onClearChat={() => {
              const resetSession = {
                ...currentSession,
                messages: [INITIAL_MESSAGE],
              };
              saveSessions(
                chatSessions.map((s) => (s.id === currentSession.id ? resetSession : s))
              );
            }}
          />
        </main>
      </div>

      {/* 3. EXTENSION MODAL (Video Prompter, YouTube, Instagram, Admin, Full Analysis) */}
      <ExtensionModal
        activeModal={activeExtensionModal}
        onClose={() => setActiveExtensionModal(null)}
        videoFile={videoFile}
        onVideoSelected={handleVideoSelected}
        onFramesCaptured={(frames) => {
          setActiveImages(frames);
          setAttachedImageForChat(frames[0]);
          triggerShotAnalysis(frames);
        }}
        onCancelVideo={() => setVideoFile(null)}
        onImagesSelected={(imgs) => {
          setActiveImages(imgs);
          setAttachedImageForChat(imgs[0]);
          triggerShotAnalysis(imgs);
        }}
        onSelectSample={(sample) => {
          setActiveImages(sample.frames);
          setAttachedImageForChat(sample.frames[0]);
          triggerShotAnalysis(sample.frames, sample.title);
        }}
        isAnalyzing={isAnalyzing}
        onAnalyzeYouTube={(thumb, title) => {
          setActiveImages([thumb]);
          setAttachedImageForChat(thumb);
          triggerShotAnalysis([thumb], title);
        }}
        onSendInstagramToShotPrompter={(img) => {
          setActiveImages([img]);
          setAttachedImageForChat(img);
          triggerShotAnalysis([img]);
        }}
        analysisResult={analysisResult}
        activeImages={activeImages}
        onRefinePrompt={handleRefinePrompt}
        isRefining={isRefining}
        onResetAnalysis={() => {
          setAnalysisResult(null);
          setActiveContextShot(null);
        }}
        onSendAnalysisToChat={(prompt) => {
          handleSendMessage(prompt);
        }}
      />

      {/* 4. CAMERA TOOLS MODAL (Kling & Runway Harakat) */}
      <CameraToolsModal
        isOpen={isCameraToolsOpen}
        onClose={() => setIsCameraToolsOpen(false)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      {/* 5. SYSTEM MODALS */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <GoogleAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <PlanModal isOpen={isPlansOpen} onClose={() => setIsPlansOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenPlans={() => setIsPlansOpen(true)}
      />
    </div>
  );
}
