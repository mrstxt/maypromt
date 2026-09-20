import React from 'react';
import {
  Plus,
  Youtube,
  Film,
  X,
  PanelLeftClose,
  Trash2,
  Settings,
  ShieldCheck,
  User,
  LogOut,
  MessageSquare,
  Lock,
  Sparkles,
  Zap
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
  onOpenAdmin: () => void;
  onOpenPlans: () => void;
  onOpenAuth: () => void;
  onOpenExtension: (ext: 'video' | 'youtube' | 'instagram' | 'admin') => void;
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
  onOpenAdmin,
  onOpenPlans,
  onOpenAuth,
}) => {
  const { user, logout, tokenStatus, checkCanCreateChat } = useAuth();
  const isSuperAdmin = user?.email?.toLowerCase() === 'baytirp.uz@gmail.com';

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

      {/* Sidebar container - clean light neutral canvas */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-zinc-50 border-r border-zinc-200 text-zinc-700 transition-all duration-200 ease-in-out ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        {/* Header */}
        <div className="h-13 px-4 flex items-center justify-between border-b border-zinc-200/80 shrink-0 bg-zinc-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-sm text-zinc-900 tracking-tight">MayPrompt</span>
          </div>

          <button
            onClick={onToggle}
            title="Sidebar yopish"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button (locked if in cooldown) */}
        <div className="p-3 shrink-0">
          <button
            onClick={handleNewChatClick}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border shadow-2xs transition-all active:scale-98 ${
              isChatLocked
                ? 'bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100'
                : 'bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isChatLocked ? (
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              ) : (
                <Plus className="w-4 h-4 text-zinc-500 shrink-0" />
              )}
              <span>Yangi suhbat</span>
            </div>

            {isChatLocked && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900 font-mono">
                {tokenStatus.formattedCountdown || 'Kutish'}
              </span>
            )}
          </button>
        </div>

        {/* Middle Scrollable Section */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 text-xs scrollbar-none">
          {/* Fayl ochish */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Fayl ochish
            </div>
            <button
              onClick={onOpenFileUpload}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors text-left font-medium"
            >
              <Film className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">Video / Kadr ochish</span>
            </button>

            <button
              onClick={onOpenYouTubeInput}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors text-left font-medium"
            >
              <Youtube className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">YouTube havola</span>
            </button>
          </div>

          {/* Connected / Token Status */}
          <div className="space-y-1.5">
            <div className="px-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Kvota &amp; Ta'rif</span>
              <button
                onClick={onOpenPlans}
                className="text-[10px] text-zinc-600 hover:text-zinc-900 font-medium underline cursor-pointer"
              >
                O'zgartirish
              </button>
            </div>

            {/* Active context shot */}
            {activeContextShot && (
              <div className="p-2 rounded-lg bg-white border border-zinc-200 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  {activeContextShot.thumbnail && (
                    <img
                      src={activeContextShot.thumbnail}
                      alt="Shot"
                      className="w-6 h-6 rounded object-cover border border-zinc-200 shrink-0"
                    />
                  )}
                  <span className="text-[11px] text-zinc-800 truncate font-medium">
                    {activeContextShot.summaryTitle || "Faol kadr"}
                  </span>
                </div>
                <button
                  onClick={onClearContextShot}
                  title="O'chirish"
                  className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Token allocation status card */}
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-800 capitalize flex items-center gap-1">
                  {userPlan === 'pro' && <Sparkles className="w-3 h-3 text-amber-500" />}
                  {userPlan === 'plus' && <Zap className="w-3 h-3 text-blue-500" />}
                  Gemini {userPlan}
                </span>

                {userPlan === 'free' ? (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {tokenStatus.inCooldown ? '0%' : `${100 - tokenStatus.percentageUsed}% qoldi`}
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-semibold">Cheksiz</span>
                )}
              </div>

              {/* Progress bar for Free plan */}
              {userPlan === 'free' && (
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${
                        tokenStatus.inCooldown
                          ? 'bg-amber-500'
                          : tokenStatus.isBufferActive
                          ? 'bg-amber-400'
                          : 'bg-zinc-800'
                      }`}
                      style={{ width: `${tokenStatus.percentageUsed}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-zinc-400">
                    <span>{tokenStatus.isBufferActive ? '30% Smart Bufer' : '70% Asosiy kvota'}</span>
                    {tokenStatus.inCooldown && (
                      <span className="text-amber-600 font-medium font-mono">
                        ⏳ {tokenStatus.formattedCountdown}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Upgrade button for free tier */}
              {userPlan === 'free' && (
                <button
                  type="button"
                  onClick={onOpenPlans}
                  className="w-full mt-1 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Plus ($11.99) ga o'tish</span>
                </button>
              )}
            </div>
          </div>

          {/* Chatlar Ro'yxati */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Chatlar</span>
              <span className="text-[10px] text-zinc-400">{chatSessions.length}</span>
            </div>

            <div className="space-y-0.5">
              {chatSessions.map((session) => {
                const isSelected = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-zinc-200/70 text-zinc-900 font-medium'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40'
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
              })}
            </div>
          </div>
        </div>

        {/* Bottom footer: Settings, Admin, Profil */}
        <div className="p-3 border-t border-zinc-200/80 bg-zinc-50 shrink-0 space-y-1 text-xs">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 transition-colors text-left font-medium"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sozlamalar</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/50 transition-colors text-left font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Admin Panel</span>
            </button>
          )}

          <div className="pt-1 border-t border-zinc-200/60 mt-1">
            {user ? (
              <div className="flex items-center justify-between p-1 rounded-lg">
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
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Kirish</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
