"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  PlusCircle,
  X,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  getGoalsAction,
  createGoalAction,
  updateGoalAmountAction,
  deleteGoalAction,
} from "@/app/dashboard/actions";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | Date | null;
  pct: number;
  remaining: number;
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(d: string | Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [topUpGoal, setTopUpGoal] = useState<Goal | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [savingTopUp, setSavingTopUp] = useState(false);
  const [topUpError, setTopUpError] = useState("");

  const load = () => {
    getGoalsAction()
      .then(setGoals)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openModal = () => {
    setName("");
    setTargetAmount("");
    setDeadline("");
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
    const num = parseInt(targetAmount.replace(/[^0-9]/g, ""), 10);
    if (!name.trim()) { setError("Nama target tidak boleh kosong."); return; }
    if (isNaN(num) || num <= 0) { setError("Masukkan target nominal yang valid."); return; }
    setSaving(true);
    setError("");
    try {
      await createGoalAction({
        name: name.trim(),
        targetAmount: num,
        deadline: deadline || undefined,
      });
      toast.success("Target impian berhasil disimpan!");
      closeModal();
      load();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan target.");
      toast.error(err?.message || "Gagal menyimpan target.");
    } finally {
      setSaving(false);
    }
  };

  const openTopUpModal = (g: Goal) => {
    setTopUpGoal(g);
    setTopUpAmount("");
    setTopUpError("");
  };

  const closeTopUpModal = () => {
    if (savingTopUp) return;
    setTopUpGoal(null);
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpGoal || savingTopUp) return;
    const num = parseInt(topUpAmount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num) || num <= 0) { setTopUpError("Masukkan jumlah yang valid."); return; }
    setSavingTopUp(true);
    setTopUpError("");
    try {
      await updateGoalAmountAction({ id: topUpGoal.id, amount: num });
      toast.success("Tabungan berhasil ditambahkan!");
      setTopUpGoal(null);
      setTopUpAmount("");
      load();
    } catch (err: any) {
      setTopUpError(err?.message || "Gagal menambah tabungan.");
      toast.error(err?.message || "Gagal menambah tabungan.");
    } finally {
      setSavingTopUp(false);
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
      await deleteGoalAction(deleteId);
      toast.success("Target impian berhasil dihapus!");
      load();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus target impian.");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalTerkumpul = goals.reduce((s, g) => s + g.current_amount, 0);
  const done = goals.filter((g) => g.current_amount >= g.target_amount).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Target</h1>
          <p className="text-xs text-stone-500 mt-0.5">Tetapkan tujuan keuangan dan pantau progresnya.</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Target
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Target</p>
          <p className="text-2xl font-black text-stone-900 tracking-tight mt-1">{loading ? "..." : formatRp(totalTarget)}</p>
        </div>
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Terkumpul</p>
          <p className="text-2xl font-black text-primary tracking-tight mt-1">{loading ? "..." : formatRp(totalTerkumpul)}</p>
        </div>
        <div className="sketch-card bg-white p-5">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Tercapai</p>
          <p className="text-2xl font-black text-emerald-600 tracking-tight mt-1">{loading ? "..." : `${done} / ${goals.length}`}</p>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Target Baru</h2>
              <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Target</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Contoh: Dana Darurat, Liburan..."
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Target Nominal (Rp)</label>
                <input type="number" min={1} value={targetAmount} onChange={(e) => { setTargetAmount(e.target.value); setError(""); }}
                  placeholder="Contoh: 10000000"
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Deadline (opsional)</label>
                <input type="date" value={deadline} onChange={(e) => { setDeadline(e.target.value); setError(""); }}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
              </div>
              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60">
                  {saving ? <Spinner size={14} /> : <Plus className="w-3.5 h-3.5" />}
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-stone-900">Daftar Target</h2>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {goals.length} target
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama Target</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Target</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Terkumpul</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px] w-36">Progress</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Deadline</th>
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
                    <td className="px-5 py-4"><div className="h-2 w-24 bg-stone-100 rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4"></td>
                  </tr>
                ))
              ) : goals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-300">
                    <p className="font-bold text-sm">Belum ada target</p>
                    <p className="text-xs mt-1">Klik &quot;Tambah Target&quot; untuk mulai menabung.</p>
                  </td>
                </tr>
              ) : goals.map((g, i) => {
                const isDone = g.current_amount >= g.target_amount;
                const pct = Math.min(g.pct, 100);
                return (
                  <>
                    <tr key={g.id} className="border-b border-[#E7DED4] hover:bg-[#FAF6F0] transition-colors group">
                      <td className="px-5 py-4 text-stone-400 font-bold">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-50" : "bg-primary/10"}`}>
                            {isDone
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              : <Target className="w-4 h-4 text-primary" />
                            }
                          </div>
                          <span className="font-bold text-stone-700">{g.name}</span>
                          {isDone && (
                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full">Tercapai 🎉</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-stone-600">{formatRp(g.target_amount)}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-black ${isDone ? "text-emerald-600" : "text-primary"}`}>{formatRp(g.current_amount)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${isDone ? "bg-emerald-400" : "bg-primary"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-black w-8 text-right ${isDone ? "text-emerald-600" : "text-primary"}`}>
                            {g.pct.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-stone-400 font-bold">
                          <Calendar className="w-3 h-3" />
                          {formatDate(g.deadline)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          {!isDone && (
                            <button
                              onClick={() => openTopUpModal(g)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">Top Up</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(g.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {topUpGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeTopUpModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Top Up Target</h2>
              <button type="button" onClick={closeTopUpModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-stone-900">{topUpGoal.name}</p>
              <p className="text-[11px] text-stone-500 font-semibold">
                Terkumpul {formatRp(topUpGoal.current_amount)} dari {formatRp(topUpGoal.target_amount)}
              </p>
            </div>
            <form onSubmit={handleTopUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Jumlah Tambahan (Rp)</label>
                <input
                  type="number"
                  min={1}
                  autoFocus
                  placeholder="Contoh: 500000"
                  value={topUpAmount}
                  onChange={(e) => { setTopUpAmount(e.target.value); setTopUpError(""); }}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
              </div>
              {topUpError && <p className="text-xs text-red-500 font-bold">{topUpError}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeTopUpModal}
                  className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={savingTopUp}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60">
                  {savingTopUp ? <Spinner size={14} /> : <PlusCircle className="w-3.5 h-3.5" />}
                  Simpan Top Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Hapus Target Tabungan"
        message="Apakah Anda yakin ingin menghapus target tabungan ini? Riwayat tabungan Anda pada target ini akan terhapus secara permanen."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
