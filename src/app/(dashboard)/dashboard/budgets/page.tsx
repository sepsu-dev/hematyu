"use client";

import { useEffect, useState } from "react";
import {
  PiggyBank,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  getBudgetsAction,
  createBudgetAction,
  deleteBudgetAction,
  getCategoriesAction,
} from "@/app/dashboard/actions";

interface Budget {
  id: string;
  category_id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  pct: number;
}
interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    getBudgetsAction()
      .then(setBudgets)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getCategoriesAction().then((data) => {
      setCategories(data.filter((c) => c.type === "EXPENSE"));
    }).catch(() => { });
  }, []);

  const expenseCats = categories.filter((c) => c.type === "EXPENSE");
  const usedCatIds = new Set(budgets.map((b) => b.category_id));
  const availableCats = expenseCats.filter((c) => !usedCatIds.has(c.id));

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const num = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!categoryId) { setError("Pilih kategori."); return; }
    if (isNaN(num) || num <= 0) { setError("Masukkan jumlah budget yang valid."); return; }
    setSaving(true);
    setError("");
    try {
      await createBudgetAction({ categoryId, amount: num });
      setCategoryId("");
      setAmount("");
      setShowForm(false);
      load();
    } catch {
      setError("Gagal menyimpan budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteBudgetAction(id);
    load();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Anggaran</h1>
          <p className="text-xs text-stone-500 mt-0.5">Atur batas pengeluaran per kategori setiap bulan.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Budget</p>
          <p className="text-2xl font-black text-stone-900 tracking-tight mt-1">{loading ? "..." : formatRp(totalBudget)}</p>
        </div>
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Terpakai</p>
          <p className="text-2xl font-black text-[#E35B30] tracking-tight mt-1">{loading ? "..." : formatRp(totalSpent)}</p>
        </div>
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sisa</p>
          <p className={`text-2xl font-black tracking-tight mt-1 ${totalBudget - totalSpent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {loading ? "..." : formatRp(totalBudget - totalSpent)}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="sketch-card bg-white p-6 space-y-5">
          <h2 className="text-sm font-extrabold text-stone-900">Tambah Budget Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kategori</label>
              <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setError(""); }}
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold">
                <option value="">Pilih kategori...</option>
                {availableCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {availableCats.length === 0 && (
                <p className="text-[10px] text-stone-400 font-semibold">Semua kategori sudah punya budget.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Jumlah Budget (Rp)</label>
              <input type="number" min={1} value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }}
                placeholder="Contoh: 1000000"
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
            </div>
          </div>
          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Simpan Budget
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-stone-900">Daftar Anggaran</h2>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {budgets.length} budget
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Kategori</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Budget</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Terpakai</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Sisa</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px] w-32">Progress</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-300 font-bold">Memuat...</td>
                </tr>
              ) : budgets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-300">
                    <p className="font-bold text-sm">Belum ada budget</p>
                    <p className="text-xs mt-1">Klik &quot;Tambah Budget&quot; untuk mulai mengatur anggaran.</p>
                  </td>
                </tr>
              ) : budgets.map((b, i) => {
                const pct = Math.min(b.pct, 100);
                const over = b.spent > b.amount;
                const warning = !over && b.pct >= 80;
                return (
                  <tr key={b.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                    <td className="px-5 py-4 text-stone-400 font-bold">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${over ? "bg-red-50" : warning ? "bg-yellow-50" : "bg-emerald-50"}`}>
                          <PiggyBank className={`w-4 h-4 ${over ? "text-red-500" : warning ? "text-yellow-600" : "text-emerald-600"}`} />
                        </div>
                        <span className="font-bold text-stone-700">{b.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-stone-600">{formatRp(b.amount)}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-bold ${over ? "text-red-500" : "text-stone-600"}`}>{formatRp(b.spent)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-black ${over ? "text-red-500" : "text-emerald-600"}`}>
                        {over
                          ? <span className="flex items-center gap-1 justify-end"><AlertTriangle className="w-3 h-3" /> -{formatRp(b.spent - b.amount)}</span>
                          : formatRp(b.remaining)
                        }
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${over ? "bg-red-400" : warning ? "bg-yellow-400" : "bg-emerald-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-black w-8 text-right ${over ? "text-red-500" : warning ? "text-yellow-600" : "text-emerald-600"}`}>
                          {b.pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">Hapus</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}