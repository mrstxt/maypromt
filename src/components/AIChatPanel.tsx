import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Paperclip,
  X,
  ArrowUp,
  Trash2,
  Lock,
  Zap
} from 'lucide-react';
import { ChatMessage, ShotAnalysisData } from '../types';
import { ExtensionsBar, ExtensionType } from './ExtensionsBar';
import { useAuth } from '../context/AuthContext';

interface AIChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachedImg?: string) => void;
  isSending: boolean;
  currentShotData?: ShotAnalysisData | null;
  attachedImage?: string | null;
  onClearAttachedImage?: () => void;
  onOpenFileUpload?: () => void;
  onOpenExtension: (ext: ExtensionType) => void;
  onClearChat?: () => void;
  onOpenPlans?: () => void;
}

const QUICK_PROMPTS = [
  "Ushbu kadrni Kiberpank Neon uslubiga o'zgartirib Midjourney v6 promt yozib ber",
  "Runway Gen-3 uchun pastdan yuqoriga dinamik kamera harakati promti tuz",
  "Instagram Reels uchun 3 soniyalik viral hook ssenariysi tuz",
  "Kling AI uchun kamera harakat sozlamalarini ber"
];

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  messages,
  onSendMessage,
  isSending,
  currentShotData,
  attachedImage,
  onClearAttachedImage,
  onOpenFileUpload,
  onOpenExtension,
  onClearChat,
  onOpenPlans,
}) => {
  const { tokenStatus } = useAuth();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (textToSend?: string) => {
    if (tokenStatus.inCooldown) {
      onOpenPlans?.();
      return;
    }

    const text = (textToSend || input).trim();
    if (!text && !attachedImage) return;

    onSendMessage(text, attachedImage || undefined);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isNewChat = messages.length <= 1;

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 max-w-3xl mx-auto w-full">
        {/* Welcome Empty State */}
        {isNewChat && (
          <div className="pt-12 pb-6 text-center max-w-lg mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                MayPrompt AI Rejissyor
              </h2>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Video kadr tahlili, Midjourney &amp; Runway promtlari va Instagram marketing ssenariylari
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {QUICK_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSubmit(promptText)}
                  className="px-3.5 py-2 rounded-full border border-zinc-200 hover:border-zinc-300 bg-zinc-50/70 hover:bg-zinc-100 text-xs text-zinc-700 transition-colors text-left"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                  isAssistant ? 'bg-zinc-900' : 'bg-zinc-800'
                }`}
              >
                {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1 max-w-[85%] sm:max-w-[80%]">
                {msg.attachedImage && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-zinc-200 max-w-xs bg-zinc-950">
                    <img
                      src={msg.attachedImage}
                      alt="Attached frame"
                      className="w-full h-auto max-h-48 object-cover"
                    />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-zinc-50 border border-zinc-100/90 text-zinc-800'
                      : 'bg-zinc-900 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                <div
                  className={`flex items-center gap-2 text-[10px] text-zinc-400 px-1 ${
                    isAssistant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="text-zinc-400 hover:text-zinc-700 font-medium inline-flex items-center gap-1 transition-colors ml-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Nusxalandi</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Nusxa olish</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">AI Rejissyor yozmoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Fixed Input Bar */}
      <div className="border-t border-zinc-100 bg-white p-3 sm:p-4 shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Extensions row (clean pill buttons) */}
          <ExtensionsBar
            onSelectExtension={onOpenExtension}
            activeContextName={currentShotData?.summaryTitle}
          />

          {/* Attached image pill if active */}
          {attachedImage && (
            <div className="flex items-center justify-between p-1.5 pl-2.5 rounded-xl bg-zinc-100 text-xs text-zinc-700">
              <div className="flex items-center gap-2 truncate">
                <img
                  src={attachedImage}
                  alt="Attached"
                  className="w-7 h-7 rounded-lg object-cover border border-zinc-300 shrink-0"
                />
                <span className="text-xs font-medium truncate">Fayl biriktirildi</span>
              </div>
              {onClearAttachedImage && (
                <button
                  type="button"
                  onClick={onClearAttachedImage}
                  className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Cooldown notice if tokens depleted */}
          {tokenStatus.inCooldown && (
            <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-amber-950">
                    Gemini Free seans kvotasi yakunlandi
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Kvotangiz yangilanishiga qadar: <span className="font-mono font-bold">{tokenStatus.formattedCountdown}</span>
                  </p>
                </div>
              </div>

              {onOpenPlans && (
                <button
                  type="button"
                  onClick={onOpenPlans}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Plus ($11.99) ga o'tish</span>
                </button>
              )}
            </div>
          )}

          {/* Minimalist Input Container */}
          <div className="relative flex items-end gap-2 bg-white border border-zinc-200 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-100 rounded-2xl p-2 transition-all shadow-xs">
            {onOpenFileUpload && (
              <button
                type="button"
                onClick={onOpenFileUpload}
                title="Fayl ochish / biriktirish"
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            )}

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rejissyorga savol yozing yoki vazifa bering..."
              className="flex-1 max-h-32 py-1.5 text-xs sm:text-sm bg-transparent border-none text-zinc-900 placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed"
            />

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={(!input.trim() && !attachedImage) || isSending}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-black disabled:opacity-20 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span>MayPrompt AI</span>
            {onClearChat && messages.length > 1 && (
              <button
                onClick={onClearChat}
                className="hover:text-zinc-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Tozalash</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
