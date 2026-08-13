"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Trash2, Check, Loader2, X } from "lucide-react";
import {
  getMasterAccountTypesAction,
  createMasterAccountTypeAction,
  deleteMasterAccountTypeAction,
} from "@/app/dashboard/actions";
import { IconListGrid, getIcon } from "@/components/icon-list";

interface AccountType {
  id: string;
  code: string;
  label: string;
  icon_name: string;
  color: string;
  created_at: string;
}

const COLOR_OPTIONS = [
  { value: "primary", label: "Biru (Default)" },
  { value: "emerald", label: "Hijau" },
  { value: "orange", label: "Oranye" },
  { value: "purple", label: "Ungu" },
  { value: "amber", label: "Kuning" },
  { value: "stone", label: "Abu-abu" },
];

const COLOR_CLASSES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-50 text-emerald-700",
  orange: "bg-orange-50 text-orange-700",
  purple: "bg-purple-50 text-purple-700",
  amber: "bg-amber-50 text-amber-700",
  stone: "bg-stone-100 text-stone-600",
};

function TypeIcon({ icon_name }: { icon_name: string }) {
  const Icon = getIcon(icon_name);
  return <Icon className="w-4 h-4" />;
}

export default function MasterAccountTypesPage() {
  const [types, setTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [iconName, setIconName] = useState("wallet");
  const [color, setColor] = useState("primary");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = () => {
    getMasterAccountTypesAction()
      .then(setTypes)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openModal = () => {
    setCode("");
    setLabel("");
    setIconName("wallet");
    setColor("primary");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (adding) return;
    setShowModal(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !label.trim()) { setError("Kode dan label wajib diisi."); return; }
    setAdding(true);
    setError("");
    try {
      await createMasterAccountTypeAction({ code: code.trim(), label: label.trim(), icon_name: iconName, color });
      closeModal();
      load();
      showToast("Tipe kantong berhasil ditambahkan!");
    } catch {
      setError("Gagal menyimpan. Kode mungkin sudah ada.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMasterAccountTypeAction(id);
    load();
    showToast("Tipe kantong berhasil dihapus.");
  };

  return (
    <div className="space-y-6 p-6 relative">
      {toast && (
        <div className="fixed top-20 right-8 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Tipe Kantong</h1>
          <p className="text-xs text-stone-500 mt-0.5">Kelola tipe kantong yang tersedia untuk semua user. Tipe baru langsung bisa dipilih user.</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white hover:bg-amber-600 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Tipe
        </button>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Tipe Kantong Baru</h2>
              <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kode (unik, huruf kapital)</label>
                  <input type="text" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                    placeholder="Contoh: CRYPTO, SAHAM"
                    className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-stone-900 text-xs font-bold placeholder:text-stone-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Label (nama tampil)</label>
                  <input type="text" value={label} onChange={(e) => { setLabel(e.target.value); setError(""); }}
                    placeholder="Contoh: Crypto, Saham"
                    className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-stone-900 text-xs font-bold placeholder:text-stone-300" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Warna Badge</label>
                  <select value={color} onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-stone-900 text-xs font-bold">
                    {COLOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Ikon</label>
                  <IconListGrid selected={iconName} onSelect={(name) => setIconName(name)} />
                </div>
              </div>
              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={adding}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-extrabold disabled:opacity-60">
                  {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-extrabold text-stone-900">Daftar Tipe Kantong</h2>
          </div>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{types.length} tipe</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Tipe</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Kode</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Ikon</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Warna</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-stone-300 font-bold">Memuat...</td></tr>
              ) : types.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-stone-300 font-bold">Belum ada tipe kantong</td></tr>
              ) : types.map((t, i) => (
                <tr key={t.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                  <td className="px-5 py-4 text-stone-400 font-bold">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${COLOR_CLASSES[t.color] ?? "bg-stone-100 text-stone-600"}`}>
                        <TypeIcon icon_name={t.icon_name} />
                      </div>
                      <span className="font-bold text-stone-700">{t.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-[10px] font-black bg-stone-100 text-stone-600 px-2 py-1 rounded">{t.code}</code>
                  </td>
                  <td className="px-5 py-4 text-stone-500 font-bold">{t.icon_name}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${COLOR_CLASSES[t.color] ?? "bg-stone-100 text-stone-600"}`}>
                      {t.color}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleDelete(t.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Hapus</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}