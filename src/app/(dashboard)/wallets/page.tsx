"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Landmark,
  Smartphone,
  Wallet,
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import {
  getAccountsAction,
  createAccountAction,
  deleteAccountAction,
  getAccountTypesAction,
} from "@/app/dashboard/actions";

interface AccountTypeInfo {
  id: string;
  code: string;
  label: string;
  icon_name: string;
  color: string;
}

type AccountType = string;

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  current_balance: number;
}

function TypeIcon({ icon_name, className }: { icon_name: string; className?: string }) {
  switch (icon_name) {
    case "landmark": return <Landmark className={className ?? "w-4 h-4"} />;
    case "smartphone": return <Smartphone className={className ?? "w-4 h-4"} />;
    case "credit-card": return <CreditCard className={className ?? "w-4 h-4"} />;
    default: return <Wallet className={className ?? "w-4 h-4"} />;
  }
}

const COLOR_CLASS: Record<string, { text: string; bg: string; badge: string }> = {
  primary: { text: "text-primary", bg: "bg-primary/10", badge: "bg-primary/10 text-primary" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-50 text-emerald-700" },
  orange: { text: "text-[#E35B30]", bg: "bg-orange-50", badge: "bg-orange-50 text-[#E35B30]" },
  purple: { text: "text-purple-600", bg: "bg-purple-50", badge: "bg-purple-50 text-purple-700" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-50 text-amber-700" },
  stone: { text: "text-stone-600", bg: "bg-stone-100", badge: "bg-stone-100 text-stone-600" },
};

function getColor(color: string) {
  return COLOR_CLASS[color] ?? COLOR_CLASS.stone;
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    getAccountsAction()
      .then(setAccounts)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getAccountTypesAction().then((types) => {
      setAccountTypes(types);
      if (types.length > 0) setType(types[0].code);
    }).catch(() => { });
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.current_balance, 0);

  const openModal = () => {
    setName("");
    setBalance("");
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
    const num = parseInt(balance.replace(/[^0-9]/g, ""), 10);
    if (!name.trim()) { setError("Nama rekening tidak boleh kosong."); return; }
    if (isNaN(num) || num < 0) { setError("Masukkan saldo awal yang valid."); return; }
    setSaving(true);
    setError("");
    try {
      await createAccountAction({ name: name.trim(), type, balance: num });
      closeModal();
      load();
    } catch {
      setError("Gagal menyimpan rekening.");
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
      await deleteAccountAction(deleteId);
      load();
    } catch (err: any) {
      alert(err?.message || "Gagal menghapus rekening.");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Rekening</h1>
          <p className="text-xs text-stone-500 mt-0.5">Kelola rekening keuangan Anda.</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Rekening
        </button>
      </div>

      {/* Total Balance */}
      <div className="sketch-card bg-white p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Saldo</p>
          <p className="text-3xl font-black text-stone-900 tracking-tight mt-1">
            {loading ? "..." : formatRp(totalBalance)}
          </p>
          <p className="text-[11px] text-stone-400 font-semibold mt-1">{accounts.length} rekening terhubung</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Rekening Baru</h2>
              <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Rekening</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Contoh: BCA, GoPay, Dompet..."
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Tipe Rekening</label>
                <select value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold">
                  {accountTypes.map((t) => (
                    <option key={t.code} value={t.code}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Saldo Awal (Rp)</label>
                <input type="number" min={0} value={balance} onChange={(e) => { setBalance(e.target.value); setError(""); }}
                  placeholder="0"
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
                  Simpan Rekening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-stone-900">Daftar Rekening</h2>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {accounts.length} rekening
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Tipe</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Saldo Awal</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Saldo Saat Ini</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse border-b border-[#E7DED4] last:border-0">
                    <td className="px-5 py-4"><div className="h-3 w-6 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-stone-100" />
                        <div className="h-3 w-24 bg-stone-100 rounded" />
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-stone-100 rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-stone-100 rounded ml-auto" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-stone-100 rounded ml-auto" /></td>
                    <td className="px-5 py-4"></td>
                  </tr>
                ))
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-300">
                    <p className="font-bold text-sm">Belum ada rekening</p>
                    <p className="text-xs mt-1">Klik "Tambah Rekening" untuk mulai.</p>
                  </td>
                </tr>
              ) : accounts.map((acc, i) => {
                const typeInfo = accountTypes.find((t) => t.code === acc.type);
                const colors = getColor(typeInfo?.color ?? "stone");
                const isPositive = acc.current_balance >= 0;
                return (
                  <tr key={acc.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                    <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 ${colors.text}`}>
                          <TypeIcon icon_name={typeInfo?.icon_name ?? "wallet"} />
                        </div>
                        <span className="font-bold text-stone-700">{acc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${colors.badge}`}>
                        {typeInfo?.label ?? acc.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-stone-500">
                      {formatRp(acc.balance)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-black ${isPositive ? "text-stone-900" : "text-red-500"}`}>
                        {formatRp(acc.current_balance)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteClick(acc.id)}
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
        title="Hapus Rekening"
        message="Apakah Anda yakin ingin menghapus rekening ini? Seluruh riwayat transaksi yang terkait dengan rekening ini juga mungkin akan terpengaruh."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}