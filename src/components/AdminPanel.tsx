import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Lock,
  DollarSign
} from 'lucide-react';
import { MarketingBookItem, UserPlan, PlanConfig, TokenAllocationConfig } from '../types';
import { useAuth } from '../context/AuthContext';
import { getDynamicPlans, saveDynamicPlans } from '../data/plans';
import {
  getTokenConfig,
  saveTokenConfig,
  resetTokenBufferState,
  DEFAULT_TOKEN_CONFIG
} from '../services/tokenBufferEngine';

export const AdminPanel: React.FC = () => {
  const { user, refreshPlans, resetTokenBuffer } = useAuth();
  const [activeTab, setActiveTab] = useState<'books' | 'pricing_algorithm'>('pricing_algorithm');

  // Books state
  const [books, setBooks] = useState<MarketingBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Reels & Virallik');
  const [summary, setSummary] = useState('');
  const [keyInsights, setKeyInsights] = useState('');
  const [contentSnippet, setContentSnippet] = useState('');
  const [savingBook, setSavingBook] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pricing & Plans state
  const [editablePlans, setEditablePlans] = useState<Record<UserPlan, PlanConfig>>(() => getDynamicPlans());
  const [plusFeaturesText, setPlusFeaturesText] = useState(
    editablePlans.plus.features.join('\n')
  );
  const [proFeaturesText, setProFeaturesText] = useState(
    editablePlans.pro.features.join('\n')
  );

  // Token Engine Config state
  const [tokenConfig, setTokenConfig] = useState<TokenAllocationConfig>(() => getTokenConfig());
  const [planSaveNotice, setPlanSaveNotice] = useState<string | null>(null);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setStatusMsg({ type: 'error', text: "Kitob nomi va qisqacha mazmuni to'ldirilishi shart." });
      return;
    }

    setSavingBook(true);
    setStatusMsg(null);

    try {
      const insightsArray = keyInsights
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          category,
          summary,
          keyInsights: insightsArray,
          contentSnippet,
        }),
      });

      if (!res.ok) {
        throw new Error("Kitobni saqlashda xatolik yuz berdi.");
      }

      setStatusMsg({ type: 'success', text: "Marketing kitobi muvaffaqiyatli saqlandi! Gemini buni tahlillarda darhol qo'llaydi." });
      setTitle('');
      setAuthor('');
      setSummary('');
      setKeyInsights('');
      setContentSnippet('');
      setShowAddForm(false);
      fetchBooks();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || "Xatolik yuz berdi" });
    } finally {
      setSavingBook(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Haqiqatan ham ushbu kitob bilimini o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBooks();
      }
    } catch {
      // ignore
    }
  };

  // Save Pricing and Algorithm
  const handleSavePricingAndAlgorithm = () => {
    // 1. Update plans with new features and calculate total price
    const updatedPlusPrice = Number((editablePlans.plus.googleBasePriceUSD + editablePlans.plus.markupUSD).toFixed(2));
    const updatedProPrice = Number((editablePlans.pro.googleBasePriceUSD + editablePlans.pro.markupUSD).toFixed(2));

    const updatedPlans: Record<UserPlan, PlanConfig> = {
      ...editablePlans,
      plus: {
        ...editablePlans.plus,
        priceUSD: updatedPlusPrice,
        priceLabel: `$${updatedPlusPrice} / oy`,
        features: plusFeaturesText.split('\n').map((s) => s.trim()).filter((s) => s.length > 0),
      },
      pro: {
        ...editablePlans.pro,
        priceUSD: updatedProPrice,
        priceLabel: `$${updatedProPrice} / oy`,
        features: proFeaturesText.split('\n').map((s) => s.trim()).filter((s) => s.length > 0),
      },
    };

    saveDynamicPlans(updatedPlans);
    setEditablePlans(updatedPlans);

    // 2. Save Token Algorithm Config
    saveTokenConfig(tokenConfig);

    // 3. Trigger Context Refresh
    refreshPlans();

    setPlanSaveNotice("Ta'rif narxlari va Token algoritmi muvaffaqiyatli saqlandi!");
    setTimeout(() => setPlanSaveNotice(null), 3000);
  };

  const handleResetCooldown = () => {
    resetTokenBufferState();
    resetTokenBuffer();
    setPlanSaveNotice("Foydalanuvchi token zaxirasi va Cooldown davri 0 ga qayta tiklandi (Test muvaffaqiyatli)!");
    setTimeout(() => setPlanSaveNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-white min-h-full">
      {/* Admin Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                MayPrompt Admin Boshqaruv Markazi
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[10px] font-bold border border-zinc-200">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Marketing kitoblari (RAG), Plus/Pro narxlari va 70/30 Token algoritmini boshqarish
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-mono bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
            {user?.email || "baytirp.uz@gmail.com"}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('pricing_algorithm')}
          className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 transition-all relative ${
            activeTab === 'pricing_algorithm'
              ? 'text-zinc-900 border-b-2 border-zinc-900'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ta'riflar, Narxlar &amp; Token Algoritmi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 transition-all relative ${
            activeTab === 'books'
              ? 'text-zinc-900 border-b-2 border-zinc-900'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Marketing Kitoblari &amp; RAG Skills ({books.length})</span>
        </button>
      </div>

      {/* Global save notice */}
      {planSaveNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{planSaveNotice}</span>
        </div>
      )}

      {/* TAB 1: PRICING & TOKEN ALGORITHM */}
      {activeTab === 'pricing_algorithm' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 1. Dynamic Pricing Management (Google Base + $1-$2 Markup) */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-zinc-700" />
                  Ta'riflar va Narxlar Boshqaruvi (Google + MayPrompt Ustamasi)
                </h3>
                <p className="text-xs text-zinc-500">
                  Google One narxiga $1–$2 ustama qo'shib, MayPrompt'ning barcha maxsus rejissura vositalarini monetizatsiya qiling.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetCooldown}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                title="Sinov paytida limitni tozalash"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Test: Token/Cooldownni Reset qilish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* PLUS PLAN CONFIG */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-xs text-zinc-900">Gemini Plus Ta'rifi</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    Jami: ${(editablePlans.plus.googleBasePriceUSD + editablePlans.plus.markupUSD).toFixed(2)} / oy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                      Google Bazaviy Narxi ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editablePlans.plus.googleBasePriceUSD}
                      onChange={(e) =>
                        setEditablePlans({
                          ...editablePlans,
                          plus: { ...editablePlans.plus, googleBasePriceUSD: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                      MayPrompt Ustamasi ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editablePlans.plus.markupUSD}
                      onChange={(e) =>
                        setEditablePlans({
                          ...editablePlans,
                          plus: { ...editablePlans.plus, markupUSD: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                    Ta'rif Tagline (Qisqa ta'rif):
                  </label>
                  <input
                    type="text"
                    value={editablePlans.plus.tagline}
                    onChange={(e) =>
                      setEditablePlans({
                        ...editablePlans,
                        plus: { ...editablePlans.plus, tagline: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                    Plus ichiga nimalar kiradi (Har bir qator bitta xususiyat):
                  </label>
                  <textarea
                    rows={4}
                    value={plusFeaturesText}
                    onChange={(e) => setPlusFeaturesText(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-mono leading-relaxed"
                  />
                </div>
              </div>

              {/* PRO PLAN CONFIG */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs text-zinc-900">Gemini Pro (Cheklovsiz)</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    Jami: ${(editablePlans.pro.googleBasePriceUSD + editablePlans.pro.markupUSD).toFixed(2)} / oy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                      Google Bazaviy Narxi ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editablePlans.pro.googleBasePriceUSD}
                      onChange={(e) =>
                        setEditablePlans({
                          ...editablePlans,
                          pro: { ...editablePlans.pro, googleBasePriceUSD: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                      MayPrompt Ustamasi ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editablePlans.pro.markupUSD}
                      onChange={(e) =>
                        setEditablePlans({
                          ...editablePlans,
                          pro: { ...editablePlans.pro, markupUSD: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                    Ta'rif Tagline (Qisqa ta'rif):
                  </label>
                  <input
                    type="text"
                    value={editablePlans.pro.tagline}
                    onChange={(e) =>
                      setEditablePlans({
                        ...editablePlans,
                        pro: { ...editablePlans.pro, tagline: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                    Pro ichiga nimalar kiradi (Har bir qator bitta xususiyat):
                  </label>
                  <textarea
                    rows={4}
                    value={proFeaturesText}
                    onChange={(e) => setProFeaturesText(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-mono leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Token Allocation & Smoothing Algorithm Settings */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-4">
            <div className="pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-zinc-700" />
                Aqlli Token Taqsimlash va Sovutish (Cooldown) Algoritmi
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Google Free hisobidagi limitlarni foydalanuvchiga silliq taqsimlash va yangi chatlarni vaqtinchalik bloklash qoidalari.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Asosiy Taqsimot (Userga):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="50"
                    max="90"
                    value={Math.round(tokenConfig.primaryRatio * 100)}
                    onChange={(e) =>
                      setTokenConfig({
                        ...tokenConfig,
                        primaryRatio: (parseInt(e.target.value) || 70) / 100,
                        bufferRatio: 1 - (parseInt(e.target.value) || 70) / 100,
                      })
                    }
                    className="w-16 px-2 py-1 bg-white border border-zinc-300 rounded font-bold font-mono text-zinc-900"
                  />
                  <span className="text-zinc-600 font-bold">%</span>
                </div>
                <p className="text-[10px] text-zinc-400">Tezkor to'g'ridan-to'g'ri foydalanish uchun</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Zaxira Bufer (Smoothing):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    readOnly
                    value={Math.round(tokenConfig.bufferRatio * 100)}
                    className="w-16 px-2 py-1 bg-zinc-100 border border-zinc-300 rounded font-bold font-mono text-zinc-600"
                  />
                  <span className="text-zinc-600 font-bold">%</span>
                </div>
                <p className="text-[10px] text-zinc-400">Uzilishni oldini oluvchi silliq zaxira</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Ko'rsatiladigan Tiklanish:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={tokenConfig.displayRechargeWindowHours}
                    onChange={(e) =>
                      setTokenConfig({
                        ...tokenConfig,
                        displayRechargeWindowHours: parseInt(e.target.value) || 6,
                      })
                    }
                    className="w-16 px-2 py-1 bg-white border border-zinc-300 rounded font-bold font-mono text-zinc-900"
                  />
                  <span className="text-zinc-600 font-semibold">soat</span>
                </div>
                <p className="text-[10px] text-zinc-400">Google 4 soatda beradi, biz 6 soatga bo'lamiz</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Cooldown (Uzilish):
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={tokenConfig.cooldownMinHours}
                    onChange={(e) =>
                      setTokenConfig({
                        ...tokenConfig,
                        cooldownMinHours: parseInt(e.target.value) || 2,
                      })
                    }
                    className="w-12 px-1.5 py-1 bg-white border border-zinc-300 rounded font-mono font-bold text-center"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={tokenConfig.cooldownMaxHours}
                    onChange={(e) =>
                      setTokenConfig({
                        ...tokenConfig,
                        cooldownMaxHours: parseInt(e.target.value) || 4,
                      })
                    }
                    className="w-12 px-1.5 py-1 bg-white border border-zinc-300 rounded font-mono font-bold text-center"
                  />
                  <span className="text-zinc-600 font-semibold">soat</span>
                </div>
                <p className="text-[10px] text-zinc-400">Limit tugaganda chatlar bloklanish vaqti</p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleSavePricingAndAlgorithm}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs active:scale-98 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Barcha Ta'rif va Algoritm Sozlamalarini Saqlash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKS & RAG SKILLS */}
      {activeTab === 'books' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Marketing Kitoblari &amp; RAG Mahoratlari
              </h3>
              <p className="text-xs text-zinc-500">
                Alex Hormozi, Russell Brunson, Robert Cialdini va boshqa mualliflar bilimlari
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Kitob Qo'shish</span>
            </button>
          </div>

          {/* Add Book Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateBook}
              className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 space-y-4 animate-in fade-in"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Kitob Nomi:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="$100M Offers"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Muallif:</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Alex Hormozi"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Kategoriya:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900"
                  >
                    <option value="Reels & Virallik">Reels &amp; Virallik</option>
                    <option value="Sotuv & Ofer">Sotuv &amp; Ofer</option>
                    <option value="Psixologiya & Ta'sir">Psixologiya &amp; Ta'sir</option>
                    <option value="Storytelling & Rejissura">Storytelling &amp; Rejissura</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Qisqacha Mazmun:</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Kitobning asosiy g'oyasi..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Asosiy Qoidalar (Har bir qator bitta qoida):</label>
                <textarea
                  rows={3}
                  value={keyInsights}
                  onChange={(e) => setKeyInsights(e.target.value)}
                  placeholder="1. Birinchi 3 soniya hook&#10;2. Qiymatni oshirish&#10;3. Aniq CTA"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Batafsil Konsept / Ssenariy Qo'llanmasi:</label>
                <textarea
                  rows={3}
                  value={contentSnippet}
                  onChange={(e) => setContentSnippet(e.target.value)}
                  placeholder="Gemini tahlil qilayotganda foydalanishi uchun batafsil ko'rsatmalar..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-200 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingBook}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  {savingBook ? 'Saqlanmoqda...' : 'Kitobni Saqlash'}
                </button>
              </div>
            </form>
          )}

          {/* Books List */}
          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900">{book.title}</h4>
                    <span className="text-[11px] text-zinc-500">({book.author})</span>
                  </div>

                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 rounded"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-zinc-600">{book.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
