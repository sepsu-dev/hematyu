"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { User, Save, Tag, Plus, Trash2, Check } from "lucide-react";

const DEFAULT_INCOME_CATS = [
  "Gaji / Pendapatan",
  "Freelance / Projek",
  "Bonus",
  "Investasi",
  "Penjualan",
  "Lainnya",
];

const DEFAULT_EXPENSE_CATS = [
  "Makanan & Minuman",
  "Tagihan & Listrik",
  "Belanja / Toko",
  "Transportasi",
  "Langganan / Media",
  "Kesehatan",
  "Hiburan",
  "Pendidikan",
  "Lainnya",
];

type Tab = "profile" | "kategori";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    if (searchParams.get("tab") === "kategori") {
      setActiveTab("kategori");
    }
  }, [searchParams]);

  // Profile
  const [profile, setProfile] = useState({
    name: "Jason David",
    email: "jason.david@example.com",
    phone: "+62 812 3456 7890",
  });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Categories
  const [incomeCats, setIncomeCats] = useState<string[]>(DEFAULT_INCOME_CATS);
  const [expenseCats, setExpenseCats] = useState<string[]>(DEFAULT_EXPENSE_CATS);
  const [newIncome, setNewIncome] = useState("");
  const [newExpense, setNewExpense] = useState("");
  const [catSaved, setCatSaved] = useState(false);

  const addCat = (type: "income" | "expense") => {
    if (type === "income") {
      const val = newIncome.trim();
      if (!val || incomeCats.includes(val)) return;
      setIncomeCats(prev => [...prev, val]);
      setNewIncome("");
    } else {
      const val = newExpense.trim();
      if (!val || expenseCats.includes(val)) return;
      setExpenseCats(prev => [...prev, val]);
      setNewExpense("");
    }
  };

  const removeCat = (type: "income" | "expense", cat: string) => {
    if (type === "income") setIncomeCats(prev => prev.filter(c => c !== cat));
    else setExpenseCats(prev => prev.filter(c => c !== cat));
  };

  const handleSaveCats = () => {
    setCatSaved(true);
    setTimeout(() => setCatSaved(false), 2500);
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",  label: "Profil",   icon: <User className="w-3.5 h-3.5" /> },
    { id: "kategori", label: "Kategori", icon: <Tag className="w-3.5 h-3.5" />  },
  ];

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {showSavedToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Profil berhasil disimpan!</span>
        </div>
      )}
      {catSaved && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Kategori berhasil disimpan!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Pengaturan</h1>
        <p className="text-xs text-stone-500 mt-0.5">Kelola profil akun dan kategori transaksi Anda.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-[#E7DED4] w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
              activeTab === t.id
                ? "bg-white shadow-sm text-stone-900 border border-[#E7DED4]"
                : "text-stone-400 hover:text-stone-700"
            }`}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Profil ─── */}
      {activeTab === "profile" && (
        <div className="sketch-card bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E7DED4] flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-extrabold text-stone-900">Profil Pribadi</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Lengkap</label>
                <input type="text" value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Alamat Email</label>
                <input type="email" value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nomor Telepon</label>
                <input type="text" value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
                <Save className="w-3.5 h-3.5" />
                Simpan Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Kategori ─── */}
      {activeTab === "kategori" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Income Categories */}
          <div className="sketch-card bg-white overflow-hidden">
            <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                  <span className="text-xs">🟢</span>
                </div>
                <h2 className="text-sm font-extrabold text-stone-900">Kategori Uang Masuk</h2>
              </div>
              <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {incomeCats.length} kategori
              </span>
            </div>
            <div className="p-5 space-y-4">
              {/* Add new */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah kategori baru..."
                  value={newIncome}
                  onChange={e => setNewIncome(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCat("income")}
                  className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
                <button onClick={() => addCat("income")}
                  className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>

              {/* List */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {incomeCats.map(cat => (
                  <div key={cat}
                    className="flex items-center justify-between px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg group hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-stone-700">{cat}</span>
                    </div>
                    <button onClick={() => removeCat("income", cat)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Categories */}
          <div className="sketch-card bg-white overflow-hidden">
            <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                  <span className="text-xs">🔴</span>
                </div>
                <h2 className="text-sm font-extrabold text-stone-900">Kategori Uang Keluar</h2>
              </div>
              <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {expenseCats.length} kategori
              </span>
            </div>
            <div className="p-5 space-y-4">
              {/* Add new */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah kategori baru..."
                  value={newExpense}
                  onChange={e => setNewExpense(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCat("expense")}
                  className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E35B30] text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
                <button onClick={() => addCat("expense")}
                  className="px-3 py-2 bg-[#E35B30] text-white hover:bg-[#c94d27] rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>

              {/* List */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {expenseCats.map(cat => (
                  <div key={cat}
                    className="flex items-center justify-between px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg group hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E35B30] shrink-0" />
                      <span className="text-xs font-bold text-stone-700">{cat}</span>
                    </div>
                    <button onClick={() => removeCat("expense", cat)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="md:col-span-2 flex justify-end">
            <button onClick={handleSaveCats}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
              <Save className="w-3.5 h-3.5" />
              Simpan Semua Kategori
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
