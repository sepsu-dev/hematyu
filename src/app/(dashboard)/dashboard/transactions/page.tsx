"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  X,
  PlusCircle,
  Tag,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTransactionsAction,
  getCategoriesAction,
  getAccountsAction,
  createTransactionAction,
  deleteTransactionAction,
} from "@/app/dashboard/actions";

type TxType = "INCOME" | "EXPENSE";

interface Transaction {
  id: string;
  date: string | Date;
  description: string;
  category: string;
  category_id: string;
  account_id: string | null;
  account: string | null;
  amount: number;
  type: TxType;
  note: string | null;
}

interface Account {
  id: string;
  name: string;
  type: "BANK" | "E_WALLET" | "CASH";
}

interface Category {
  id: string;
  name: string;
  type: TxType;
  is_default: boolean;
}

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filter, setFilter] = useState<"all" | TxType>("all");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<TxType>("EXPENSE");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTransactionsAction(), getCategoriesAction(), getAccountsAction()])
      .then(([txData, catData, accData]) => {
        setTransactions(txData);
        setCategories(catData);
        setAccounts(accData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);
  const numericAmount = parseInt(amount || "0", 10);

  const openModal = (tab: TxType) => {
    setModalTab(tab);
    const cats = categories.filter((c) => c.type === tab);
    setCategoryId(cats[0]?.id ?? "");
    setAccountId(accounts[0]?.id ?? "");
    setDesc("");
    setAmount("");
    setNote("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const switchTab = (tab: TxType) => {
    setModalTab(tab);
    const cats = categories.filter((c) => c.type === tab);
    setCategoryId(cats[0]?.id ?? "");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const num = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!desc.trim()) { setError("Keterangan tidak boleh kosong."); return; }
    if (isNaN(num) || num <= 0) { setError("Masukkan jumlah yang valid."); return; }
    if (!categoryId) { setError("Pilih kategori."); return; }

    setSaving(true);
    setError("");
    try {
      await createTransactionAction({
        categoryId,
        type: modalTab,
        amount: num,
        description: desc.trim(),
        note: note.trim(),
        accountId: accountId || undefined,
      });
      const txData = await getTransactionsAction();
      setTransactions(txData);
      closeModal();
    } catch {
      setError("Gagal menyimpan transaksi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteTransactionAction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const categoriesForTab = categories.filter((c) => c.type === modalTab);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Transaksi</h1>
          <p className="text-xs text-stone-500 mt-0.5">Riwayat semua uang masuk & keluar Anda.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openModal("EXPENSE")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E35B30] text-white hover:bg-[#c94d27] rounded-lg text-xs font-extrabold shadow-sm transition-all active:scale-[0.98]"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            Uang Keluar
          </button>
          <button
            onClick={() => openModal("INCOME")}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-extrabold shadow-sm transition-all active:scale-[0.98]"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Uang Masuk
          </button>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sketch-card bg-white p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-stone-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Transaksi</p>
            <p className="text-lg font-black text-stone-900">{loading ? "..." : transactions.length}</p>
          </div>
        </div>
        <div className="sketch-card bg-white p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Masuk</p>
            <p className="text-lg font-black text-stone-900">{loading ? "..." : formatRp(totalIncome)}</p>
          </div>
        </div>
        <div className="sketch-card bg-white p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-[#E35B30]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#E35B30] uppercase tracking-widest">Total Keluar</p>
            <p className="text-lg font-black text-stone-900">{loading ? "..." : formatRp(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex items-center gap-2">
        {(["all", "INCOME", "EXPENSE"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${filter === f
              ? f === "INCOME" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : f === "EXPENSE" ? "bg-orange-50 border-orange-200 text-[#E35B30]"
                  : "bg-stone-900 border-stone-900 text-white"
              : "bg-white border-[#E7DED4] text-stone-500 hover:bg-stone-50"
              }`}>
            {f === "all" ? "Semua" : f === "INCOME" ? "🟢 Masuk" : "🔴 Keluar"}
            <span className="ml-1.5 opacity-60">
              ({f === "all" ? transactions.length : transactions.filter((t) => t.type === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* ─── Transaction Table ─── */}
      <div className="sketch-card bg-white overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            <p className="text-sm font-bold text-stone-400">Memuat...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-stone-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-400">Belum ada transaksi</p>
              <p className="text-xs text-stone-300 mt-1">Tekan tombol di atas untuk mencatat.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-[#E7DED4] text-stone-400 uppercase tracking-wider text-[10px]">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Kantong</th>
                  <th className="p-4">Catatan</th>
                  <th className="p-4 text-right">Jumlah</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED4]/40">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors group">
                    <td className="p-4 text-stone-500 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "INCOME" ? "bg-emerald-50" : "bg-orange-50"}`}>
                          {tx.type === "INCOME"
                            ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                            : <ArrowDownRight className="w-3.5 h-3.5 text-[#E35B30]" />}
                        </div>
                        <span className="text-stone-900 font-bold">{tx.description}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[10px] whitespace-nowrap font-bold">{tx.category}</span>
                    </td>
                    <td className="p-4">
                      {tx.account ? (
                        <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-[10px] whitespace-nowrap font-bold">{tx.account}</span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="p-4 text-stone-400 font-medium">{tx.note || "—"}</td>
                    <td className={`p-4 text-right font-black whitespace-nowrap ${tx.type === "INCOME" ? "text-emerald-600" : "text-stone-900"}`}>
                      {tx.type === "INCOME" ? "+" : "−"}{formatRp(tx.amount)}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(tx.id)} disabled={deletingId === tx.id}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 disabled:opacity-100 disabled:hover:bg-transparent disabled:hover:text-stone-300 transition-all">
                        {deletingId === tx.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E7DED4] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex">
              <div className="hidden sm:flex flex-col justify-between p-8 w-56 shrink-0 bg-stone-50">
                <div>
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest ${modalTab === "INCOME" ? "text-emerald-600" : "text-[#E35B30]"}`}>
                    {modalTab === "INCOME" ? "Uang Masuk" : "Uang Keluar"}
                  </p>
                  <p className={`text-3xl font-black mt-3 leading-tight break-all ${modalTab === "INCOME" ? "text-emerald-700" : "text-[#E35B30]"}`}>
                    {numericAmount > 0 ? formatRp(numericAmount) : "Rp 0"}
                  </p>
                </div>
                <div className={`text-[10px] font-bold space-y-1.5 ${modalTab === "INCOME" ? "text-emerald-600/60" : "text-[#E35B30]/60"}`}>
                  <p>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                  {categoriesForTab.find((c) => c.id === categoryId)?.name && (
                    <p className="capitalize">{categoriesForTab.find((c) => c.id === categoryId)?.name}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 p-7 space-y-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-extrabold text-stone-900">Catat Transaksi Baru</h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">Isi detail di bawah ini dengan lengkap.</p>
                  </div>
                  <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  {(["EXPENSE", "INCOME"] as TxType[]).map((tab) => (
                    <button key={tab} type="button" onClick={() => switchTab(tab)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-extrabold transition-all ${modalTab === tab
                        ? tab === "INCOME"
                          ? "bg-white shadow-sm text-emerald-600 border border-emerald-200"
                          : "bg-white shadow-sm text-[#E35B30] border border-orange-200"
                        : "text-stone-400 hover:text-stone-700"
                        }`}>
                      {tab === "INCOME"
                        ? <ArrowUpRight className="w-3.5 h-3.5" />
                        : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {tab === "INCOME" ? "Uang Masuk" : "Uang Keluar"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                      Keterangan <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" required autoFocus
                      placeholder={modalTab === "INCOME" ? "Gaji Oktober, Pembayaran Klien..." : "Makan Siang, Bensin, Tagihan..."}
                      value={desc}
                      onChange={(e) => { setDesc(e.target.value); setError(""); }}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                      Jumlah (Rp) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400 pointer-events-none">Rp</span>
                      <input
                        type="number" required min={1}
                        placeholder="0"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(""); }}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 transition-all"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {QUICK_AMOUNTS.map((n) => (
                        <button key={n} type="button" onClick={() => setAmount(String(n))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${amount === String(n)
                            ? modalTab === "INCOME" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-orange-100 text-[#E35B30] border-orange-200"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-600 border-transparent"
                            }`}>
                          {n >= 1000000 ? `${n / 1000000}jt` : `${n / 1000}rb`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kategori</label>
                        <Link href="/dashboard/settings?tab=kategori" onClick={closeModal}
                          className="text-[9px] text-primary font-bold hover:underline flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />Kelola
                        </Link>
                      </div>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                        <SelectContent>
                          {categoriesForTab.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kantong</label>
                      <Select value={accountId} onValueChange={setAccountId}>
                        <SelectTrigger><SelectValue placeholder="Pilih kantong..." /></SelectTrigger>
                        <SelectContent>
                          {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                      Catatan <span className="text-stone-300 font-medium normal-case">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Catatan singkat..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 font-bold px-1">{error}</p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeModal}
                      className="flex-1 py-2.5 rounded-lg border-2 border-[#E7DED4] text-xs font-extrabold text-stone-600 hover:bg-stone-50 transition-colors">
                      Batal
                    </button>
                    <button type="submit" disabled={saving}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-xs font-extrabold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 ${modalTab === "INCOME" ? "bg-emerald-600 hover:bg-emerald-700 disabled:hover:bg-emerald-600" : "bg-[#E35B30] hover:bg-[#c94d27] disabled:hover:bg-[#E35B30]"
                        }`}>
                      {saving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          Simpan Transaksi
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}