"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  PiggyBank,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
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

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export default function BudgetsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = (m: string) => {
    setLoading(true);
    getBudgetsAction(m)
      .then(setBudgets)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(month);
    getCategoriesAction().then((data) => {
      setCategories(data.filter((c) => c.type === "EXPENSE"));
    }).catch(() => { });
  }, [month]);

  const expenseCats = categories.filter((c) => c.type === "EXPENSE");
  const usedCatIds = new Set(budgets.map((b) => b.category_id));
  const availableCats = expenseCats.filter((c) => !usedCatIds.has(c.id));

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const openModal = () => {
    setCategoryId("");
    setAmount("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const num = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!categoryId) { setError("Pilih kategori."); return; }
    if (isNaN(num) || num <= 0) { setError("Masukkan jumlah anggaran yang valid."); return; }
    setSaving(true);
    setError("");
    try {
      await createBudgetAction({ categoryId, amount: num });
      closeModal();
      load(month);
      setToast("Anggaran berhasil disimpan.");
      setTimeout(() => setToast(""), 3000);
    } catch {
      setError("Gagal menyimpan anggaran.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setConfirmOpen(false);
    setLoading(true);
    try {
      await deleteBudgetAction(deleteId);
      load(month);
      setToast("Anggaran berhasil dihapus.");
      setTimeout(() => setToast(""), 3000);
    } catch (err: any) {
      alert(err?.message || "Gagal menghapus anggaran.");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Anggaran</h1>
          <p className="text-xs text-stone-500 mt-0.5">Tetapkan batas pengeluaran tiap kategori setiap bulan.</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Anggaran
        </button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#E7DED4] px-4 py-3">
        <button onClick={() => setMonth((m) => shiftMonth(m, -1))}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Bulan sebelumnya">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-primary" />
          <span className="text-sm font-extrabold text-stone-800 capitalize">{monthLabel(month)}</span>
        </div>
        <button
          onClick={() => {
            const next = shiftMonth(month, 1);
            if (next <= currentMonth()) setMonth(next);
          }}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-40"
          disabled={shiftMonth(month, 1) > currentMonth()}
          aria-label="Bulan berikutnya">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Anggaran</p>
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Anggaran Baru</h2>
              <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
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
                  <p className="text-[10px] text-stone-400 font-semibold">Semua kategori sudah punya anggaran.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Jumlah Anggaran (Rp)</label>
                <input type="number" min={1} value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  placeholder="Contoh: 1000000"
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
              </div>
              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Simpan Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-stone-900">Daftar Anggaran</h2>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {budgets.length} anggaran
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Kategori</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Anggaran</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Terpakai</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Sisa</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px] w-32">Progress</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
               {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse border-b border-[#E7DED4] last:border-0">
                    <td className="px-5 py-4"><div className="h-3 w-6 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-stone-100" />
                        <div className="h-3 w-24 bg-stone-100 rounded" />
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-stone-100 rounded ml-auto" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-stone-100 rounded ml-auto" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-stone-100 rounded ml-auto" /></td>
                    <td className="px-5 py-4"><div className="h-2 w-24 bg-stone-100 rounded-full" /></td>
                    <td className="px-5 py-4"></td>
                  </tr>
                ))
              ) : budgets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-300">
                    <p className="font-bold text-sm">Belum ada anggaran</p>
                    <p className="text-xs mt-1">Klik "Tambah Anggaran" untuk mulai mengatur batas pengeluaran.</p>
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
                        onClick={() => handleDeleteClick(b.id)}
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Hapus Anggaran"
        message="Apakah Anda yakin ingin menghapus anggaran kategori ini? Anda tidak akan dapat memantau batas pengeluaran kategori ini untuk bulan sekarang lagi."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}