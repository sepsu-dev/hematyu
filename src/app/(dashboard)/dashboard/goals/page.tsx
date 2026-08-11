"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle2,
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
  if (!d) return "Tanpa deadline";
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

  return (
    <div className="space-y-6">
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

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm font-bold text-stone-300 col-span-full text-center py-12">Memuat...</p>
        ) : goals.length === 0 ? (
          <div className="col-span-full text-center py-12 text-stone-300">
            <p className="text-sm font-bold">Belum ada target</p>
            <p className="text-xs mt-1">Klik "Tambah Target" untuk mulai menabung.</p>
          </div>
        ) : goals.map((g) => {
          const done = g.current_amount >= g.target_amount;
          const pct = Math.min(g.pct, 100);
          return (
            <div key={g.id} className="sketch-card bg-white p-5 space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? "bg-emerald-50" : "bg-primary/10"}`}>
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      : <Target className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-stone-900">{g.name}</p>
                    <p className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(g.deadline)}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(g.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-stone-500">
                    {formatRp(g.current_amount)} <span className="text-stone-300">/ {formatRp(g.target_amount)}</span>
                  </span>
                  <span className={`text-[11px] font-black ${done ? "text-emerald-600" : "text-primary"}`}>{g.pct.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${done ? "bg-emerald-400" : "bg-primary"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {done ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Target tercapai! 🎉
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-stone-400">
                    Kurang {formatRp(g.remaining)} lagi
                  </span>
                )}
              </div>

              {!done && (
                <div className="pt-2 border-t border-[#E7DED4]">
                  {topUpId === g.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        autoFocus
                        placeholder="Jumlah (Rp)"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleTopUp(g.id)}
                        className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
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
                  ) : (
                    <button onClick={() => { setTopUpId(g.id); setTopUpAmount(""); }}
                      className="w-full py-2 rounded-lg border border-[#E7DED4] text-[11px] font-extrabold text-stone-500 hover:bg-stone-50 hover:text-primary transition-colors">
                      + Tambah Dana
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}