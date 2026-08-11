"use client";

import { useEffect, useState } from "react";
import {
  Landmark,
  Smartphone,
  Wallet,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  getAccountsAction,
  createAccountAction,
  deleteAccountAction,
} from "@/app/dashboard/actions";

type AccountType = "BANK" | "E_WALLET" | "CASH";

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  current_balance: number;
}

const TYPE_META: Record<AccountType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  BANK: { label: "Bank", icon: <Landmark className="w-4 h-4" />, color: "text-primary", bg: "bg-primary/10" },
  E_WALLET: { label: "E-Wallet", icon: <Smartphone className="w-4 h-4" />, color: "text-emerald-600", bg: "bg-emerald-50" },
  CASH: { label: "Tunai", icon: <Wallet className="w-4 h-4" />, color: "text-[#E35B30]", bg: "bg-orange-50" },
};

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("BANK");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    getAccountsAction()
      .then(setAccounts)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.current_balance, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const num = parseInt(balance.replace(/[^0-9]/g, ""), 10);
    if (!name.trim()) { setError("Nama kantong tidak boleh kosong."); return; }
    if (isNaN(num) || num < 0) { setError("Masukkan saldo awal yang valid."); return; }
    setSaving(true);
    setError("");
    try {
      await createAccountAction({ name: name.trim(), type, balance: num });
      setName("");
      setBalance("");
      setShowForm(false);
      load();
    } catch {
      setError("Gagal menyimpan kantong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAccountAction(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Kantong</h1>
          <p className="text-xs text-stone-500 mt-0.5">Kelola kantong Anda.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Kantong
        </button>
      </div>

      {/* Total Balance */}
      <div className="sketch-card bg-white p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Saldo</p>
          <p className="text-3xl font-black text-stone-900 tracking-tight mt-1">
            {loading ? "..." : formatRp(totalBalance)}
          </p>
          <p className="text-[11px] text-stone-400 font-semibold mt-1">{accounts.length} kantong terhubung</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="sketch-card bg-white p-6 space-y-5">
          <h2 className="text-sm font-extrabold text-stone-900">Tambah Kantong Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Kantong</label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Contoh: BCA, GoPay, Dompet..."
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Tipe Kantong</label>
              <select value={type} onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold">
                <option value="BANK">Bank</option>
                <option value="E_WALLET">E-Wallet</option>
                <option value="CASH">Tunai</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Saldo Awal (Rp)</label>
              <input type="number" min={0} value={balance} onChange={(e) => { setBalance(e.target.value); setError(""); }}
                placeholder="0"
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
              Simpan Kantong
            </button>
          </div>
        </form>
      )}

      {/* Account List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm font-bold text-stone-300 col-span-full text-center py-12">Memuat...</p>
        ) : accounts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-stone-300">
            <p className="text-sm font-bold">Belum ada kantong</p>
            <p className="text-xs mt-1">Klik "Tambah Kantong" untuk mulai.</p>
          </div>
        ) : accounts.map((acc) => {
          const meta = TYPE_META[acc.type];
          return (
            <div key={acc.id} className="sketch-card bg-white p-5 space-y-4 group">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
                  {meta.icon}
                </div>
                <button onClick={() => handleDelete(acc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-extrabold text-stone-900">{acc.name}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${meta.color}`}>{meta.label}</p>
              </div>
              <div className="pt-2 border-t border-[#E7DED4]">
                <p className="text-[10px] text-stone-400 font-bold">Saldo Saat Ini</p>
                <p className="text-lg font-black text-stone-900 mt-0.5">{formatRp(acc.current_balance)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}