import React from 'react';
import { X, Film, Youtube, Instagram, ChevronLeft } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { VideoFrameCapture } from './VideoFrameCapture';
import { YouTubeInput } from './YouTubeInput';
import { InstagramAnalyzer } from './InstagramAnalyzer';
import { AnalysisPanel } from './AnalysisPanel';
import { ShotAnalysisData, SampleVideoItem } from '../types';

export type ActiveExtensionModal =
  | 'video_upload'
  | 'youtube'
  | 'instagram'
  | 'full_analysis'
  | null;

interface ExtensionModalProps {
  activeModal: ActiveExtensionModal;
  onClose: () => void;
  // Video upload props
  videoFile: File | null;
  onVideoSelected: (file: File) => void;
  onFramesCaptured: (images: string[]) => void;
  onCancelVideo: () => void;
  onImagesSelected: (images: string[]) => void;
  onSelectSample: (sample: SampleVideoItem) => void;
  isAnalyzing: boolean;
  // YouTube props
  onAnalyzeYouTube: (thumbUrl: string, title: string) => void;
  // Instagram props
  onSendInstagramToShotPrompter: (imageUrl: string) => void;
  // Full analysis props
  analysisResult: ShotAnalysisData | null;
  activeImages: string[];
  onRefinePrompt: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onResetAnalysis: () => void;
  onSendAnalysisToChat: (summaryPrompt: string) => void;
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  activeModal,
  onClose,
  videoFile,
  onVideoSelected,
  onFramesCaptured,
  onCancelVideo,
  onImagesSelected,
  onSelectSample,
  isAnalyzing,
  onAnalyzeYouTube,
  onSendInstagramToShotPrompter,
  analysisResult,
  activeImages,
  onRefinePrompt,
  isRefining,
  onResetAnalysis,
  onSendAnalysisToChat,
}) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-zinc-200">
        {/* Modal Topbar */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            {activeModal === 'video_upload' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">
                    Video &amp; Kadr Tahlili
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Video yuklang yoki aniq kadrni belgilab promt oling
                  </p>
                </div>
              </>
            )}

            {activeModal === 'youtube' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">
                    YouTube &amp; Shorts Skaneri
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    YouTube video yoki Shorts havolasidan kadr ajratib promt olish
                  </p>
                </div>
              </>
            )}

            {activeModal === 'instagram' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">
                    Instagram Profil Tahlili &amp; Viral Reels
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Statistika, 3-soniyalik ssenariylar va trend strategiyalari
                  </p>
                </div>
              </>
            )}

            {activeModal === 'full_analysis' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">
                    Batafsil Optika &amp; Promt Natijasi
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Midjourney, Runway Gen-3, Kling AI va mobil syomka blueprint
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeModal === 'full_analysis' && analysisResult && (
              <button
                type="button"
                onClick={() => {
                  onSendAnalysisToChat(
                    `Quyidagi kadr tahlilini oldim: "${analysisResult.summaryTitle}". Midjourney promti: ${analysisResult.prompts.midjourney}. Runway: ${analysisResult.prompts.runwayGen3?.prompt}. Ushbu kadr bo'yicha ssenariyni davom ettirib ber.`
                  );
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                Chatga yuborish
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/40">
          {/* VIDEO UPLOAD VIEW */}
          {activeModal === 'video_upload' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {videoFile ? (
                <VideoFrameCapture
                  videoFile={videoFile}
                  onFramesSelected={(frames: string[]) => {
                    onFramesCaptured(frames);
                    onClose();
                  }}
                  onResetVideo={onCancelVideo}
                />
              ) : (
                <UploadZone
                  onVideoSelected={onVideoSelected}
                  onImagesSelected={(imgs) => {
                    onImagesSelected(imgs);
                    onClose();
                  }}
                  onSelectSample={(sample) => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  isAnalyzing={isAnalyzing}
                />
              )}
            </div>
          )}

          {/* YOUTUBE VIEW */}
          {activeModal === 'youtube' && (
            <div className="max-w-2xl mx-auto py-2">
              <YouTubeInput
                onAnalyzeThumbnail={(thumb: string, title: string) => {
                  onAnalyzeYouTube(thumb, title);
                  onClose();
                }}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}

          {/* INSTAGRAM VIEW */}
          {activeModal === 'instagram' && (
            <div>
              <InstagramAnalyzer
                onSendToShotPrompter={(img) => {
                  onSendInstagramToShotPrompter(img);
                  onClose();
                }}
              />
            </div>
          )}

          {/* FULL ANALYSIS VIEW */}
          {activeModal === 'full_analysis' && analysisResult && (
            <div>
              <AnalysisPanel
                data={analysisResult}
                activeImages={activeImages}
                onRefinePrompt={onRefinePrompt}
                isRefining={isRefining}
                onReset={onResetAnalysis}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
