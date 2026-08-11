"use client";

import { useState } from "react";
import { Settings, User, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Jason David",
    email: "jason.david@example.com",
    phone: "+62 812 3456 7890",
  });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl relative">
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <span>Profil berhasil disimpan!</span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Pengaturan Akun</h1>
        <p className="text-xs text-stone-500">Sesuaikan data profil, notifikasi, dan keamanan akun Anda.</p>
      </div>

      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-6 border-b border-[#E7DED4]">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>Profil Pribadi</span>
          </h3>
        </div>
        <div className="p-6 space-y-4 text-xs font-bold text-stone-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-stone-500">Nama Lengkap</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-stone-900 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-500">Alamat Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-stone-900 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-500">Nomor Telepon</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-stone-900 font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-bold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
