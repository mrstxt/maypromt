import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Flame,
  Key,
  BookOpen,
  CheckCircle,
  X,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AppNotification } from '../types';
import { checkApiWindowStatus } from '../utils/windowTiming';

interface NotificationPopoverProps {
  onOpenSettings: () => void;
  onOpenAdmin?: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Haftalik Dushanba VIP Drop (09:00 — 19:00)",
    message: "Shaxsiy Gemini API kalitingizni ulab, Cheklovsiz Pro rejasini qo'lga kiritish oynasi har Dushanba ochiladi!",
    type: "vip_drop",
    timestamp: "Bugun",
    read: false,
  },
  {
    id: "notif-2",
    title: "Marketing Kitoblari (Skills) Bazasi Faol",
    message: "Instagram va Reels tahlillarida Alex Hormozi va Russell Brunson marketing qoidalari qo'llanmoqda.",
    type: "marketing",
    timestamp: "1 kun oldin",
    read: false,
  },
  {
    id: "notif-3",
    title: "Kunlik Tahlil Kvotasi Yangilandi",
    message: "Yangi kadrlar va YouTube videolarini tahlil qilish uchun kvotangiz tayyor.",
    type: "quota",
    timestamp: "Bugun",
    read: true,
  }
];

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  onOpenSettings,
  onOpenAdmin,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const windowStatus = checkApiWindowStatus();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors shadow-2xs"
        title="Bildirishnomalar"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-zinc-200 shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                Bildirishnomalar
              </h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black">
                  {unreadCount} ta yangi
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-zinc-400 hover:text-zinc-700 font-medium"
              >
                O'qilgan deb belgilash
              </button>
            )}
          </div>

          {/* Quick Monday Status Banner inside Notification */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-zinc-900 to-orange-950 text-white space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Haftalik VIP Drop
              </span>
              <span className="font-mono text-white/80">
                {windowStatus.isOpen ? '🟢 Ochiq' : windowStatus.formattedTime}
              </span>
            </div>
            <p className="text-[11px] text-white/80 leading-snug">
              Har Dushanba 09:00 — 19:00 oralig'ida API kalit ulab Cheklovsiz Pro oling!
            </p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="mt-1 w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold text-center transition-colors"
            >
              Sozlamalar &amp; API Oynasiga O'tish &rarr;
            </button>
          </div>

          {/* Notification Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-colors ${
                  item.read
                    ? 'bg-zinc-50/60 border-zinc-100 text-zinc-500'
                    : 'bg-orange-50/50 border-orange-100 text-zinc-800 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                    {item.type === 'vip_drop' && <Key className="w-3.5 h-3.5 text-amber-500" />}
                    {item.type === 'marketing' && <BookOpen className="w-3.5 h-3.5 text-rose-500" />}
                    {item.type === 'quota' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-600">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
