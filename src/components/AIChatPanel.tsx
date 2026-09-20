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
  Zap,
  Film,
  Youtube,
  Instagram,
  Camera,
  Wand2,
  Flame,
  Eye,
  AtSign,
  Slash
} from 'lucide-react';
import { ChatMessage, ShotAnalysisData } from '../types';
import { ExtensionType } from './ExtensionsBar';
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

interface SkillCommand {
  id: string;
  trigger: string;
  aliases: string[];
  name: string;
  description: string;
  badge: 'Media' | 'Skill';
  icon: React.ElementType;
  type: 'action' | 'template';
  action?: () => void;
  template?: string;
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
  const [isManualMenuOpen, setIsManualMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Available skills & commands triggered by @ or /
  const SKILL_COMMANDS: SkillCommand[] = [
    {
      id: 'video',
      trigger: 'video',
      aliases: ['kadr', 'mp4', 'file'],
      name: 'Video & Kadr Ochish',
      description: 'MP4, MOV fayl yuklash yoki kadrlarni tahlil qilish',
      badge: 'Media',
      icon: Film,
      type: 'action',
      action: () => {
        onOpenFileUpload ? onOpenFileUpload() : onOpenExtension('video');
      },
    },
    {
      id: 'youtube',
      trigger: 'youtube',
      aliases: ['shorts', 'yt'],
      name: 'YouTube Shorts Tahlili',
      description: 'Havola orqali video, ssenariy va kadrlarni tahlil qilish',
      badge: 'Media',
      icon: Youtube,
      type: 'action',
      action: () => onOpenExtension('youtube'),
    },
    {
      id: 'reels',
      trigger: 'reels',
      aliases: ['instagram', 'insta'],
      name: 'Instagram Reels Tahlili',
      description: 'Viral Reels ssenariylari va 3-soniyalik hooklar',
      badge: 'Media',
      icon: Instagram,
      type: 'action',
      action: () => onOpenExtension('instagram'),
    },
    {
      id: 'camera',
      trigger: 'camera',
      aliases: ['kamera', 'pan', 'tilt', 'zoom', 'dolly'],
      name: 'Kamera Harakatlari (Sliders)',
      description: 'Pan, Tilt, Zoom, Roll va kinematik dinamika',
      badge: 'Skill',
      icon: Camera,
      type: 'action',
      action: () => onOpenExtension('camera_tools'),
    },
    {
      id: 'prompt',
      trigger: 'prompt',
      aliases: ['promt', 'runway', 'kling', 'sora', 'midjourney'],
      name: 'Kinematik Promt Shakllantirish',
      description: 'Runway Gen-3, Kling AI va Midjourney promtlari',
      badge: 'Skill',
      icon: Wand2,
      type: 'template',
      template: "Ushbu kadr uchun Runway Gen-3 va Midjourney v6 uchun kinematik promt yozib ber: ",
    },
    {
      id: 'hook',
      trigger: 'hook',
      aliases: ['viral', '3s', 'intro', 'ssenariy'],
      name: '3-Soniyalik Viral Hook',
      description: 'Auditoriyani to\'xtatib qoluvchi kuchli vizual hook ssenariysi',
      badge: 'Skill',
      icon: Flame,
      type: 'template',
      template: "Instagram Reels va YouTube Shorts uchun 3-soniyalik viral hook va ssenariy: ",
    },
    {
      id: 'shot',
      trigger: 'shot',
      aliases: ['optika', 'rang', 'yoruglik'],
      name: 'Kadr Optik Tahlili',
      description: 'Yorug\'lik sxemasi, fokal nuqta va ranglar gammasi tahlili',
      badge: 'Skill',
      icon: Eye,
      type: 'template',
      template: "Kadrdagi optika, kompozitsiya, rang gammasi va yoritishni professional tahlil qil: ",
    },
  ];

  // Detect @ or / trigger at cursor / end of input
  const commandMatch = input.match(/(?:^|\s)([/@])([a-zA-Z0-9_-]*)$/);
  const isTypingCommand = Boolean(commandMatch);
  const activeTriggerSymbol = commandMatch ? commandMatch[1] : '';
  const activeSearchQuery = commandMatch ? commandMatch[2].toLowerCase() : '';

  const isMenuOpen = isTypingCommand || isManualMenuOpen;

  // Filtered commands list
  const filteredCommands = SKILL_COMMANDS.filter((cmd) => {
    if (!activeSearchQuery) return true;
    return (
      cmd.trigger.includes(activeSearchQuery) ||
      cmd.name.toLowerCase().includes(activeSearchQuery) ||
      cmd.description.toLowerCase().includes(activeSearchQuery) ||
      cmd.aliases.some((a) => a.includes(activeSearchQuery))
    );
  });

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeSearchQuery, isMenuOpen]);

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

  const handleSelectCommand = (cmd: SkillCommand) => {
    if (cmd.type === 'action') {
      // Clean trigger from input if it was typed
      if (commandMatch) {
        const replaceIdx = input.lastIndexOf(commandMatch[0]);
        const nextInput = input.substring(0, replaceIdx).trim();
        setInput(nextInput);
      }
      setIsManualMenuOpen(false);
      if (cmd.action) cmd.action();
    } else if (cmd.type === 'template') {
      if (commandMatch) {
        const replaceIdx = input.lastIndexOf(commandMatch[0]);
        const prefix = input.substring(0, replaceIdx);
        const nextInput = prefix ? `${prefix.trim()} ${cmd.template || ''}` : (cmd.template || '');
        setInput(nextInput);
      } else {
        setInput((prev) => (prev ? `${prev.trim()} ${cmd.template || ''}` : (cmd.template || '')));
      }
      setIsManualMenuOpen(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const handleSubmit = (textToSend?: string) => {
    if (tokenStatus.inCooldown) {
      onOpenPlans?.();
      return;
    }

    const text = (textToSend || input).trim();
    if (!text && !attachedImage) return;

    onSendMessage(text, attachedImage || undefined);
    setInput('');
    setIsManualMenuOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMenuOpen && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          handleSelectCommand(selected);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsManualMenuOpen(false);
        return;
      }
    }

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
          <div className="pt-10 pb-6 text-center max-w-lg mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-2xs">
              <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                MayPrompt AI Rejissyor
              </h2>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Video kadr tahlili, kamera harakatlari va kinematik promtlar muhandisi
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

            {/* Command Helper Hint */}
            <div className="text-[11px] text-zinc-400 bg-zinc-50 border border-zinc-200/60 rounded-xl py-2 px-3 inline-flex items-center gap-1.5">
              <span>Maslahat:</span>
              <code className="bg-zinc-200/70 text-zinc-800 px-1 py-0.5 rounded font-mono font-semibold">@</code>
              <span>yoki</span>
              <code className="bg-zinc-200/70 text-zinc-800 px-1 py-0.5 rounded font-mono font-semibold">/</code>
              <span>yozib istalgan media va rejissura skillini chaqirishingiz mumkin</span>
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
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-800'
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
                          <Check className="w-3 h-3 text-zinc-800" />
                          <span className="text-zinc-800">Nusxalandi</span>
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
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">AI Rejissyor tahlil qilmoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Fixed Input Bar */}
      <div className="border-t border-zinc-200 bg-white p-3 sm:p-4 shrink-0">
        <div className="max-w-3xl mx-auto space-y-2 relative">

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

          {/* Active Context Shot indicator */}
          {currentShotData && (
            <div className="flex items-center justify-between px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600">
              <span className="truncate">Faol kadr: <strong>{currentShotData.summaryTitle || 'Tanlangan kadr'}</strong></span>
            </div>
          )}

          {/* Cooldown notice if tokens depleted */}
          {tokenStatus.inCooldown && (
            <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">
                    Gemini Free seans kvotasi yakunlandi
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Kvotangiz yangilanishiga qadar: <span className="font-mono font-bold text-zinc-800">{tokenStatus.formattedCountdown}</span>
                  </p>
                </div>
              </div>

              {onOpenPlans && (
                <button
                  type="button"
                  onClick={onOpenPlans}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-zinc-200" />
                  <span>Plus ($11.99) ga o'tish</span>
                </button>
              )}
            </div>
          )}

          {/* Autocomplete Dropdown Popover (Triggered by @ or /) */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute bottom-full mb-2 left-0 right-0 sm:left-2 sm:right-auto sm:w-[420px] max-h-80 overflow-y-auto bg-white border border-zinc-200 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150 scrollbar-none"
            >
              <div className="px-2.5 py-1.5 border-b border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded font-bold">
                    {activeTriggerSymbol || '@'}
                  </span>
                  <span>Vositalar va Rejissura Skillari</span>
                </div>
                <span className="text-[10px] text-zinc-400">
                  ↑↓ tanlash &bull; Enter ochish
                </span>
              </div>

              <div className="py-1 space-y-0.5">
                {filteredCommands.length === 0 ? (
                  <div className="p-3 text-center text-xs text-zinc-400">
                    Mos keluvchi buyruq yoki skill topilmadi
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        onClick={() => handleSelectCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                          isSelected ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-zinc-900 truncate">
                              {cmd.name}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate">
                              {cmd.description}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="text-[10px] font-mono font-medium text-zinc-500 bg-zinc-200/60 px-1.5 py-0.5 rounded-md">
                            /{cmd.trigger}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Minimalist Input Container */}
          <div className="relative flex items-end gap-1.5 bg-white border border-zinc-200 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-100 rounded-2xl p-2 transition-all shadow-xs">
            {/* Direct Skill/Command trigger button (@ or /) */}
            <button
              type="button"
              onClick={() => setIsManualMenuOpen(!isManualMenuOpen)}
              title="Rejissura vositalari va skillarni ko'rsatish (@ yoki /)"
              className={`p-2 rounded-xl transition-colors shrink-0 flex items-center gap-0.5 text-xs font-mono font-bold ${
                isMenuOpen
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span>@</span>
              <span className="text-[10px] text-zinc-400">/</span>
            </button>

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
              placeholder="Rejissyorga yozing yoki @ va / orqali vositalarni chaqiring..."
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
            <span className="flex items-center gap-1.5">
              <span>MayPrompt AI</span>
              <span>&bull;</span>
              <span>Kadr va Promt Rejissurasi</span>
            </span>

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
