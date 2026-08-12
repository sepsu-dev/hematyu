"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import {
  getGoalsAction,
  createGoalAction,
  updateGoalAmountAction,
  deleteGoalAction,
} from "@/app/dashboard/actions";

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
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [topUpId, setTopUpId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");

  const load = () => {
    getGoalsAction()
      .then(setGoals)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

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
      setName("");
      setTargetAmount("");
      setDeadline("");
      setShowForm(false);
      load();
    } catch {
      setError("Gagal menyimpan target.");
    } finally {
      setSaving(false);
    }
  };

  const handleTopUp = async (id: string) => {
    const num = parseInt(topUpAmount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num) || num === 0) return;
    await updateGoalAmountAction({ id, amount: num });
    setTopUpId(null);
    setTopUpAmount("");
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteGoalAction(id);
    load();
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
        <button onClick={() => setShowForm((v) => !v)}
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

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="sketch-card bg-white p-6 space-y-5">
          <h2 className="text-sm font-extrabold text-stone-900">Target Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
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
              Simpan Target
            </button>
          </div>
        </form>
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
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-300 font-bold">Memuat...</td>
                </tr>
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
                              onClick={() => { setTopUpId(topUpId === g.id ? null : g.id); setTopUpAmount(""); }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">Top Up</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(g.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {topUpId === g.id && (
                      <tr key={`${g.id}-topup`} className="border-b border-[#E7DED4] bg-primary/5">
                        <td colSpan={7} className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-extrabold text-stone-500">Tambah Dana ke &quot;{g.name}&quot;:</span>
                            <input
                              type="number"
                              min={1}
                              autoFocus
                              placeholder="Jumlah (Rp)"
                              value={topUpAmount}
                              onChange={(e) => setTopUpAmount(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleTopUp(g.id)}
                              className="px-3 py-2 bg-white border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 w-48"
                            />
                            <button onClick={() => handleTopUp(g.id)}
                              className="px-3 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold">
                              Simpan
                            </button>
                            <button onClick={() => { setTopUpId(null); setTopUpAmount(""); }}
                              className="px-3 py-2 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50">
                              Batal
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}