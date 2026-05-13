import { Rocket, ArrowRight, TrendingUp, Wallet, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Highlighter } from "@/components/highlighter";

export function Hero() {
  return (
    <section id="tentang" className="pt-24 pb-16 px-6 md:px-12 lg:pt-32 lg:pb-24 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">

        {/* Left Column (Main Content) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in">
              <span className="flex h-1.5 w-1.5 rounded-xl bg-blue-500 animate-pulse"></span>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Solusi Keuangan Cerdas untuk Semua</p>
            </div>

            <h1 className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.05] text-[#111827]">
              <span className="relative inline-block z-0">
                Atur Keuangan,
              </span> <br />
              <span className="text-primary relative inline-block z-0 mt-1 md:mt-2">
                Jadi Lebih Simpel
              </span> <br />
              <span className="relative inline-block z-0 mt-1 md:mt-2">
                dan Terukur.
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#6B7280] font-medium max-w-xl leading-relaxed animate-fade-in">
              Wujudkan kebebasan finansial Anda dengan asisten pintar. Catat transaksi semudah kirim pesan, pantau anggaran otomatis, dan raih target masa depan dengan lebih pasti.
            </p>

            <div className="inline-flex items-center gap-3 p-1 pr-5 bg-white rounded-lg shadow-lg shadow-blue-900/5 border border-gray-50 group hover:scale-105 transition-transform cursor-default">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 88}`} className="w-8 h-8 rounded-lg border-2 border-white" alt="avatar" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-[#111827] uppercase tracking-widest">Dipercaya 10,000+ Pengguna</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] text-white font-bold text-base rounded-lg flex items-center justify-center gap-2 group transition-all hover:bg-black hover:shadow-xl active:scale-95 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Mulai Gratis Sekarang
              <Rocket className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#111827] font-bold text-base rounded-lg border border-gray-200 flex items-center justify-center gap-2 group transition-all hover:bg-gray-50 hover:border-blue-200"
            >
              Tanya via WhatsApp
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column (Visual Mockup) */}
        <div className="lg:col-span-5 space-y-8 relative">

          <div className="relative pt-4">
            <div className="relative z-10 group">
              <div className="absolute inset-0 bg-primary/5 blur-[60px] -z-10 rounded-xl group-hover:bg-primary/10 transition-colors"></div>

              {/* Floating Card 1 - Balance */}
              <div className="absolute -top-6 -right-6 md:-right-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-20 animate-bounce-slow hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Total Saldo</p>
                    <p className="text-sm font-black text-[#111827]">Rp 24.500.000</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - Stats */}
              <div className="absolute -bottom-8 -left-6 md:-left-10 bg-[#111827] text-white p-4 rounded-xl shadow-xl border border-gray-800 z-20 animate-float hidden sm:block">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-8">
                    <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Target Tabungan</p>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-lg font-bold">85%</p>
                    <p className="text-[9px] text-gray-400 mb-1">Tercapai</p>
                  </div>
                  <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Secure */}
              <div className="absolute top-1/2 -right-4 translate-y-12 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg border border-gray-100 z-20 flex items-center gap-2 animate-pulse hidden lg:flex">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-bold text-gray-600">Terverifikasi Aman</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(30,27,75,0.15)] border-2 border-white group-hover:-translate-y-2 transition-all duration-700">
                <img
                  src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Antarmuka Aplikasi Hematyu"
                  className="w-full h-auto scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
