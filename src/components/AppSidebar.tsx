import React, { useState } from 'react';
import {
  Plus,
  Youtube,
  Film,
  Instagram,
  X,
  PanelLeftClose,
  Trash2,
  Settings,
  User,
  LogOut,
  MessageSquare,
  Lock,
  Zap,
  Radio,
  Camera,
  Wand2,
  Flame,
  Folder,
  ChevronDown,
  ChevronRight,
  Eye,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ChatSession, ShotAnalysisData } from '../types';

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  chatSessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenFileUpload: () => void;
  onOpenYouTubeInput: () => void;
  activeContextShot: ShotAnalysisData | null;
  onClearContextShot: () => void;
  onOpenSettings: () => void;
  onOpenPlans: () => void;
  onOpenAuth: () => void;
  onOpenExtension: (ext: 'video' | 'youtube' | 'instagram' | 'camera_tools') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  chatSessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onOpenFileUpload,
  onOpenYouTubeInput,
  activeContextShot,
  onClearContextShot,
  onOpenSettings,
  onOpenPlans,
  onOpenAuth,
  onOpenExtension,
}) => {
  const { user, logout, tokenStatus, checkCanCreateChat } = useAuth();

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    media: false,
    connect: false,
    skill: false,
    folder: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const userPlan = user?.plan || 'free';
  const isChatLocked = tokenStatus.inCooldown;

  const handleNewChatClick = () => {
    const check = checkCanCreateChat();
    if (!check.allowed) {
      onOpenPlans();
      return;
    }
    onNewChat();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/20 backdrop-blur-2xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container - clean simple neutral zinc canvas */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-zinc-50 border-r border-zinc-200 text-zinc-800 transition-all duration-200 ease-in-out ${
          isOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        {/* Header */}
        <div className="h-13 px-4 flex items-center justify-between border-b border-zinc-200/80 shrink-0 bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              M
            </div>
            <div>
              <span className="font-semibold text-sm text-zinc-900 tracking-tight block leading-none">
                MayPrompt
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Rejissura Studio</span>
            </div>
          </div>

          <button
            onClick={onToggle}
            title="Sidebar yopish"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Structured Sections (Media, Connect, Skill, Folder) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 text-xs scrollbar-none">

          {/* 1. MEDIA SECTION */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-2.5 shadow-2xs">
            <div
              onClick={() => toggleSection('media')}
              className="flex items-center justify-between px-1 py-0.5 cursor-pointer select-none text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                  Media
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">
                  3 vosita
                </span>
                {collapsedSections.media ? (
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </div>
            </div>

            {!collapsedSections.media && (
              <div className="space-y-1 pt-2">
                {/* Video & Kadr yuklash */}
                <button
                  onClick={onOpenFileUpload}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 flex items-center justify-center shrink-0 text-zinc-700">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">Video &amp; Kadr Ochish</p>
                    <p className="text-[10px] text-zinc-400 truncate">MP4, MOV yoki kadrlar tahlili</p>
                  </div>
                </button>

                {/* YouTube Shorts */}
                <button
                  onClick={onOpenYouTubeInput}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 text-zinc-700 flex items-center justify-center shrink-0">
                    <Youtube className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">YouTube Shorts</p>
                    <p className="text-[10px] text-zinc-400 truncate">Havola orqali video tahlil</p>
                  </div>
                </button>

                {/* Instagram Reels */}
                <button
                  onClick={() => onOpenExtension('instagram')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 text-zinc-700 flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">Instagram Reels</p>
                    <p className="text-[10px] text-zinc-400 truncate">Viral ssenariy &amp; hooklar</p>
                  </div>
                </button>

                {/* Active Context Shot Card */}
                {activeContextShot && (
                  <div className="mt-1.5 p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {activeContextShot.thumbnail && (
                        <img
                          src={activeContextShot.thumbnail}
                          alt="Faol Kadr"
                          className="w-7 h-7 rounded-lg object-cover border border-zinc-200 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] text-zinc-400 uppercase font-semibold">Faol kadr</p>
                        <p className="text-[11px] text-zinc-900 truncate font-medium">
                          {activeContextShot.summaryTitle || "Tanlangan kadr"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClearContextShot}
                      title="O'chirish"
                      className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-200/50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. CONNECT SECTION */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-2.5 shadow-2xs">
            <div
              onClick={() => toggleSection('connect')}
              className="flex items-center justify-between px-1 py-0.5 cursor-pointer select-none text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                  Connect
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-500 capitalize">
                  {userPlan}
                </span>
                {collapsedSections.connect ? (
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </div>
            </div>

            {!collapsedSections.connect && (
              <div className="space-y-2 pt-2">
                {/* Gemini Connection Status */}
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-semibold text-zinc-800">
                      Google Gemini 3.8
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 bg-zinc-200/60 px-1.5 py-0.5 rounded-md font-medium">
                    Ulangan
                  </span>
                </div>

                {/* Quota Progress & Plan */}
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-zinc-800 capitalize">
                      Gemini {userPlan} tarifi
                    </span>

                    {userPlan === 'free' ? (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {tokenStatus.inCooldown ? '0%' : `${100 - tokenStatus.percentageUsed}% qoldi`}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-700 font-medium">Cheksiz seans</span>
                    )}
                  </div>

                  {userPlan === 'free' && (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            tokenStatus.inCooldown
                              ? 'bg-zinc-700'
                              : tokenStatus.percentageUsed > 80
                              ? 'bg-zinc-600'
                              : 'bg-zinc-900'
                          }`}
                          style={{ width: `${tokenStatus.percentageUsed}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-zinc-500">
                        <span>{tokenStatus.inCooldown ? "Kvota to'ldi" : "Seans kvotasi"}</span>
                        {tokenStatus.inCooldown ? (
                          <span className="text-zinc-700 font-mono font-medium">
                            ⏳ {tokenStatus.formattedCountdown}
                          </span>
                        ) : (
                          <span className="font-mono text-zinc-600">
                            {Math.max(0, 100 - tokenStatus.percentageUsed)}% qoldi
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={onOpenPlans}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-zinc-300" />
                      <span>Ta'riflar</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenSettings}
                      title="API va model sozlamalari"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-[10px] font-semibold transition-colors flex items-center justify-center"
                    >
                      <Key className="w-3 h-3 text-zinc-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. SKILL SECTION */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-2.5 shadow-2xs">
            <div
              onClick={() => toggleSection('skill')}
              className="flex items-center justify-between px-1 py-0.5 cursor-pointer select-none text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                  Skill
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">
                  Rejissura
                </span>
                {collapsedSections.skill ? (
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </div>
            </div>

            {!collapsedSections.skill && (
              <div className="space-y-1 pt-2">
                {/* Kamera Harakatlari */}
                <button
                  onClick={() => onOpenExtension('camera_tools')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 text-zinc-700 flex items-center justify-center shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">Kamera Harakatlari</p>
                    <p className="text-[10px] text-zinc-400 truncate">Pan, Tilt, Zoom, Roll, Dolly</p>
                  </div>
                </button>

                {/* Kinematik Promtlar */}
                <button
                  onClick={() => onOpenExtension('camera_tools')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 text-zinc-700 flex items-center justify-center shrink-0">
                    <Wand2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">Kinematik Promtlar</p>
                    <p className="text-[10px] text-zinc-400 truncate">Runway Gen-3, Kling AI, Midjourney</p>
                  </div>
                </button>

                {/* 3-Soniyalik Viral Hooklar */}
                <button
                  onClick={() => onOpenExtension('instagram')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 text-zinc-700 flex items-center justify-center shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">3-Soniyalik Hooklar</p>
                    <p className="text-[10px] text-zinc-400 truncate">Tomoshabinni ushlab qoluvchi format</p>
                  </div>
                </button>

                {/* Kadr Optik Tahlili */}
                <button
                  onClick={onOpenFileUpload}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-left group"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 group-hover:bg-zinc-200/60 text-zinc-700 flex items-center justify-center shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800 truncate">Kadr Optik Tahlili</p>
                    <p className="text-[10px] text-zinc-400 truncate">Yorug'lik, fokal nuqta &amp; rang</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. FOLDER SECTION */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-2.5 shadow-2xs">
            <div
              onClick={() => toggleSection('folder')}
              className="flex items-center justify-between px-1 py-0.5 cursor-pointer select-none text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                  Folder
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">
                  {chatSessions.length} suhbat
                </span>
                {collapsedSections.folder ? (
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </div>
            </div>

            {!collapsedSections.folder && (
              <div className="space-y-1.5 pt-2">
                {/* New Chat Button */}
                <button
                  onClick={handleNewChatClick}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border shadow-2xs transition-all active:scale-98 ${
                    isChatLocked
                      ? 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200'
                      : 'bg-zinc-900 hover:bg-black text-white border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isChatLocked ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-white shrink-0" />
                    )}
                    <span>Yangi Suhbat</span>
                  </div>

                  {isChatLocked && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-zinc-200 text-zinc-700 font-mono">
                      {tokenStatus.formattedCountdown || 'Kutish'}
                    </span>
                  )}
                </button>

                {/* Chat Session Items */}
                <div className="space-y-0.5 max-h-52 overflow-y-auto pr-0.5 scrollbar-none">
                  {chatSessions.length === 0 ? (
                    <div className="py-4 text-center text-zinc-400 text-[11px]">
                      Hozircha suhbatlar yo'q
                    </div>
                  ) : (
                    chatSessions.map((session) => {
                      const isSelected = session.id === currentSessionId;
                      return (
                        <div
                          key={session.id}
                          onClick={() => onSelectSession(session.id)}
                          className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-zinc-200/80 text-zinc-900 font-semibold'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-1">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate text-xs">{session.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => onDeleteSession(session.id, e)}
                            title="O'chirish"
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-red-500 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom footer: Settings, Profil */}
        <div className="p-3 border-t border-zinc-200/80 bg-zinc-50 shrink-0 space-y-1 text-xs">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 transition-colors text-left font-medium"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sozlamalar &amp; API</span>
          </button>

          <div className="pt-1 border-t border-zinc-200/60 mt-1">
            {user ? (
              <div className="flex items-center justify-between p-1 rounded-xl">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Chiqish"
                  className="p-1 text-zinc-400 hover:text-red-500 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-semibold transition-all shadow-2xs"
              >
                {/* Google Icon */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google orqali kirish</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
