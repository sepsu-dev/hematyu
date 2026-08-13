"use client";

import { useEffect, useState, useCallback } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
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
  ChevronLeft,
  ChevronRight,
  Plus,
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
  getTransactionsCountAction,
  getSummaryAction,
  getCategoriesAction,
  getAccountsAction,
  createTransactionAction,
  deleteTransactionAction,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

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
  type: string;
}

interface Category {
  id: string;
  name: string;
  type: TxType;
  is_default: boolean;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalCount: number;
}

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000];
const PAGE_SIZE = 5;

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-4"><div className="h-3 w-20 bg-muted rounded" /></td>
      <td className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-muted" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </td>
      <td className="p-4"><div className="h-5 w-24 bg-muted rounded-lg" /></td>
      <td className="p-4"><div className="h-5 w-16 bg-muted rounded-lg" /></td>
      <td className="p-4"><div className="h-3 w-20 bg-muted rounded" /></td>
      <td className="p-4"><div className="h-3 w-24 bg-muted rounded ml-auto" /></td>
      <td className="p-4"><div className="h-3 w-3 bg-muted rounded" /></td>
    </tr>
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination & Filter
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
  const [incomeCount, setIncomeCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  // Modal State & Form
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<TxType>("EXPENSE");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const loadSummaryData = useCallback(async () => {
    try {
      const sum = await getSummaryAction();
      setSummary(sum);
      const incCount = await getTransactionsCountAction("INCOME");
      setIncomeCount(incCount);
      const expCount = await getTransactionsCountAction("EXPENSE");
      setExpenseCount(expCount);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadPageData = useCallback(async (pageNum: number, currentFilter: typeof filter) => {
    setLoadingPage(true);
    try {
      const txType = currentFilter === "all" ? undefined : currentFilter;
      const tx = await getTransactionsAction({
        limit: PAGE_SIZE,
        offset: (pageNum - 1) * PAGE_SIZE,
        type: txType,
      });
      setTransactions(tx);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getTransactionsAction({ limit: PAGE_SIZE, offset: 0 }),
      getCategoriesAction(),
      getAccountsAction(),
      loadSummaryData(),
    ])
      .then(([tx, cats, accs]) => {
        setTransactions(tx);
        setCategories(cats);
        setAccounts(accs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [loadSummaryData]);

  const handleFilterChange = async (newFilter: typeof filter) => {
    setFilter(newFilter);
    setPage(1);
    await loadPageData(1, newFilter);
  };

  const handlePageChange = async (pageNum: number) => {
    setPage(pageNum);
    await loadPageData(pageNum, filter);
  };

  const openModal = (tab: TxType) => {
    setModalTab(tab);
    setDesc("");
    setAmount("");
    const catsForTab = categories.filter((c) => c.type === tab);
    setCategoryId(catsForTab[0]?.id || "");
    setAccountId(accounts[0]?.id || "");
    setNote("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Auto-open modal saat diarahkan dari dashboard (?create=expense|income)
  useEffect(() => {
    const create = new URLSearchParams(window.location.search).get("create");
    if ((create === "expense" || create === "income") && !loading && categories.length > 0) {
      openModal(create === "expense" ? "EXPENSE" : "INCOME");
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, categories.length > 0]);

  const switchTab = (tab: TxType) => {
    setModalTab(tab);
    const catsForTab = categories.filter((c) => c.type === tab);
    setCategoryId(catsForTab[0]?.id || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      setError("Keterangan harus diisi.");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Jumlah uang harus valid dan lebih dari 0.");
      return;
    }
    if (!categoryId) {
      setError("Silakan pilih kategori.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createTransactionAction({
        description: desc.trim(),
        amount: numAmount,
        type: modalTab,
        categoryId: categoryId,
        accountId: accountId || undefined,
        note: note.trim() || undefined,
        date: new Date().toISOString(),
      });
      closeModal();
      setPage(1);
      await loadPageData(1, filter);
      await loadSummaryData();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan transaksi.");
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
    setDeletingId(deleteId);
    try {
      await deleteTransactionAction(deleteId);
      await loadPageData(page, filter);
      await loadSummaryData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  };

  const totalFilteredCount =
    filter === "all" ? (summary?.totalCount ?? 0) : filter === "INCOME" ? incomeCount : expenseCount;
  const totalPages = Math.max(Math.ceil(totalFilteredCount / PAGE_SIZE), 1);

  const startIdx = totalFilteredCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, totalFilteredCount);

  const categoriesForTab = categories.filter((c) => c.type === modalTab);
  const numericAmount = parseFloat(amount) || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Transaksi</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Riwayat semua uang masuk & keluar Anda.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={() => openModal("EXPENSE")} variant="outline" className="text-xs font-extrabold h-9 border-[#E7DED4] bg-white text-stone-700 hover:text-[#E35B30] hover:bg-orange-50/50 hover:border-orange-200 transition-all rounded-lg flex items-center gap-1.5 shadow-none">
            <ArrowDownRight className="w-3.5 h-3.5 text-[#E35B30]" />
            Catat Pengeluaran
          </Button>
          <Button onClick={() => openModal("INCOME")} variant="outline" className="text-xs font-extrabold h-9 border-[#E7DED4] bg-white text-stone-700 hover:text-emerald-600 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all rounded-lg flex items-center gap-1.5 shadow-none">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            Catat Pemasukan
          </Button>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Transaksi */}
        <div className="aspect-auto rounded-xl bg-muted/50 p-6 flex items-center gap-4 border border-border/60 hover:bg-muted/80 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Transaksi</p>
            {loading ? (
              <div className="h-6 w-16 bg-muted rounded animate-pulse mt-1" />
            ) : (
              <p className="text-lg font-semibold text-foreground mt-0.5">{summary?.totalCount ?? 0}</p>
            )}
          </div>
        </div>

        {/* Card 2: Total Masuk */}
        <div className="aspect-auto rounded-xl bg-muted/50 p-6 flex items-center gap-4 border border-border/60 hover:bg-muted/80 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Masuk</p>
            {loading ? (
              <div className="h-6 w-24 bg-muted rounded animate-pulse mt-1" />
            ) : (
              <p className="text-lg font-semibold text-foreground mt-0.5">{formatRp(summary?.totalIncome ?? 0)}</p>
            )}
          </div>
        </div>

        {/* Card 3: Total Keluar */}
        <div className="aspect-auto rounded-xl bg-muted/50 p-6 flex items-center gap-4 border border-border/60 hover:bg-muted/80 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-[#E35B30]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Keluar</p>
            {loading ? (
              <div className="h-6 w-24 bg-muted rounded animate-pulse mt-1" />
            ) : (
              <p className="text-lg font-semibold text-foreground mt-0.5">{formatRp(summary?.totalExpense ?? 0)}</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex items-center gap-2">
        {(["all", "INCOME", "EXPENSE"] as const).map((f) => (
          <button key={f} onClick={() => handleFilterChange(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === f
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-transparent border-border text-muted-foreground hover:bg-muted"
              }`}>
            {f === "all" ? "Semua" : f === "INCOME" ? "Masuk" : "Keluar"}
            <span className="ml-1.5 opacity-60">
              ({f === "all" ? (summary?.totalCount ?? 0) : f === "INCOME" ? incomeCount : expenseCount})
            </span>
          </button>
        ))}
      </div>

      {/* ─── Transaction Table ─── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Kantong</th>
                  <th className="p-4">Catatan</th>
                  <th className="p-4 text-right">Jumlah</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Belum ada transaksi</p>
              <p className="text-xs text-muted-foreground mt-1">Tekan tombol di atas untuk mencatat.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={`overflow-x-auto transition-opacity duration-200 ${loadingPage ? "opacity-50" : "opacity-100"}`}>
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Keterangan</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Kantong</th>
                    <th className="p-4">Catatan</th>
                    <th className="p-4 text-right">Jumlah</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/50 transition-colors group">
                      <td className="p-4 text-muted-foreground whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 bg-white border border-border">
                            {tx.type === "INCOME"
                              ? <ArrowUpRight className="w-4 h-4 text-primary" />
                              : <ArrowDownRight className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <span className="text-foreground font-semibold">{tx.description}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground border border-border/40 rounded text-[10px] whitespace-nowrap font-bold">{tx.category}</span>
                      </td>
                      <td className="p-4">
                        {tx.account ? (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground border border-border/40 rounded text-[10px] whitespace-nowrap font-bold">{tx.account}</span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground font-normal">{tx.note || "—"}</td>
                      <td className={`p-4 text-right font-bold whitespace-nowrap ${tx.type === "INCOME" ? "text-foreground" : "text-muted-foreground"}`}>
                        {tx.type === "INCOME" ? "+" : "−"}{formatRp(tx.amount)}
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleDeleteClick(tx.id)} disabled={deletingId === tx.id}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-100 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-all cursor-pointer">
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

            {/* ─── Pagination ─── */}
            {totalFilteredCount > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-[10px] font-bold text-muted-foreground">
                  Menampilkan <span className="text-foreground">{startIdx}</span>–<span className="text-foreground">{endIdx}</span> dari <span className="text-foreground">{totalFilteredCount}</span> transaksi
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || loadingPage}
                    className="p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<Array<number | "ellipsis">>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "ellipsis" ? (
                        <span key={`e-${idx}`} className="px-1 text-[10px] text-muted-foreground font-bold">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          disabled={loadingPage}
                          className={`w-7 h-7 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${page === p
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border border-border bg-white text-muted-foreground hover:bg-muted"
                            }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || loadingPage}
                    className="p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex">
              <div className="hidden sm:flex flex-col justify-between p-8 w-56 shrink-0 bg-muted/40 border-r border-border/60">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {modalTab === "INCOME" ? "Uang Masuk" : "Uang Keluar"}
                  </p>
                  <p className="text-3xl font-black mt-3 leading-tight break-all text-foreground">
                    {numericAmount > 0 ? formatRp(numericAmount) : "Rp 0"}
                  </p>
                </div>
                <div className="text-[10px] font-bold space-y-1.5 text-muted-foreground">
                  <p>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                  {categoriesForTab.find((c) => c.id === categoryId)?.name && (
                    <p className="capitalize">{categoriesForTab.find((c) => c.id === categoryId)?.name}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 p-7 space-y-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-extrabold text-foreground">Catat Transaksi Baru</h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Isi detail di bawah ini dengan lengkap.</p>
                  </div>
                  <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
                  {(["EXPENSE", "INCOME"] as TxType[]).map((tab) => (
                    <button key={tab} type="button" onClick={() => switchTab(tab)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${modalTab === tab
                        ? "bg-white shadow-sm text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground"
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
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                      Keterangan <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text" required autoFocus
                      placeholder={modalTab === "INCOME" ? "Gaji Oktober, Pembayaran Klien..." : "Makan Siang, Bensin, Tagihan..."}
                      value={desc}
                      onChange={(e) => { setDesc(e.target.value); setError(""); }}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-xs font-medium placeholder:text-muted-foreground/40 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                      Jumlah (Rp) <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">Rp</span>
                      <input
                        type="number" required min={1}
                        placeholder="0"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(""); }}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-xs font-medium placeholder:text-muted-foreground/40 transition-all"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {QUICK_AMOUNTS.map((n) => (
                        <button key={n} type="button" onClick={() => setAmount(String(n))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${amount === String(n)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground border-transparent"
                            }`}>
                          {n >= 1000000 ? `${n / 1000000}jt` : `${n / 1000}rb`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Kategori</label>
                        <Link href="/settings?tab=kategori" onClick={closeModal}
                          className="text-[9px] text-primary font-bold hover:underline flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />Kelola
                        </Link>
                      </div>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                        <SelectContent>
                          {categoriesForTab.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Kantong</label>
                      <Select value={accountId} onValueChange={setAccountId}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Pilih kantong..." /></SelectTrigger>
                        <SelectContent>
                          {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                      Catatan <span className="text-muted-foreground/60 font-medium normal-case">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Catatan singkat..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-xs font-medium placeholder:text-muted-foreground/40 transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-destructive font-bold px-1">{error}</p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeModal}
                      className="flex-1 py-2.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                      Batal
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer">
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Hapus Transaksi"
        message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini akan mengupdate saldo kantong Anda kembali."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}