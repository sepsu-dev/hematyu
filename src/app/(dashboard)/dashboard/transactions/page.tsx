"use client";

import { useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TxType = "income" | "expense";

interface Transaction {
  id: number;
  date: string;
  desc: string;
  category: string;
  amount: number;
  type: TxType;
  note: string;
}

const INCOME_CATEGORIES = [
  "Gaji / Pendapatan",
  "Freelance / Projek",
  "Bonus",
  "Investasi",
  "Penjualan",
  "Lainnya",
];

const EXPENSE_CATEGORIES = [
  "Makanan & Minuman",
  "Tagihan & Listrik",
  "Belanja / Toko",
  "Transportasi",
  "Langganan / Media",
  "Kesehatan",
  "Hiburan",
  "Pendidikan",
  "Lainnya",
];

const INITIAL: Transaction[] = [
  { id: 1, date: "28 Okt 2023", desc: "Kopi", category: "Makanan & Minuman", amount: 55000, type: "expense", note: "" },
  { id: 2, date: "27 Okt 2023", desc: "Gaji Bulanan", category: "Gaji / Pendapatan", amount: 15000000, type: "income", note: "Transfer BCA" },
  { id: 3, date: "26 Okt 2023", desc: "Tagihan Listrik", category: "Tagihan & Listrik", amount: 750000, type: "expense", note: "" },
  { id: 4, date: "25 Okt 2023", desc: "Belanja Tokopedia", category: "Belanja / Toko", amount: 1200000, type: "expense", note: "Sepatu olahraga" },
  { id: 5, date: "24 Okt 2023", desc: "Netflix", category: "Langganan / Media", amount: 186000, type: "expense", note: "" },
];

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function todayStr() {
  return new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL);
  const [filter, setFilter] = useState<"all" | TxType>("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<TxType>("expense");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);
  const numericAmount = parseInt(amount || "0", 10);

  const openModal = (tab: TxType) => {
    setModalTab(tab);
    setCategory(tab === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setDesc(""); setAmount(""); setNote(""); setError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const switchTab = (tab: TxType) => {
    setModalTab(tab);
    setCategory(tab === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!desc.trim()) { setError("Keterangan tidak boleh kosong."); return; }
    if (isNaN(num) || num <= 0) { setError("Masukkan jumlah yang valid."); return; }
    setTransactions(prev => [{
      id: Date.now(),
      date: todayStr(),
      desc: desc.trim(),
      category,
      amount: num,
      type: modalTab,
      note: note.trim(),
    }, ...prev]);
    closeModal();
  };

  const handleDelete = (id: number) => setTransactions(prev => prev.filter(t => t.id !== id));

  const categories = modalTab === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

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
            onClick={() => openModal("expense")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E35B30] text-white hover:bg-[#c94d27] rounded-lg text-xs font-extrabold shadow-sm transition-all active:scale-[0.98]"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            Uang Keluar
          </button>
          <button
            onClick={() => openModal("income")}
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
            <p className="text-lg font-black text-stone-900">{transactions.length}</p>
          </div>
        </div>
        <div className="sketch-card bg-white p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Masuk</p>
            <p className="text-lg font-black text-stone-900">{formatRp(totalIncome)}</p>
          </div>
        </div>
        <div className="sketch-card bg-white p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-[#E35B30]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#E35B30] uppercase tracking-widest">Total Keluar</p>
            <p className="text-lg font-black text-stone-900">{formatRp(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex items-center gap-2">
        {(["all", "income", "expense"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
              filter === f
                ? f === "income" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : f === "expense" ? "bg-orange-50 border-orange-200 text-[#E35B30]"
                : "bg-stone-900 border-stone-900 text-white"
                : "bg-white border-[#E7DED4] text-stone-500 hover:bg-stone-50"
            }`}>
            {f === "all" ? "Semua" : f === "income" ? "🟢 Masuk" : "🔴 Keluar"}
            <span className="ml-1.5 opacity-60">
              ({f === "all" ? transactions.length : transactions.filter(t => t.type === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* ─── Transaction Table ─── */}
      <div className="sketch-card bg-white overflow-hidden">
        {filtered.length === 0 ? (
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
                  <th className="p-4">Catatan</th>
                  <th className="p-4 text-right">Jumlah</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED4]/40">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors group">
                    <td className="p-4 text-stone-500 whitespace-nowrap">{tx.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-emerald-50" : "bg-orange-50"}`}>
                          {tx.type === "income"
                            ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                            : <ArrowDownRight className="w-3.5 h-3.5 text-[#E35B30]" />}
                        </div>
                        <span className="text-stone-900 font-bold">{tx.desc}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[10px] whitespace-nowrap font-bold">{tx.category}</span>
                    </td>
                    <td className="p-4 text-stone-400 font-medium">{tx.note || "—"}</td>
                    <td className={`p-4 text-right font-black whitespace-nowrap ${tx.type === "income" ? "text-emerald-600" : "text-stone-900"}`}>
                      {tx.type === "income" ? "+" : "−"}{formatRp(tx.amount)}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal – wide 2-column layout */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E7DED4] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* ── Left accent strip based on type ── */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${modalTab === "income" ? "bg-emerald-500" : "bg-[#E35B30]"} transition-colors duration-200`} />

            <div className="flex">

              {/* Left: Amount preview */}
              <div className={`hidden sm:flex flex-col justify-between p-8 w-56 shrink-0 transition-colors duration-200 ${
                modalTab === "income" ? "bg-emerald-50" : "bg-orange-50"
              }`}>
                <div>
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest ${modalTab === "income" ? "text-emerald-600" : "text-[#E35B30]"}`}>
                    {modalTab === "income" ? "Uang Masuk" : "Uang Keluar"}
                  </p>
                  <p className={`text-3xl font-black mt-3 leading-tight break-all ${modalTab === "income" ? "text-emerald-700" : "text-[#E35B30]"}`}>
                    {numericAmount > 0 ? formatRp(numericAmount) : "Rp 0"}
                  </p>
                </div>
                <div className={`text-[10px] font-bold space-y-1.5 ${modalTab === "income" ? "text-emerald-600/60" : "text-[#E35B30]/60"}`}>
                  <p>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                  {category && <p className="capitalize">{category}</p>}
                </div>
              </div>

              {/* Right: Form */}
              <div className="flex-1 p-7 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-extrabold text-stone-900">Catat Transaksi Baru</h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">Isi detail di bawah ini dengan lengkap.</p>
                  </div>
                  <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Type Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  {(["expense", "income"] as TxType[]).map(tab => (
                    <button key={tab} type="button" onClick={() => switchTab(tab)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-extrabold transition-all ${
                        modalTab === tab
                          ? tab === "income"
                            ? "bg-white shadow-sm text-emerald-600 border border-emerald-200"
                            : "bg-white shadow-sm text-[#E35B30] border border-orange-200"
                          : "text-stone-400 hover:text-stone-700"
                      }`}>
                      {tab === "income"
                        ? <ArrowUpRight className="w-3.5 h-3.5" />
                        : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {tab === "income" ? "Uang Masuk" : "Uang Keluar"}
                    </button>
                  ))}
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Desc */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                      Keterangan <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" required autoFocus
                      placeholder={modalTab === "income" ? "Gaji Oktober, Pembayaran Klien..." : "Makan Siang, Bensin, Tagihan..."}
                      value={desc}
                      onChange={e => { setDesc(e.target.value); setError(""); }}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 transition-all"
                    />
                  </div>

                  {/* Amount */}
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
                        onChange={e => { setAmount(e.target.value); setError(""); }}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 transition-all"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {QUICK_AMOUNTS.map(n => (
                        <button key={n} type="button" onClick={() => setAmount(String(n))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                            amount === String(n)
                              ? modalTab === "income" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-orange-100 text-[#E35B30] border-orange-200"
                              : "bg-stone-100 hover:bg-stone-200 text-stone-600 border-transparent"
                          }`}>
                          {n >= 1000000 ? `${n / 1000000}jt` : `${n / 1000}rb`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category + Note side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kategori</label>
                        <Link href="/dashboard/settings?tab=kategori" onClick={closeModal}
                          className="text-[9px] text-primary font-bold hover:underline flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />Kelola
                        </Link>
                      </div>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                        Catatan <span className="text-stone-300 font-medium normal-case">(opsional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Catatan singkat..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-stone-900 text-xs font-bold placeholder:text-stone-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-red-500 font-bold px-1">{error}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeModal}
                      className="flex-1 py-2.5 rounded-lg border-2 border-[#E7DED4] text-xs font-extrabold text-stone-600 hover:bg-stone-50 transition-colors">
                      Batal
                    </button>
                    <button type="submit"
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-xs font-extrabold shadow-sm transition-all active:scale-[0.98] ${
                        modalTab === "income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#E35B30] hover:bg-[#c94d27]"
                      }`}>
                      <PlusCircle className="w-3.5 h-3.5" />
                      Simpan Transaksi
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
