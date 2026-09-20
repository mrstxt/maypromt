import React, { useState } from 'react';
import {
  X,
  Camera,
  Film,
  Sparkles,
  Zap,
  ArrowRight,
  Sliders,
  Move,
  ZoomIn,
  RefreshCw
} from 'lucide-react';

interface CameraToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (promptText: string) => void;
}

const PRESET_CAMERA_MOVES = [
  {
    title: "Dolly Zoom (Vertigo Effect)",
    tool: "Runway Gen-3 / Kling",
    desc: "Kamera orqaga siljiydi, ob'ektiv esa oldinga yaqinlashadi (fon kengayadi, qahramon o'z joyida qoladi)",
    prompt: "Camera: Dolly zoom (Hitchcock vertigo effect), camera dollys out while zooming in, background expands dramatically, 8k cinematic motion blur, intense focus on subject.",
    badge: "Kino Shok",
  },
  {
    title: "Low-Angle Whip Pan",
    tool: "Runway Gen-3",
    desc: "Pastki rakursdan yuqoriga qaragan holda yon tomonga keskin dinamik o'tish harakati",
    prompt: "Camera: Low-angle whip pan from left to right, high-speed camera motion, dynamic motion blur, dramatic upward angle looking at subject, anamorphic flare.",
    badge: "Dinamik Harakat",
  },
  {
    title: "360 Orbit Drone Shot",
    tool: "Kling AI",
    desc: "Ob'ekt atrofida 360 daraja silliq aylanma parvoz, osmon va shahar manzarasi bilan",
    prompt: "Camera: Smooth 360-degree orbit shot around subject, FPV drone cinematography, golden hour lighting, cinematic parallax effect, hyper-realistic physics.",
    badge: "Drone FPV",
  },
  {
    title: "Macro Slow Push-in (Ko'z va Mimika)",
    tool: "Midjourney / Kling",
    desc: "Sekin-asta yuz va ko'z nigohiga mikroskopik darajada yaqinlashish (emotional tension)",
    prompt: "Camera: Extreme close-up macro slow push-in towards subject's eyes, shallow depth of field, 85mm f/1.2 lens bokeh, micro skin textures and subtle eye movement.",
    badge: "Mimika & Drama",
  },
  {
    title: "Dutch Angle Tracking Run",
    tool: "Runway Gen-3",
    desc: "Kamera 20 daraja qiyshiq (Dutch tilt) holatda qahramon orqasidan ergashib yuguradi",
    prompt: "Camera: Dynamic Dutch angle tilt (20 degrees), fast tracking shot following subject running, gritty urban atmosphere, anamorphic 2.39:1 aspect ratio, cinematic tension.",
    badge: "Triller & Adrenalin",
  },
];

export const CameraToolsModal: React.FC<CameraToolsModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [selectedPan, setSelectedPan] = useState<string>('0%');
  const [selectedTilt, setSelectedTilt] = useState<string>('0%');
  const [selectedZoom, setSelectedZoom] = useState<string>('0%');

  if (!isOpen) return null;

  const handleApplyCustom = () => {
    const text = `Kling AI va Runway uchun maxsus kamera harakat parametrlarini generatsiya qil:
- Pan (Gorizontal burilish): ${selectedPan}
- Tilt (Vertikal burchak): ${selectedTilt}
- Zoom (Yaqinlashish/Uzoqlashish): ${selectedZoom}
Ushbu harakatlar uchun to'liq kinematografik prompt va harakat cho'tkasi (motion brush) ko'rsatmasini yozib ber.`;
    onSendToChat(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-sm shadow-indigo-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-zinc-900 text-base">
                Kling &amp; Runway Kamera Rejissyori
              </h3>
              <p className="text-xs text-zinc-500">
                Tayyor kinematografik harakatlar yoki maxsus pan/tilt/zoom sozlamalari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Section: Custom Slider Settings */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Maxsus Kamera O'qlari (Kling AI Parameter Controls)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                  Pan (Gorizontal): {selectedPan}
                </label>
                <select
                  value={selectedPan}
                  onChange={(e) => setSelectedPan(e.target.value)}
                  className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="-50%">Chapga keskin (-50%)</option>
                  <option value="-20%">Chapga sekin (-20%)</option>
                  <option value="0%">Markazda (0%)</option>
                  <option value="+20%">O'ngga sekin (+20%)</option>
                  <option value="+50%">O'ngga keskin (+50%)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                  Tilt (Burchak): {selectedTilt}
                </label>
                <select
                  value={selectedTilt}
                  onChange={(e) => setSelectedTilt(e.target.value)}
                  className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="+35%">Pastdan yuqoriga (+35% Low)</option>
                  <option value="+15%">Biroz yuqoriga (+15%)</option>
                  <option value="0%">To'g'ri (0%)</option>
                  <option value="-15%">Biroz pastga (-15%)</option>
                  <option value="-35%">Tepadanto'g'ri pastga (-35% High)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                  Zoom: {selectedZoom}
                </label>
                <select
                  value={selectedZoom}
                  onChange={(e) => setSelectedZoom(e.target.value)}
                  className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="+40%">Tez yaqinlashish (+40%)</option>
                  <option value="+15%">Sekin yaqinlashish (+15%)</option>
                  <option value="0%">Statik (0%)</option>
                  <option value="-15%">Sekin uzoqlashish (-15%)</option>
                  <option value="-40%">Tez uzoqlashish (-40%)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleApplyCustom}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ushbu Kamera Sozlamasini AI Chatga Yuborish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section: Kinematografik Presets */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Tayyor Rejissura Harakatlari:
            </h4>

            <div className="space-y-2">
              {PRESET_CAMERA_MOVES.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl border border-zinc-200 hover:border-indigo-400 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900">{item.title}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">{item.desc}</p>
                  </div>

                  <button
                    onClick={() => {
                      onSendToChat(`Ushbu kamera harakatini qo'llab, mening sahnama to'liq video prompt tuz: "${item.prompt}"`);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-indigo-600 hover:text-white text-zinc-700 text-xs font-semibold transition-colors shrink-0 text-center"
                  >
                    Chatga qo'shish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
