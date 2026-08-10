"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Calendar,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Info,
  Download,
  RefreshCw
} from "lucide-react";

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardMenuRef.current && !cardMenuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const transactions = [
    { date: "Oct 28", desc: "Kopi", category: "Food & Drink", amount: "-Rp 55,000", isIncome: false },
    { date: "Oct 27", desc: "Gaji", category: "Salary", amount: "+Rp 15,000,000", isIncome: true },
    { date: "Oct 26", desc: "Listrik", category: "Utilities", amount: "-Rp 750,000", isIncome: false },
    { date: "Oct 25", desc: "Tokopedia", category: "Shopping", amount: "-Rp 1,200,000", isIncome: false },
    { date: "Oct 24", desc: "Netflix", category: "Subscr.", amount: "-Rp 186,000", isIncome: false },
  ];

  const handleCardMenuToggle = (cardId: string) => {
    setActiveMenu(activeMenu === cardId ? null : cardId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Dashboard Header & Date Selector ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Overview</h1>
          <p className="text-xs text-stone-500">Pantau dan kelola aset finansial Anda dalam satu tempat.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-900/10 rounded-lg text-xs font-bold text-stone-600 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Oct 1 - Oct 31, 2023</span>
        </div>
      </div>

      {/* ─── Grid Cards matching landing page styles ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet Balance Card */}
        <div className="bg-white border border-stone-900/10 rounded-lg p-6 flex flex-col justify-between min-h-[160px] shadow-sm relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Saldo Utama</span>
              <h3 className="text-xs font-bold text-stone-500 mt-0.5">Wallet Balance</h3>
            </div>
            <div className="relative">
              <button 
                onClick={() => handleCardMenuToggle("wallet")}
                className="text-stone-400 hover:text-stone-950 transition-colors p-1 rounded-md hover:bg-stone-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {activeMenu === "wallet" && (
                <div ref={cardMenuRef} className="absolute right-0 mt-1 w-36 bg-white border border-stone-200 rounded-lg shadow-md py-1 z-10 text-xs font-bold">
                  <button className="w-full text-left px-3 py-1.5 hover:bg-stone-50 transition-colors flex items-center gap-2 text-stone-700">
                    <RefreshCw className="w-3 h-3 text-stone-400" />
                    <span>Perbarui</span>
                  </button>
                  <button className="w-full text-left px-3 py-1.5 hover:bg-stone-50 transition-colors flex items-center gap-2 text-stone-700">
                    <Download className="w-3 h-3 text-stone-400" />
                    <span>Ekspor PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="my-3">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Rp 14,250,000
            </h2>
          </div>

          <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Terhubung ke Rekening Mandiri & BCA</span>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-white border border-stone-900/10 rounded-lg p-6 flex flex-col justify-between min-h-[160px] shadow-sm relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dana Cadangan</span>
              <h3 className="text-xs font-bold text-stone-500 mt-0.5">Tabungan Aset</h3>
            </div>
            <div className="relative">
              <button 
                onClick={() => handleCardMenuToggle("savings")}
                className="text-stone-400 hover:text-stone-950 transition-colors p-1 rounded-md hover:bg-stone-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {activeMenu === "savings" && (
                <div ref={cardMenuRef} className="absolute right-0 mt-1 w-36 bg-white border border-stone-200 rounded-lg shadow-md py-1 z-10 text-xs font-bold">
                  <button className="w-full text-left px-3 py-1.5 hover:bg-stone-50 transition-colors flex items-center gap-2 text-stone-700">
                    <RefreshCw className="w-3 h-3 text-stone-400" />
                    <span>Perbarui</span>
                  </button>
                  <button className="w-full text-left px-3 py-1.5 hover:bg-stone-50 transition-colors flex items-center gap-2 text-stone-700">
                    <Download className="w-3 h-3 text-stone-400" />
                    <span>Ekspor PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="my-3">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Rp 7,350,000
            </h2>
          </div>

          <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tumbuh +2.4% bulan ini</span>
          </div>
        </div>

        {/* Saving Goal Progress Card */}
        <div className="bg-white border border-stone-900/10 rounded-lg p-6 flex flex-col justify-between min-h-[160px] shadow-sm relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Goal Celengan</span>
              <h3 className="text-xs font-bold text-stone-500 mt-0.5">Laptop Baru (85%)</h3>
            </div>
            <div className="relative">
              <button 
                onClick={() => handleCardMenuToggle("goal")}
                className="text-stone-400 hover:text-stone-950 transition-colors p-1 rounded-md hover:bg-stone-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {activeMenu === "goal" && (
                <div ref={cardMenuRef} className="absolute right-0 mt-1 w-36 bg-white border border-stone-200 rounded-lg shadow-md py-1 z-10 text-xs font-bold">
                  <button className="w-full text-left px-3 py-1.5 hover:bg-stone-50 transition-colors flex items-center gap-2 text-stone-700">
                    <RefreshCw className="w-3 h-3 text-stone-400" />
                    <span>Perbarui</span>
                  </button>
                  <button className="w-full text-left px-3 py-1.5 hover:bg-stone-50 transition-colors flex items-center gap-2 text-stone-700">
                    <Download className="w-3 h-3 text-stone-400" />
                    <span>Ekspor PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="my-3">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Rp 17,000,000 <span className="text-xs font-bold text-stone-400">/ Rp 20jt</span>
            </h2>
          </div>

          <div className="w-full space-y-1">
            <div className="w-full bg-stone-100 rounded-full h-1.5 border border-stone-900/5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Row 2: Cash Flow and Recent Transactions ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Expenses Chart */}
        <div className="bg-white border border-stone-900/10 rounded-lg p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Aliran Kas Bulanan</h3>
              <p className="text-xs text-stone-500 mt-0.5">Statistik pemasukan dan pengeluaran</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Pemasukan
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-[#E35B30]"></span>
                Pengeluaran
              </span>
            </div>
          </div>

          <div className="h-48 w-full flex items-end gap-6 pt-4 px-2">
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex justify-center items-end gap-1.5 h-32">
                <div className="w-4 bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t-sm h-[60%]"></div>
                <div className="w-4 bg-[#E35B30]/20 hover:bg-[#E35B30] transition-all duration-300 rounded-t-sm h-[40%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-500">Minggu 1</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex justify-center items-end gap-1.5 h-32">
                <div className="w-4 bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t-sm h-[70%]"></div>
                <div className="w-4 bg-[#E35B30]/20 hover:bg-[#E35B30] transition-all duration-300 rounded-t-sm h-[50%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-500">Minggu 2</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex justify-center items-end gap-1.5 h-32">
                <div className="w-4 bg-primary/25 hover:bg-primary transition-all duration-300 rounded-t-sm h-[85%]"></div>
                <div className="w-4 bg-[#E35B30]/25 hover:bg-[#E35B30] transition-all duration-300 rounded-t-sm h-[30%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-500">Minggu 3</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex justify-center items-end gap-1.5 h-32">
                <div className="w-4 bg-primary hover:bg-primary transition-all duration-300 rounded-t-sm h-[95%]"></div>
                <div className="w-4 bg-[#E35B30] hover:bg-[#E35B30] transition-all duration-300 rounded-t-sm h-[25%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-500">Minggu 4</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions Panel */}
        <div className="bg-white border border-stone-900/10 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-stone-900">Transaksi Terakhir</h3>
            <p className="text-xs text-stone-500 mt-0.5">Riwayat 5 transaksi terakhir Anda</p>
          </div>

          <div className="space-y-3.5 flex-1 mt-2">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-none">
                <div>
                  <p className="text-xs font-bold text-stone-800">{tx.desc}</p>
                  <p className="text-[10px] text-stone-400 font-medium">{tx.date} • {tx.category}</p>
                </div>
                <span className={`text-xs font-extrabold ${tx.isIncome ? "text-emerald-600" : "text-stone-800"}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
