"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { User, Save, Tag, Plus, Trash2, Check } from "lucide-react";
import {
  getProfileAction,
  getCategoriesAction,
  createCategoryAction,
  deleteCategoryAction,
  updateProfileAction,
} from "@/app/dashboard/actions";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  is_default: boolean;
}

type Tab = "profile" | "kategori";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    if (searchParams.get("tab") === "kategori") setActiveTab("kategori");
  }, [searchParams]);

  // Profile
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showCatToast, setShowCatToast] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoaded, setCatsLoaded] = useState(false);
  const [newIncome, setNewIncome] = useState("");
  const [newExpense, setNewExpense] = useState("");

  useEffect(() => {
    getProfileAction()
      .then((data) => {
        if (data?.name) {
          setProfile({ name: data.name, email: data.email || "", phone: data.phone || "" });
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, []);

  useEffect(() => {
    getCategoriesAction()
      .then((data) => {
        setCategories(data);
        setCatsLoaded(true);
      })
      .catch(() => setCatsLoaded(true));
  }, []);

  const incomeCats = categories.filter((c) => c.type === "INCOME");
  const expenseCats = categories.filter((c) => c.type === "EXPENSE");

  const handleSaveProfile = async () => {
    try {
      await updateProfileAction(profile);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch {
      // ignore — action revalidates on success
    }
  };

  const addCat = async (type: "INCOME" | "EXPENSE", name: string) => {
    const val = name.trim();
    if (!val) return;
    if (categories.some((c) => c.name.toLowerCase() === val.toLowerCase())) return;
    try {
      await createCategoryAction({ name: val, type });
      const data = await getCategoriesAction();
      setCategories(data);
      if (type === "INCOME") setNewIncome("");
      else setNewExpense("");
    } catch {
      // ignore
    }
  };

  const removeCat = async (id: string) => {
    try {
      await deleteCategoryAction(id);
      const data = await getCategoriesAction();
      setCategories(data);
    } catch {
      // ignore
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profil", icon: <User className="w-3.5 h-3.5" /> },
    { id: "kategori", label: "Kategori", icon: <Tag className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 relative">
      {showSavedToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Profil berhasil disimpan!</span>
        </div>
      )}
      {showCatToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Kategori berhasil disimpan!</span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Pengaturan</h1>
        <p className="text-xs text-stone-500 mt-0.5">Kelola profil akun dan kategori transaksi Anda.</p>
      </div>

      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-[#E7DED4] w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${activeTab === t.id
              ? "bg-white shadow-sm text-stone-900 border border-[#E7DED4]"
              : "text-stone-400 hover:text-stone-700"
              }`}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

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
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Alamat Email</label>
                <input type="email" value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nomor Telepon</label>
                <input type="text" value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleSaveProfile}
                disabled={!profileLoaded}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />
                Simpan Profil
              </button>
            </div>
          </div>
        </div>
      )}

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
                {catsLoaded ? incomeCats.length : "..."} kategori
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah kategori baru..."
                  value={newIncome}
                  onChange={(e) => setNewIncome(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCat("INCOME", newIncome)}
                  className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
                <button onClick={() => addCat("INCOME", newIncome)}
                  className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {catsLoaded ? incomeCats.map((cat) => (
                  <div key={cat.id}
                    className="flex items-center justify-between px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg group hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-stone-700">{cat.name}</span>
                      {cat.is_default && (
                        <span className="text-[8px] font-black bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full">default</span>
                      )}
                    </div>
                    <button onClick={() => removeCat(cat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )) : (
                  <p className="text-xs text-stone-300 text-center py-6">Memuat...</p>
                )}
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
                {catsLoaded ? expenseCats.length : "..."} kategori
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah kategori baru..."
                  value={newExpense}
                  onChange={(e) => setNewExpense(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCat("EXPENSE", newExpense)}
                  className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E35B30] text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
                <button onClick={() => addCat("EXPENSE", newExpense)}
                  className="px-3 py-2 bg-[#E35B30] text-white hover:bg-[#c94d27] rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {catsLoaded ? expenseCats.map((cat) => (
                  <div key={cat.id}
                    className="flex items-center justify-between px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg group hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E35B30] shrink-0" />
                      <span className="text-xs font-bold text-stone-700">{cat.name}</span>
                      {cat.is_default && (
                        <span className="text-[8px] font-black bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full">default</span>
                      )}
                    </div>
                    <button onClick={() => removeCat(cat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )) : (
                  <p className="text-xs text-stone-300 text-center py-6">Memuat...</p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button onClick={() => { setShowCatToast(true); setTimeout(() => setShowCatToast(false), 2500); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
              <Save className="w-3.5 h-3.5" />
              Kategori Tersimpan Otomatis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}