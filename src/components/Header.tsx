import React, { useState } from 'react';
import {
  Sparkles,
  History,
  HelpCircle,
  Aperture,
  User,
  Zap,
  ChevronDown,
  LogOut,
  Settings,
  Film,
  Instagram,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../data/plans';
import { NotificationPopover } from './NotificationPopover';

interface HeaderProps {
  activeTab: 'video' | 'instagram' | 'chat' | 'admin';
  onTabChange: (tab: 'video' | 'instagram' | 'chat' | 'admin') => void;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenAuth: () => void;
  onOpenPlans: () => void;
  onOpenSettings: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenHistory,
  onOpenGuide,
  onOpenAuth,
  onOpenPlans,
  onOpenSettings,
  historyCount,
}) => {
  const { user, isUnlimited, dailyLimit, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentPlan = user?.plan || 'free';
  const planConfig = PLANS[currentPlan];
  const quotaUsed = user?.quotaUsedToday || 0;

  return (
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('video')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 shrink-0">
                <Aperture className="w-5 h-5 sm:w-6 sm:h-6 animate-[spin_16s_linear_infinite]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 font-sans">
                    MayPrompt
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-orange-500 text-white">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 hidden lg:block">
                  Video AI &amp; Marketing Studio
                </p>
              </div>
            </button>
          </div>

          {/* Center: Main Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200/60">
            <button
              type="button"
              onClick={() => onTabChange('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-orange-500" />
              <span>Video &amp; YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('instagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'instagram'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
              <span>Instagram &amp; Marketing</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>AI Rejissyor Chat</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Right Section: Notifications, Settings, Plans, User */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Notification Center */}
            <NotificationPopover
              onOpenSettings={onOpenSettings}
              onOpenAdmin={() => onTabChange('admin')}
            />

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors shadow-2xs"
              title="Sozlamalar va API kalit"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Plan & Quota Indicator Button */}
            <button
              onClick={onOpenPlans}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                isUnlimited
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent hover:brightness-105'
                  : currentPlan === 'plus'
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200'
              }`}
              title="Ta'rif va kunlik limitni boshqarish"
            >
              {isUnlimited ? (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Pro (Cheklovsiz)</span>
                </>
              ) : (
                <>
                  <span className="capitalize">{currentPlan}</span>
                  <span className="text-[11px] opacity-75 font-mono">
                    {quotaUsed}/{dailyLimit}
                  </span>
                </>
              )}
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <History className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tarix</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Google User Avatar / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white transition-all shadow-2xs"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-zinc-200"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-zinc-900 leading-tight max-w-[100px] truncate">
                      {user.name}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-zinc-200 shadow-xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-100">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-zinc-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate font-mono">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSettings();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-zinc-500" />
                        Sozlamalar &amp; API Kalit
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenPlans();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-orange-500" />
                          Ta'rifni oshirish
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 uppercase">
                          {user.plan}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onTabChange('admin');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        Admin Panel
                      </button>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="text-[11px] font-bold text-orange-600 hover:underline"
                      >
                        Akkauntni almashtirish
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Chiqish"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm shadow-zinc-900/10"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Google bilan kirish</span>
                <span className="sm:hidden">Kirish</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-zinc-100 text-[11px] font-bold">
          <button
            onClick={() => onTabChange('video')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'video' ? 'text-orange-600 bg-orange-50' : 'text-zinc-600'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video</span>
          </button>
          <button
            onClick={() => onTabChange('instagram')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'instagram' ? 'text-rose-600 bg-rose-50' : 'text-zinc-600'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-zinc-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => onTabChange('admin')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'admin' ? 'text-amber-600 bg-amber-50' : 'text-zinc-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
