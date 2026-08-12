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
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [adding, setAdding] = useState(false);

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

  const handleSaveProfile = async () => {
    try {
      await updateProfileAction(profile);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch {
      // ignore — action revalidates on success
    }
  };

  const addCat = async () => {
    const val = newName.trim();
    if (!val) return;
    if (categories.some((c) => c.name.toLowerCase() === val.toLowerCase() && c.type === newType)) return;
    setAdding(true);
    try {
      await createCategoryAction({ name: val, type: newType });
      const data = await getCategoriesAction();
      setCategories(data);
      setNewName("");
      setShowCatToast(true);
      setTimeout(() => setShowCatToast(false), 2500);
    } catch {
      // ignore
    } finally {
      setAdding(false);
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

  const incomeCats = categories.filter((c) => c.type === "INCOME");
  const expenseCats = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div className="space-y-6 p-6 relative">
      {showSavedToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Profil berhasil disimpan!</span>
        </div>
      )}
      {showCatToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Kategori berhasil ditambahkan!</span>
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
        <div className="space-y-6">
          {/* Add Form */}
          <div className="sketch-card bg-white overflow-hidden">
            <div className="p-5 border-b border-[#E7DED4] flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Kategori</h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Nama kategori baru..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCat()}
                  className="flex-1 px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as "INCOME" | "EXPENSE")}
                  className="px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold"
                >
                  <option value="INCOME">Uang Masuk</option>
                  <option value="EXPENSE">Uang Keluar</option>
                </select>
                <button
                  onClick={addCat}
                  disabled={adding || !newName.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold transition-all disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {/* Kategori Masuk Table */}
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
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                    <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                    <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama Kategori</th>
                    <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Tipe</th>
                    <th className="text-center px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Default</th>
                    <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {!catsLoaded ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-stone-300 font-bold">Memuat...</td>
                    </tr>
                  ) : incomeCats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-stone-300 font-bold">Belum ada kategori uang masuk</td>
                    </tr>
                  ) : incomeCats.map((cat, i) => (
                    <tr key={cat.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                      <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="font-bold text-stone-700">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                          Masuk
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {cat.is_default ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 text-stone-500">default</span>
                        ) : (
                          <span className="text-stone-200 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {!cat.is_default && (
                          <button
                            onClick={() => removeCat(cat.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Hapus</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kategori Keluar Table */}
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
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                    <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                    <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama Kategori</th>
                    <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Tipe</th>
                    <th className="text-center px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Default</th>
                    <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {!catsLoaded ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-stone-300 font-bold">Memuat...</td>
                    </tr>
                  ) : expenseCats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-stone-300 font-bold">Belum ada kategori uang keluar</td>
                    </tr>
                  ) : expenseCats.map((cat, i) => (
                    <tr key={cat.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                      <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E35B30] shrink-0" />
                          <span className="font-bold text-stone-700">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-50 text-[#E35B30]">
                          Keluar
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {cat.is_default ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 text-stone-500">default</span>
                        ) : (
                          <span className="text-stone-200 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {!cat.is_default && (
                          <button
                            onClick={() => removeCat(cat.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Hapus</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}