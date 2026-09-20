import React, { useState, useEffect } from 'react';
import { Upload, Video, Image, Link, Sparkles, Clipboard, Check, ArrowRight } from 'lucide-react';
import { SAMPLE_SHOTS } from '../data/samples';
import { SampleVideoItem } from '../types';

interface UploadZoneProps {
  onVideoSelected: (file: File) => void;
  onImagesSelected: (dataUrls: string[]) => void;
  onSelectSample: (sample: SampleVideoItem) => void;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onVideoSelected,
  onImagesSelected,
  onSelectSample,
  isAnalyzing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [pastedNotice, setPastedNotice] = useState(false);

  // Global paste handler so user can just hit Ctrl+V / Cmd+V anywhere!
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onImagesSelected([event.target.result as string]);
                setPastedNotice(true);
                setTimeout(() => setPastedNotice(false), 3000);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImagesSelected]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.type.startsWith('video/')) {
      onVideoSelected(file);
    } else if (file.type.startsWith('image/')) {
      const readers: Promise<string>[] = [];
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        const currentFile = files[i];
        if (currentFile.type.startsWith('image/')) {
          readers.push(
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(currentFile);
            })
          );
        }
      }
      Promise.all(readers).then((dataUrls) => {
        onImagesSelected(dataUrls);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLoadUrl = async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          onImagesSelected([dataUrl]);
          setUrlInput('');
          setShowUrlInput(false);
        }
        setUrlLoading(false);
      };
      img.onerror = () => {
        onImagesSelected([urlInput.trim()]);
        setUrlInput('');
        setShowUrlInput(false);
        setUrlLoading(false);
      };
      img.src = urlInput.trim();
    } catch {
      setUrlLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Super Simple, Modern Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-white shadow-xs ${
          isDragging
            ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
            : 'border-zinc-300 hover:border-orange-400/90'
        }`}
      >
        <input
          id="file-upload-input"
          type="file"
          accept="video/mp4,video/quicktime,video/webm,image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={isAnalyzing}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900">
              Videoni shu yerga tashlang
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Instagram Reels, TikTok video (.mp4, .mov) yoki rasmlarni tashlang
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <label
              htmlFor="file-upload-input"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <Video className="w-4 h-4" />
              Faylni tanlash
            </label>

            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-semibold border border-zinc-200">
              <Clipboard className="w-3.5 h-3.5 text-zinc-500" />
              Ctrl+V (Skrinshot)
            </div>
          </div>
        </div>

        {pastedNotice && (
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold">
            <Check className="w-3.5 h-3.5" /> Skrinshot qo'yildi!
          </div>
        )}
      </div>

      {/* URL toggler */}
      <div className="text-center">
        {!showUrlInput ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-xs text-zinc-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <Link className="w-3.5 h-3.5" />
            Internet havolasi (URL) orqali kiritish...
          </button>
        ) : (
          <div className="flex items-center gap-2 max-w-md mx-auto pt-1">
            <input
              type="url"
              placeholder="Rasm yoki video kadr havolasi..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadUrl()}
              className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <button
              onClick={handleLoadUrl}
              disabled={!urlInput.trim() || urlLoading}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shrink-0"
            >
              {urlLoading ? '...' : 'Yuklash'}
            </button>
            <button
              onClick={() => setShowUrlInput(false)}
              className="px-2 py-2 text-zinc-400 hover:text-zinc-700 text-xs"
            >
              Yopish
            </button>
          </div>
        )}
      </div>

      {/* Instant 1-Click Samples (Clean Chips) */}
      <div className="pt-2">
        <div className="text-center mb-2.5">
          <span className="text-xs font-bold text-zinc-600 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Yoki tayyor namuna bilan 1 bosishda sinab ko'ring:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_SHOTS.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-zinc-200/90 hover:border-orange-400 hover:shadow-sm transition-all text-left group"
            >
              <img
                src={sample.thumbnail}
                alt={sample.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-900 group-hover:text-orange-600 truncate">
                  {sample.title}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">
                  {sample.category}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
