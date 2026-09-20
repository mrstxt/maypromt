import React from 'react';
import { X, Trash2, Clock, Eye, Sparkles } from 'lucide-react';
import { ShotAnalysisData } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ShotAnalysisData[];
  onSelectHistoryItem: (item: ShotAnalysisData) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col border-l border-zinc-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-zinc-900">Tahlillar Tarixi</h3>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Tarixni tozalash"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Tozalash
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400 space-y-2">
              <Sparkles className="w-8 h-8 text-zinc-300" />
              <p className="text-sm font-medium">Hozircha saqlangan tahlillar yo'q</p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Video yoki kadr yuklab tahlil qilganingizda, ular avtomatik shu yerda saqlanib boradi.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="group cursor-pointer bg-white hover:bg-orange-50/40 p-3.5 rounded-xl border border-zinc-200 hover:border-orange-400 transition-all flex items-start gap-3 shadow-2xs"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.summaryTitle}
                    className="w-16 h-16 rounded-lg object-cover border border-zinc-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-200 font-mono text-xs">
                    Kadr
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-orange-600">
                      {item.genre || 'Kinematografik'}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-1 mt-0.5">
                    {item.summaryTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.rakursAndCamera.angle} • {item.rakursAndCamera.focalLength}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
