import React from 'react';
import { Film, Youtube, Instagram, Camera, BookOpen } from 'lucide-react';

export type ExtensionType = 'video' | 'youtube' | 'instagram' | 'camera_tools';

interface ExtensionsBarProps {
  onSelectExtension: (ext: ExtensionType) => void;
  activeContextName?: string;
}

export const ExtensionsBar: React.FC<ExtensionsBarProps> = ({
  onSelectExtension,
  activeContextName,
}) => {
  const ITEMS = [
    { id: 'video' as ExtensionType, label: 'Video / Kadr', icon: Film },
    { id: 'youtube' as ExtensionType, label: 'YouTube Shorts', icon: Youtube },
    { id: 'instagram' as ExtensionType, label: 'Instagram Reels', icon: Instagram },
    { id: 'camera_tools' as ExtensionType, label: 'Kamera Harakati', icon: Camera },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none py-0.5">
      {activeContextName && (
        <span className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 truncate max-w-[150px]">
          {activeContextName}
        </span>
      )}
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectExtension(item.id)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100/70 hover:border-zinc-300 text-zinc-600 hover:text-zinc-900 text-xs font-medium transition-all shadow-2xs active:scale-98"
          >
            <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
