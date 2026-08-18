"use client";

import { useState, useEffect } from "react";
import { User, Save, Check, KeyRound, ShieldAlert, Tags, Plus, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  getProfileAction,
  updateProfileAction,
  createPasswordAction,
  getCategoriesAction,
  createCategoryAction,
  deleteCategoryAction,
} from "@/app/dashboard/actions";
import { IconListGrid, getIcon } from "@/components/icon-list";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Profile {
  name: string;
  email: string;
  phone: string;
  google_linked: boolean;
  has_password: boolean;
}

export default function SettingsPage() {
  // Profile
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    google_linked: false,
    has_password: false,
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPwToast, setShowPwToast] = useState(false);

  // Categories
  const [categories, setCategories] = useState<{ id: string; name: string; type: "INCOME" | "EXPENSE"; is_default: boolean; icon_name?: string; color_hex?: string }[]>([]);
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [catIconName, setCatIconName] = useState("circle");
  const [showCatModal, setShowCatModal] = useState(false);
  const [savingCat, setSavingCat] = useState(false);
  const [catError, setCatError] = useState("");
  const [catToast, setCatToast] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [confirmCatOpen, setConfirmCatOpen] = useState(false);

  const loadCategories = () => {
    getCategoriesAction().then(setCategories).catch(() => { });
  };

  useEffect(() => {
    getProfileAction()
      .then((data) => {
        if (data?.name) {
          setProfile({
            name: data.name,
            email: data.email || "",
            phone: data.phone || "",
            google_linked: !!data.google_linked,
            has_password: !!data.has_password,
          });
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
    loadCategories();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await updateProfileAction(profile);
      toast.success("Profil berhasil diperbarui!");
    } catch (err: any) {
      toast.error(err?.message || "Gagal memperbarui profil.");
    }
  };

  const handleSavePassword = async () => {
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setSavingPassword(true);
    try {
      await createPasswordAction({ password: newPassword });
      setNewPassword("");
      setConfirmPassword("");
      setProfile({ ...profile, has_password: true });
      toast.success("Kata sandi berhasil disimpan!");
    } catch (e: any) {
      setPasswordError(e?.message || "Gagal menyimpan kata sandi.");
      toast.error(e?.message || "Gagal menyimpan kata sandi.");
    } finally {
      setSavingPassword(false);
    }
  };

  const openCatModal = () => {
    setCatName("");
    setCatType("EXPENSE");
    setCatIconName("circle");
    setCatError("");
    setShowCatModal(true);
  };

  const closeCatModal = () => {
    if (savingCat) return;
    setShowCatModal(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingCat) return;
    if (!catName.trim()) { setCatError("Nama kategori tidak boleh kosong."); return; }
    setSavingCat(true);
    setCatError("");
    try {
      await createCategoryAction({ name: catName.trim(), type: catType, iconName: catIconName });
      toast.success("Kategori berhasil dibuat!");
      closeCatModal();
      loadCategories();
    } catch (err: any) {
      setCatError(err?.message || "Gagal menyimpan kategori.");
      toast.error(err?.message || "Gagal menyimpan kategori.");
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategoryClick = (id: string) => {
    setDeleteCatId(id);
    setConfirmCatOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCatId) return;
    setConfirmCatOpen(false);
    try {
      await deleteCategoryAction(deleteCatId);
      toast.success("Kategori berhasil dihapus!");
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus kategori.");
    } finally {
      setDeleteCatId(null);
    }
  };

  return (
    <div className="space-y-6 p-6 relative">
      {showSavedToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Profil berhasil disimpan!</span>
        </div>
      )}
      {showPwToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <Check className="w-3.5 h-3.5" />
          <span>Kata sandi berhasil disimpan!</span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Pengaturan</h1>
        <p className="text-xs text-stone-500 mt-0.5">Kelola profil akun dan keamanan Anda.</p>
      </div>

      {/* Profil Pribadi */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-extrabold text-stone-900">Profil Pribadi</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Lengkap</label>
              <input type="text" value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Alamat Email</label>
              <input type="email" value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nomor Telepon</label>
              <input type="text" value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleSaveProfile}
              disabled={!profileLoaded}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              Simpan Profil
            </button>
          </div>
        </div>
      </div>

      {/* Keamanan Akun */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-extrabold text-stone-900">Keamanan Akun</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Hubungkan Google */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold text-stone-900">Akun Google</p>
              <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                {profile.google_linked
                  ? "Akun Google Anda sudah terhubung."
                  : "Hubungkan akun Google untuk masuk lebih cepat."}
              </p>
            </div>
            {profile.google_linked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black">
                <Check className="w-3.5 h-3.5" />
                Terhubung
              </span>
            ) : (
              <a href="/api/auth/google"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-extrabold transition-all">
                Hubungkan Google
              </a>
            )}
          </div>

          <div className="border-t border-[#E7DED4]" />

          {/* Buat/Ubah Kata Sandi */}
          <div>
            <p className="text-xs font-extrabold text-stone-900">
              {profile.has_password ? "Ubah Kata Sandi" : "Buat Kata Sandi"}
            </p>
            <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
              {profile.has_password
                ? "Ganti kata sandi akun Anda."
                : "Anda belum memiliki kata sandi. Buat sekarang agar bisa masuk dengan email dan kata sandi."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none text-[10px] font-bold"
                  >
                    {showPassword ? "Sembunyi" : "Lihat"}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Konfirmasi Kata Sandi</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
                />
              </div>
            </div>

            {passwordError && (
              <p className="mt-2 text-[11px] font-bold text-red-600">{passwordError}</p>
            )}

            <div className="flex justify-end pt-3">
              <button onClick={handleSavePassword}
                disabled={savingPassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white transition-all rounded-lg shadow-sm text-xs font-extrabold disabled:opacity-50">
                {savingPassword ? <Spinner size={14} /> : <KeyRound className="w-3.5 h-3.5" />}
                {profile.has_password ? "Ubah Kata Sandi" : "Buat Kata Sandi"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Saya */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-extrabold text-stone-900">Kategori Saya</h2>
          </div>
          <button onClick={openCatModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-lg shadow-sm text-xs font-extrabold">
            <Plus className="w-3.5 h-3.5" />
            Tambah Kategori
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Tipe</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-stone-300">
                    <p className="font-bold text-sm">Belum ada kategori</p>
                    <p className="text-xs mt-1">Klik "Tambah Kategori" untuk membuat kategori Anda sendiri.</p>
                  </td>
                </tr>
              ) : categories.map((c) => {
                const Icon = getIcon(c.icon_name ?? 'circle');
                return (
                  <tr key={c.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                    <td className="px-5 py-3.5 font-bold text-stone-700">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-stone-500 shrink-0" />
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${c.type === "INCOME" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {c.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {c.is_default ? (
                        <span className="text-[10px] font-bold text-stone-300">Bawaan</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteCategoryClick(c.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Hapus</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCatModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Kategori Baru</h2>
              <button type="button" onClick={closeCatModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Kategori</label>
                <input type="text" value={catName} onChange={(e) => { setCatName(e.target.value); setCatError(""); }}
                  placeholder="Contoh: Transportasi, Gaji, Makanan..."
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Tipe</label>
                <Select value={catType} onValueChange={(val) => setCatType(val as "INCOME" | "EXPENSE")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih tipe..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
                    <SelectItem value="INCOME">Pemasukan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Ikon</label>
                <IconListGrid selected={catIconName} onSelect={(name) => setCatIconName(name)} />
              </div>
              {catError && <p className="text-xs text-red-500 font-bold">{catError}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeCatModal}
                  className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={savingCat}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60">
                  {savingCat ? <Spinner size={14} /> : <Plus className="w-3.5 h-3.5" />}
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={confirmCatOpen}
        title="Hapus Kategori"
        message="Hapus kategori ini? Transaksi dengan kategori ini akan kehilangan kategori."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setConfirmCatOpen(false)}
        variant="danger"
      />
    </div>
  );
}
