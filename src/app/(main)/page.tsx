import { ArrowRight, Check, CheckCircle2, Heart, PieChart, TrendingUp, Wallet, Shield, BarChart3, Banknote, Coins, Lock, CreditCard, LineChart, Receipt, Calendar, Star, Infinity, BellRing, Target, ArrowDownRight, MousePointerClick, SearchCheck, Sparkles, MoveUpRight, Plus, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Highlighter } from "@/components/highlighter";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-sans selection:bg-primary/20 overflow-x-hidden">
      <div className="relative z-10">
        {/* Background Sophistication */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/40 blur-[140px] -z-10 rounded-xl"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-amber-50/30 blur-[140px] -z-10 rounded-xl"></div>

        {/* Hero Section */}
        <section id="tentang" className="pt-24 pb-16 px-6 md:px-12 lg:pt-32 lg:pb-24 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">

            {/* Left Column (Main Content) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in">
                  <span className="flex h-1.5 w-1.5 rounded-xl bg-blue-500 animate-pulse"></span>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Atur Keuangan Lebih Cerdas</p>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-[#111827]">
                  <span className="relative inline-block z-0">
                    Kelola Uangmu,
                    <Highlighter variant={2} className="text-emerald-300/60 translate-y-3" strokeWidth={3} />
                  </span> <br />
                  <span className="text-primary relative inline-block z-0 mt-2">
                    Wujudkan
                  </span> <br />
                  <span className="relative inline-block z-0 mt-2">
                    Mimpi.
                  </span>
                </h1>

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
                  Lihat Cara Kerjanya
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* High Trust Proof */}
              <div className="pt-8 flex flex-col md:flex-row items-center gap-8 opacity-80">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#111827]">4.9/5 Rating</span>
                </div>
                <div className="h-3 w-px bg-gray-200 hidden md:block"></div>
                <p className="max-w-[300px] text-[10px] font-semibold text-gray-400 leading-relaxed uppercase tracking-widest">
                  Aplikasi pencatat keuangan pintar untuk memonitor pengeluaran dan pemasukan Anda.
                </p>
              </div>
            </div>

            {/* Right Column (Visual Mockup) */}
            <div className="lg:col-span-5 space-y-8 relative">
              <div className="space-y-4">
                <p className="text-sm md:text-base font-medium text-[#6B7280] leading-relaxed italic border-l-4 border-blue-100 pl-5">
                  "Hematyu membantu Anda mencatat pengeluaran, menyusun anggaran, dan mencapai tujuan finansial tanpa pusing."
                </p>
              </div>

              <div className="relative pt-4">
                {/* Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 text-blue-500/10 rotate-12 hidden lg:block">
                  <Highlighter variant={1} className="w-full h-full" />
                </div>

                <div className="relative z-10 group">
                  <div className="absolute inset-0 bg-primary/5 blur-[60px] -z-10 rounded-xl group-hover:bg-primary/10 transition-colors"></div>

                  <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(30,27,75,0.15)] border-2 border-white group-hover:-translate-y-2 transition-all duration-700">
                    <img
                      src="https://www.uidux.com/uploads/components/freelancer-finance-dashboard-1672958200.png"
                      alt="Antarmuka Aplikasi Hematyu"
                      className="w-full h-auto scale-105 group-hover:scale-100 transition-transform duration-1000"
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section id="fitur" className="px-6 md:px-12 py-24 bg-white relative">
          <div className="max-w-7xl mx-auto space-y-16 relative z-10">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight">Fitur Lengkap untuk <br /> <span className="relative inline-block z-0">Kesehatan Finansialmu.<Highlighter variant={2} className="text-emerald-300/80" strokeWidth={4} /></span></h2>
              <p className="text-sm md:text-base text-[#6B7280] font-medium leading-relaxed">Semua yang Anda butuhkan untuk mengatur uang dengan mudah dalam satu aplikasi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1 - Manajemen Transaksi */}
              <div className="md:col-span-8 p-10 bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl space-y-10 group overflow-hidden relative shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-700">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                  <Receipt className="w-64 h-64 text-blue-600" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:rotate-6 transition-transform shadow-sm">
                    <Banknote className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#111827]">Catat Transaksi Instan</h3>
                    <p className="text-[#6B7280] text-base font-medium max-w-md leading-relaxed">
                      Catat setiap pemasukan dan pengeluaran dalam hitungan detik. Laporan otomatis membantu Anda melacak ke mana perginya uang Anda.
                    </p>
                  </div>

                  <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Pemasukan', val: '+100%' },
                      { label: 'Pengeluaran', val: 'Terkontrol' },
                      { label: 'Tabungan', val: 'Aman' },
                      { label: 'Tagihan', val: 'Lunas' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-100 shadow-sm space-y-2 hover:-translate-y-1 transition-all">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-xs font-bold text-[#111827]">{item.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 2 - Planning */}
              <div className="md:col-span-4 p-10 bg-[#FEF08A] rounded-2xl space-y-10 flex flex-col justify-between shadow-sm border border-white relative overflow-hidden group hover:shadow-xl transition-all duration-700">
                <div className="absolute -top-10 -right-10 w-48 h-48 text-amber-700/10 rotate-45 group-hover:rotate-[60deg] transition-transform duration-1000">
                  <Calendar className="w-full h-full fill-current" />
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-amber-800/30 group-hover:rotate-6 transition-transform shadow-sm">
                  <Target className="w-6 h-6 text-amber-700" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#854D0E]">Rencana Anggaran Cerdas</h3>
                  <p className="text-[#854D0E]/80 font-medium text-base leading-relaxed">
                    Buat target pengeluaran bulanan. Hematyu akan memberi tahu sisa anggaran agar Anda tidak boros.
                  </p>
                  <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl space-y-3 border border-white/50">
                    <div className="flex justify-between items-center text-[9px] font-black text-amber-900 uppercase tracking-widest">
                      <span>Alokasi Anggaran</span>
                      <span>70%</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/30 rounded-xl overflow-hidden">
                      <div className="h-full bg-amber-700 w-[70%] rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Alerts */}
              <div className="md:col-span-4 p-10 bg-[#F3F4F6] rounded-2xl space-y-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-700">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                  <BellRing className="w-6 h-6 text-gray-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#111827]">Pengingat Otomatis</h3>
                  <p className="text-[#6B7280] font-medium text-base leading-relaxed">
                    Dapatkan notifikasi cerdas jika pengeluaran hampir melebihi batas anggaran yang Anda tentukan.
                  </p>
                </div>
              </div>

              {/* Feature 4 - Security */}
              <div className="md:col-span-8 p-10 bg-[#111827] text-white rounded-2xl flex flex-col md:flex-row items-center gap-12 shadow-2xl border border-white/10 relative overflow-hidden group">
                <div className="flex-1 space-y-6 relative z-10">
                  <h3 className="text-3xl font-bold tracking-tight">Aman dan Terenkripsi</h3>
                  <p className="text-blue-200/80 font-medium text-base leading-relaxed">
                    Data keuangan Anda dilindungi dengan standar enkripsi tinggi. Aman, privat, dan sepenuhnya milik Anda.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" /> Terverifikasi ISO
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-[10px] uppercase tracking-widest">
                      <Lock className="w-4 h-4" /> Aman 256-bit
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full bg-white/5 backdrop-blur-2xl rounded-2xl p-8 space-y-4 relative z-10 border border-white/10">
                  {[
                    { label: 'Integrasi Bank', icon: Check },
                    { label: 'Sinkronisasi Cloud', icon: Check }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="font-semibold text-xs text-blue-100">{item.label}</span>
                      <item.icon className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="demo" className="py-24 px-6 md:px-12 bg-[#F8F9FB] relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center space-y-6 mb-24">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-lg bg-white text-primary text-[9px] font-black uppercase tracking-[0.2em] border border-blue-100">
                <Zap className="w-3 h-3" />
                <span>Cara Kerja Hematyu</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight"><span className="relative inline-block z-0">Tiga Langkah<Highlighter variant={1} className="text-emerald-300/80" strokeWidth={5} /></span> Menuju Finansial Sehat.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {[
                {
                  title: "1. Catat Harian",
                  desc: "Masukkan setiap transaksi Anda. Semudah mengirim pesan.",
                  icon: MousePointerClick,
                  color: "border-blue-200 text-blue-600",
                  tag: "Tahap 01"
                },
                {
                  title: "2. Pantau Pengeluaran",
                  desc: "Lihat laporan visual yang jelas untuk tahu kemana uang Anda pergi setiap bulannya.",
                  icon: SearchCheck,
                  color: "border-primary/20 text-primary",
                  tag: "Tahap 02"
                },
                {
                  title: "3. Capai Target",
                  desc: "Ikuti rekomendasi anggaran dan capai target tabungan Anda dengan lebih cepat.",
                  icon: TrendingUp,
                  color: "border-blue-200 text-blue-600",
                  tag: "Tahap 03"
                }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                  <div className={`w-20 h-20 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-sm ${s.color}`}>
                    <s.icon className="w-9 h-9" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{s.tag}</p>
                    <h3 className="text-xl md:text-2xl font-bold text-[#111827] group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-[#6B7280] text-sm md:text-base font-medium leading-relaxed px-4 opacity-80">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="harga" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-20 relative z-10">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight">Pilih Paket yang <span className="relative inline-block z-0">Sesuai.<Highlighter variant={5} className="text-emerald-400/40" strokeWidth={3} /></span></h2>
              <p className="text-[#6B7280] text-base md:text-lg font-medium max-w-lg mx-auto">Mulai dari yang gratis, tingkatkan saat Anda siap mengatur keuangan lebih pro.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 hover:shadow-xl group">
                <div className="text-left space-y-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:rotate-6 transition-transform shadow-sm">
                    <Wallet className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#111827]">Pemula</h3>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Selalu Gratis</p>
                  </div>
                  <div className="text-3xl font-bold text-[#111827]">Rp 0</div>
                  <ul className="space-y-3 pt-2">
                    {["Catat Transaksi", "Laporan Mingguan", "Data Lokal Aman"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-[#6B7280]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 relative overflow-hidden hover:shadow-xl group">
                <div className="absolute top-6 right-6 px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-md z-20">Populer</div>
                <div className="text-left space-y-6 relative z-10">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-primary/20 group-hover:rotate-6 transition-transform shadow-sm">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#111827]">Pro</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Langganan Bulanan</p>
                  </div>
                  <div className="text-3xl font-bold text-[#111827]">Rp 29k <span className="text-sm text-gray-400">/bln</span></div>
                  <ul className="space-y-3 pt-2">
                    {["Bebas Iklan", "Sinkronisasi Cloud", "Ekspor Laporan", "Target Unlimit"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-[#6B7280]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lifetime Plan */}
              <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 relative overflow-hidden hover:shadow-xl group">
                <div className="text-left space-y-6 relative z-10">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:rotate-6 transition-transform shadow-sm">
                    <Infinity className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#111827]">Seumur Hidup</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sekali Bayar</p>
                  </div>
                  <div className="text-3xl font-bold text-[#111827]">Rp 499k</div>
                  <ul className="space-y-3 pt-2">
                    {["Ekosistem Penuh", "Sekali Bayar", "Update Eksklusif", "Akses VIP"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-[#6B7280]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-16 relative z-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight">Apa <span className="relative inline-block z-0">Kata Mereka.<Highlighter variant={2} className="text-amber-400/60" strokeWidth={5} /></span></h2>
              <div className="w-16 h-1 bg-primary rounded-xl mx-auto opacity-10"></div>
            </div>

            <div className="grid grid-cols-1 md:flex-row md:flex gap-8">
              {[
                { name: "Andi Saputra", text: "Aplikasinya gampang banget dipake! Sekarang aku tahu pasti ke mana aja gajiku tiap bulan. Bye-bye pengeluaran ga jelas!", job: "Karyawan Swasta", color: "bg-[#EFF6FF]" },
                { name: "Siska Amelia", text: "Suka banget sama fitur target budgetnya. Notifikasinya sangat membantu buat ngerem kalau lagi boros jajan.", job: "Freelancer", color: "bg-[#FEF08A]/20" },
                { name: "Rian Hidayat", text: "Laporannya visual dan mudah dibaca. Mengatur keuangan keluarga jadi jauh lebih praktis dan transparan.", job: "Wiraswasta", color: "bg-[#F3F4F6]" }
              ].map((r, i) => (
                <div key={i} className={`p-10 rounded-2xl flex-1 ${r.color} shadow-sm border border-white flex flex-col justify-between hover:-translate-y-2 transition-all duration-500 hover:shadow-xl group`}>
                  <div className="space-y-6 text-left">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-base font-medium text-[#111827] italic leading-relaxed opacity-80">"{r.text}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-10">
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.name}`} className="w-10 h-10 rounded-lg border-2 border-white shadow-xl group-hover:scale-110 transition-transform" alt="avatar" />
                    <div className="text-left">
                      <h4 className="font-bold text-xs text-[#111827]">{r.name}</h4>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{r.job}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 md:px-12 text-center bg-white relative">
          <div className="max-w-7xl mx-auto p-16 md:p-24 rounded-3xl bg-gradient-to-br from-[#111827] to-[#111827] space-y-12 relative overflow-hidden shadow-2xl group border border-white/5">
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 rounded-xl border border-white/20 flex items-center justify-center shadow-2xl mx-auto mb-6">
                <Heart className="w-8 h-8 text-rose-400 fill-current" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tighter">
                Mulai Perjalanan <br /> Bebas Finansial Anda.
              </h2>
              <p className="text-blue-200/60 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Bergabung dengan ribuan pengguna lainnya yang telah berhasil mengubah cara mereka mengelola uang.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex flex-col items-center gap-6">
              <Link
                href="#"
                className="inline-flex items-center gap-4 px-12 py-5 bg-white text-[#111827] font-black text-lg rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl group overflow-hidden relative"
              >
                Daftar Sekarang, Gratis
                <Rocket className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[9px] font-black text-emerald-300/40 uppercase tracking-[0.4em]">Tanpa Kartu Kredit • Batal Kapan Saja</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}