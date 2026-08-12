"use client";

import { useEffect, useState } from "react";
import { ListChecks, Plus, Trash2, X, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
    getMenuActionsAction,
    getRbacMenusAction,
    createMenuActionAction,
    deleteMenuActionAction,
} from "@/app/dashboard/actions";

interface MenuActionRow {
    id: string;
    menu_id: string;
    code: string;
    label: string;
    menu_label: string;
}

interface RbacMenuRow {
    id: string;
    parent_id: string | null;
    label: string;
    path: string | null;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
}

const EMPTY_FORM = { menu_id: "", code: "", label: "" };

export default function AdminMenuActionsPage() {
    const [actions, setActions] = useState<MenuActionRow[]>([]);
    const [menus, setMenus] = useState<RbacMenuRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const reload = async () => setActions(await getMenuActionsAction());

    useEffect(() => {
        Promise.all([getMenuActionsAction(), getRbacMenusAction()])
            .then(([a, m]) => {
                setActions(a);
                setMenus(m);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const openModal = () => {
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.menu_id || !form.code.trim() || !form.label.trim() || saving) return;
        setSaving(true);
        try {
            await createMenuActionAction(form);
            setShowModal(false);
            await reload();
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
            await deleteMenuActionAction(deleteId);
            await reload();
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };

    const leafMenus = menus.filter((m) => m.path !== null);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-muted-foreground" />
                        Menu Action
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola aksi CRUD (view, create, update, delete) yang tersedia per menu.</p>
                </div>
                <button
                    onClick={openModal}
                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah Aksi
                </button>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-extrabold text-foreground">Tambah Aksi Baru</h2>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Menu <span className="text-destructive">*</span></label>
                                <select
                                    autoFocus
                                    value={form.menu_id}
                                    onChange={(e) => setForm({ ...form, menu_id: e.target.value })}
                                    className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs font-bold"
                                >
                                    <option value="">Pilih menu...</option>
                                    {leafMenus.map((m) => (
                                        <option key={m.id} value={m.id}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Aksi <span className="text-destructive">*</span></label>
                                <select
                                    value={form.code}
                                    onChange={(e) => {
                                        const codeVal = e.target.value;
                                        let labelVal = "";
                                        if (codeVal === "view") labelVal = "Lihat";
                                        else if (codeVal === "create") labelVal = "Tambah";
                                        else if (codeVal === "update") labelVal = "Ubah";
                                        else if (codeVal === "delete") labelVal = "Hapus";
                                        setForm({ ...form, code: codeVal, label: labelVal });
                                    }}
                                    className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs font-bold"
                                >
                                    <option value="">Pilih aksi...</option>
                                    <option value="view">Lihat (view)</option>
                                    <option value="create">Tambah (create)</option>
                                    <option value="update">Ubah (update)</option>
                                    <option value="delete">Hapus (delete)</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={closeModal}
                                    className="px-4 py-2.5 rounded-lg border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                                    Batal
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60 cursor-pointer">
                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-muted/50 p-6 border border-border/60">
                {loading ? (
                    <p className="text-xs font-bold text-muted-foreground text-center py-12">Memuat aksi...</p>
                ) : (
                    <div className="space-y-2">
                        {(() => {
                            const uniqueActions = [];
                            const codesSeen = new Set();
                            // Urutkan agar urutan aksi konsisten: view, create, update, delete
                            const sortedActions = [...actions].sort((x, y) => {
                                const order = { view: 1, create: 2, update: 3, delete: 4 };
                                return (order[x.code as keyof typeof order] ?? 99) - (order[y.code as keyof typeof order] ?? 99);
                            });
                            for (const a of sortedActions) {
                                if (["view", "create", "update", "delete"].includes(a.code) && !codesSeen.has(a.code)) {
                                    codesSeen.add(a.code);
                                    uniqueActions.push(a);
                                }
                            }
                            return uniqueActions.map((a) => (
                                <div key={a.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-white p-4">
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-extrabold text-foreground">{a.label}</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Kode: <span className="text-primary font-bold">{a.code}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(a.id)}
                                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={confirmOpen}
                title="Hapus Aksi Menu"
                message="Apakah Anda yakin ingin menghapus aksi menu ini? Ini akan membatalkan hak akses terkait pada kelompok hak akses."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
}