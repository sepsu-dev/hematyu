"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TxType = "income" | "expense";

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

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];

export default function NewTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "income" ? "income" : "expense";

  const [txType, setTxType] = useState<TxType>(initialType);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(
    initialType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (type: TxType) => {
    setTxType(type);
    setCategory(type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/[^0-9]/g, ""), 10);

    if (!desc.trim()) { setError("Keterangan tidak boleh kosong."); return; }
    if (isNaN(num) || num <= 0) { setError("Masukkan jumlah yang valid."); return; }

    // Show success briefly then navigate back
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard/transactions");
    }, 800);
  };

  const numericAmount = parseInt(amount || "0", 10);

  return (
    <div className="space-y-6 max-w-xl">

      {/* ─── Back nav ─── */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Transaksi
        </Link>
      </div>

      {/* ─── Page title ─── */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Catat Transaksi Baru</h1>
        <p className="text-xs text-stone-500 mt-0.5">Isi detail transaksi uang masuk atau uang keluar Anda.</p>
      </div>

      {/* ─── Main Card ─── */}
      <div className="sketch-card bg-white p-7 space-y-6">

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FAF6F0] rounded-xl border border-[#E7DED4]">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex items-center justify-center gap-2.5 py-3.5 rounded-lg text-sm font-extrabold transition-all ${
              txType === "expense"
                ? "bg-white shadow-sm text-[#E35B30] border border-[#E7DED4]"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              txType === "expense" ? "bg-orange-50" : "bg-stone-100"
            }`}>
              <ArrowDownRight className={`w-4 h-4 ${txType === "expense" ? "text-[#E35B30]" : "text-stone-400"}`} />
            </div>
            Uang Keluar
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex items-center justify-center gap-2.5 py-3.5 rounded-lg text-sm font-extrabold transition-all ${
              txType === "income"
                ? "bg-white shadow-sm text-emerald-600 border border-[#E7DED4]"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              txType === "income" ? "bg-emerald-50" : "bg-stone-100"
            }`}>
              <ArrowUpRight className={`w-4 h-4 ${txType === "income" ? "text-emerald-600" : "text-stone-400"}`} />
            </div>
            Uang Masuk
          </button>
        </div>

        {/* Amount Display */}
        <div className={`rounded-xl p-5 border-2 transition-colors ${
          txType === "income"
            ? "bg-emerald-50 border-emerald-200"
            : "bg-orange-50 border-orange-200"
        }`}>
          <p className={`text-[11px] font-extrabold uppercase tracking-widest mb-2 ${
            txType === "income" ? "text-emerald-600" : "text-[#E35B30]"
          }`}>
            {txType === "income" ? "Jumlah Masuk" : "Jumlah Keluar"}
          </p>
          <p className={`text-3xl font-black tracking-tight ${
            txType === "income" ? "text-emerald-700" : "text-[#E35B30]"
          }`}>
            {numericAmount > 0 ? formatRp(numericAmount) : "Rp 0"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Keterangan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              Keterangan <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={txType === "income"
                ? "Contoh: Gaji Oktober, Pembayaran Freelance..."
                : "Contoh: Makan Siang, Beli Bensin, Tagihan Listrik..."}
              value={desc}
              onChange={e => { setDesc(e.target.value); setError(""); }}
              className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7DED4] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-stone-900 text-sm font-bold placeholder:text-stone-300 transition-all"
            />
          </div>

          {/* Jumlah */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              Jumlah (Rp) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-stone-400 pointer-events-none">Rp</span>
              <input
                type="number"
                required
                min={1}
                placeholder="0"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(""); }}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF6F0] border border-[#E7DED4] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-stone-900 text-sm font-bold placeholder:text-stone-300 transition-all"
              />
            </div>
            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_AMOUNTS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setAmount(String(n))}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
                    amount === String(n)
                      ? txType === "income"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-orange-100 text-[#E35B30] border border-orange-200"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-600 border border-transparent"
                  }`}
                >
                  {n >= 1000000 ? `${n / 1000000}jt` : `${n / 1000}rb`}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kategori</label>
              <Link
                href="/dashboard/settings?tab=kategori"
                className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline"
              >
                <Tag className="w-3 h-3" />
                Kelola Kategori
              </Link>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 rounded-xl text-sm">
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              Catatan
              <span className="ml-1.5 text-stone-300 normal-case font-medium">(opsional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tambahkan catatan atau detail tambahan..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7DED4] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-stone-900 text-sm font-bold placeholder:text-stone-300 transition-all resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-600 font-bold">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/dashboard/transactions"
              className="flex-1 flex items-center justify-center py-3 rounded-xl border-2 border-[#E7DED4] text-sm font-extrabold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={success}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-white text-sm font-extrabold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 ${
                success
                  ? "bg-emerald-500"
                  : txType === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#E35B30] hover:bg-[#c94d27]"
              }`}
            >
              {success ? (
                <>✓ Tersimpan!</>
              ) : (
                <>
                  <PlusCircle className="w-4.5 h-4.5" />
                  Simpan {txType === "income" ? "Uang Masuk" : "Uang Keluar"}
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
