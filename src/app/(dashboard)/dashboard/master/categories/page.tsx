"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Check, Loader2 } from "lucide-react";
import {
  getMasterCategoriesAction,
  createMasterCategoryAction,
  deleteMasterCategoryAction,
} from "@/app/dashboard/actions";

interface MasterCategory {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  created_at: string;
}

export default function MasterCategoriesPage() {
  const [categories, setCategories] = useState<MasterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");

  const load = () => {
    getMasterCategoriesAction()
      .then(setCategories)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleAdd = async () => {
    const val = newName.trim();
    if (!val) return;
    setAdding(true);
    try {
      await createMasterCategoryAction({ name: val, type: newType });
      setNewName("");
      load();
      showToast("Kategori master berhasil ditambahkan!");
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMasterCategoryAction(id);
    load();
    showToast("Kategori master berhasil dihapus.");
  };

  const income = categories.filter((c) => c.type === "INCOME");
  const expense = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div className="space-y-6 p-6 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black rounded border border-amber-200 uppercase tracking-widest">Superadmin</span>
          </div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Master Kategori</h1>
          <p className="text-xs text-stone-500 mt-0.5">Kelola kategori global yang tersedia untuk semua user.</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-extrabold text-stone-900">Tambah Kategori Master</h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Nama kategori..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-stone-900 text-xs font-bold placeholder:text-stone-300"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "INCOME" | "EXPENSE")}
              className="px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-stone-900 text-xs font-bold"
            >
              <option value="INCOME">Uang Masuk</option>
              <option value="EXPENSE">Uang Keluar</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-extrabold transition-all disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Two-table layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income */}
        <div className="sketch-card bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                <span className="text-xs">🟢</span>
              </div>
              <h2 className="text-sm font-extrabold text-stone-900">Uang Masuk</h2>
            </div>
            <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{income.length} kategori</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama</th>
                  <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Memuat...</td></tr>
                ) : income.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Belum ada kategori masuk</td></tr>
                ) : income.map((c, i) => (
                  <tr key={c.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                    <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="font-bold text-stone-700">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(c.id)}
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

        {/* Expense */}
        <div className="sketch-card bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                <span className="text-xs">🔴</span>
              </div>
              <h2 className="text-sm font-extrabold text-stone-900">Uang Keluar</h2>
            </div>
            <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{expense.length} kategori</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama</th>
                  <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Memuat...</td></tr>
                ) : expense.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Belum ada kategori keluar</td></tr>
                ) : expense.map((c, i) => (
                  <tr key={c.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                    <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-[#E35B30] shrink-0" />
                        <span className="font-bold text-stone-700">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(c.id)}
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
    </div>
  );
}
