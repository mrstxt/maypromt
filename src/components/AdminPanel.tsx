import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Plus,
  Trash2,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Flame,
  Activity,
  Users
} from 'lucide-react';
import { MarketingBookItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<MarketingBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Reels & Virallik');
  const [summary, setSummary] = useState('');
  const [keyInsights, setKeyInsights] = useState('');
  const [contentSnippet, setContentSnippet] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch books from server
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

    setSaving(true);
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

      setStatusMsg({ type: 'success', text: "Yangi marketing kitobi/mahorati muvaffaqiyatli saqlandi! Gemini buni yangi foydalanuvchilar tahlilida darhol qo'llaydi." });
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
      setSaving(false);
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

  // Quick file drop/paste simulation for PDF text extraction
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setSummary(text.slice(0, 300) + '...');
        setContentSnippet(text.slice(0, 1500));
        setKeyInsights("1. Boshlang'ich kadr kutilmagan harakat bilan ochilishi shart\n2. Tomoshabin og'rig'iga teginuvchi savol\n3. Aniq va bitta chaqiriq (CTA)");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-900 to-zinc-700 flex items-center justify-center text-amber-400 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                  MayPrompt Admin Boshqaruv Paneli
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Marketing kitoblari, PDF mahoratlari (skills) va Gemini tahlil tizimi bilimlar bazasini boshqarish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-3 py-1.5 rounded-xl">
              Admin: {user?.email || "baytirp.uz@gmail.com"}
            </span>
          </div>
        </div>

        {/* System KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">Faol Marketing Kitoblar:</span>
              <BookOpen className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900 mt-1">
              {books.length} ta
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Gemini avtomatik ravishda tahlillarda foydalanadi
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">Tizim holati:</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              100% Onlayn
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Gemini 3.8 Flash Vision API faol
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">Dushanba VIP Drop:</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900 mt-1">
              09:00 — 19:00
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Haftalik avtomatlashgan oynasi
            </p>
          </div>
        </div>
      </div>

      {/* Knowledge Base Books Section */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-500" />
              Marketing &amp; Rejissura Kitoblari Bazasi (Skills)
            </h3>
            <p className="text-xs text-zinc-500">
              Bu yerga qo'shilgan har bir kitob yoki PDF matni Instagram va video tahlilida sun'iy intellekt tomonidan o'rganiladi
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Bekor qilish' : 'Yangi Kitob / PDF Qo\'shish'}</span>
          </button>
        </div>

        {statusMsg && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Add Book Form */}
        {showAddForm && (
          <form onSubmit={handleCreateBook} className="p-5 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 animate-in fade-in duration-200">
            <h4 className="text-sm font-extrabold text-zinc-900">
              Yangi Marketing Bilimi / PDF Rezyumesini Kiritish:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-zinc-700">Kitob / Qo'llanma Nomi:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: '$100M Leads' yoki 'Instagram Algoritmlari Sirlari'..."
                  className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Muallif:</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Masalan: Alex Hormozi, Robert Cialdini..."
                  className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Kategoriya:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Reels & Virallik">Reels &amp; Virallik (Hook &amp; Retention)</option>
                  <option value="Sotuv va Konversiya">Sotuv va Konversiya (Copywriting)</option>
                  <option value="Syomka & Rejissura">Syomka &amp; Rejissura (Kamera va Rakurs)</option>
                  <option value="Brending & Psixologiya">Brending &amp; Psixologiya</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">PDF / Matn Faylidan Yuklash (Ixtiyoriy):</label>
                <input
                  type="file"
                  accept=".txt,.md,.json,.pdf"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Qisqacha Mazmuni va Asosiy Konsept:</label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Ushbu kitob nima haqida va u kontentmakerga qanday yordam beradi..."
                className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Asosiy Qoidalar / Insaytlar (Har bir qator alohida qoida):</label>
              <textarea
                rows={3}
                value={keyInsights}
                onChange={(e) => setKeyInsights(e.target.value)}
                placeholder="1. Pattern interrupt qoidasi&#10;2. Curiosity gap shakllantirish&#10;3. Call to action..."
                className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Batafsil Matn / Ko'rsatma (Gemini o'qishi uchun):</label>
              <textarea
                rows={3}
                value={contentSnippet}
                onChange={(e) => setContentSnippet(e.target.value)}
                placeholder="Kitobdan olingan eng muhim marketing tavsiyalari va ssenariy formulalari..."
                className="w-full text-xs bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 rounded-xl transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>{saving ? 'Saqlanmoqda...' : 'Bazaga Saqlash'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Books List */}
        <div className="space-y-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-zinc-50/60 hover:bg-white hover:border-orange-300 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900">
                      {book.title}
                    </h4>
                    <span className="text-[11px] text-zinc-500">
                      Muallif: <strong>{book.author}</strong> • {book.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Faol (Skills)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Kitobni o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {book.summary}
              </p>

              {book.keyInsights && book.keyInsights.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-zinc-700 block mb-1">
                    Asosiy qoidalar:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-zinc-600 font-mono">
                    {book.keyInsights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-orange-500 font-bold">✓</span>
                        <span className="truncate">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
