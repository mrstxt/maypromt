import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Camera, Trash2, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

interface CapturedFrame {
  id: string;
  dataUrl: string;
  timestamp: number;
  label?: string;
}

interface VideoFrameCaptureProps {
  videoFile: File;
  onFramesSelected: (frames: string[]) => void;
  onResetVideo: () => void;
}

export const VideoFrameCapture: React.FC<VideoFrameCaptureProps> = ({
  videoFile,
  onFramesSelected,
  onResetVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [capturedFrames, setCapturedFrames] = useState<CapturedFrame[]>([]);
  const [autoExtracting, setAutoExtracting] = useState<boolean>(false);

  useEffect(() => {
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      // Auto capture first frame once loaded
      setTimeout(() => {
        captureCurrentFrame('0:00 (Boshlanish)');
      }, 300);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const captureCurrentFrame = (customLabel?: string) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Scale canvas to video natural dimensions with max width 1280
    const scale = Math.min(1, 1280 / (video.videoWidth || 1280));
    canvas.width = (video.videoWidth || 640) * scale;
    canvas.height = (video.videoHeight || 360) * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    const timeFormatted = formatTime(video.currentTime);
    const newFrame: CapturedFrame = {
      id: 'frame-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      dataUrl,
      timestamp: video.currentTime,
      label: customLabel || `${timeFormatted} kadr`,
    };

    setCapturedFrames((prev) => {
      const updated = [...prev, newFrame].slice(-5); // keep up to 5 best frames
      onFramesSelected(updated.map((f) => f.dataUrl));
      return updated;
    });
  };

  const removeFrame = (id: string) => {
    setCapturedFrames((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFramesSelected(updated.map((f) => f.dataUrl));
      return updated;
    });
  };

  const autoExtractKeyframes = async () => {
    const video = videoRef.current;
    if (!video || !duration) return;

    setAutoExtracting(true);
    video.pause();
    setIsPlaying(false);

    const points = [
      { ratio: 0.15, label: 'Kadr 1 (Ekspozitsiya)' },
      { ratio: 0.5, label: 'Kadr 2 (Asosiy rakurs)' },
      { ratio: 0.85, label: 'Kadr 3 (Kulminatsiya)' },
    ];

    const extracted: CapturedFrame[] = [];

    for (const point of points) {
      const seekTime = duration * point.ratio;
      video.currentTime = seekTime;
      // Wait for seeked event
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });

      const canvas = canvasRef.current;
      if (canvas) {
        const scale = Math.min(1, 1280 / (video.videoWidth || 1280));
        canvas.width = (video.videoWidth || 640) * scale;
        canvas.height = (video.videoHeight || 360) * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          extracted.push({
            id: 'auto-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
            dataUrl,
            timestamp: seekTime,
            label: point.label,
          });
        }
      }
    }

    setCapturedFrames(extracted);
    onFramesSelected(extracted.map((f) => f.dataUrl));
    setAutoExtracting(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 rounded-2xl p-4 sm:p-5 shadow-lg border border-zinc-800">
      {/* Video display and Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Video Pleyer &amp; Kadr Tutgich
          </span>
          <span className="text-xs text-zinc-500 font-mono">({videoFile.name})</span>
        </div>

        <button
          onClick={onResetVideo}
          className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-800/80"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Boshqa video
        </button>
      </div>

      <div className="mt-3 relative aspect-video max-h-[380px] w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          playsInline
          className="max-h-full max-w-full object-contain"
        />
        {/* Hidden canvas for snapshotting */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Playback bar & Scrubber */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-md shadow-orange-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <span className="text-xs font-mono text-zinc-400 w-24">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 1}
            step="0.05"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Capture Action Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => captureCurrentFrame()}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700 shadow-sm"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              Ushbu kadrni saqlash ({formatTime(currentTime)})
            </button>

            <button
              onClick={autoExtractKeyframes}
              disabled={autoExtracting}
              className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700/60"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              {autoExtracting ? "Kadrlar olinmoqda..." : "Avtomatik 3 kadr"}
            </button>
          </div>

          <span className="text-xs text-zinc-400">
            Tanlangan: <strong className="text-orange-400">{capturedFrames.length}</strong> / 5 kadr
          </span>
        </div>
      </div>

      {/* Captured Frames Gallery */}
      {capturedFrames.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <p className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Tahlil uchun tanlangan kadrlar:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {capturedFrames.map((frame, idx) => (
              <div
                key={frame.id}
                className="group relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 aspect-video"
              >
                <img
                  src={frame.dataUrl}
                  alt={`Kadr ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-1.5">
                  <span className="text-[10px] font-mono bg-black/70 text-zinc-200 px-1 py-0.5 rounded">
                    {formatTime(frame.timestamp)}
                  </span>
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 pointer-events-none">
                  <span className="text-[9px] font-semibold bg-black/80 text-orange-400 px-1 rounded">
                    #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
