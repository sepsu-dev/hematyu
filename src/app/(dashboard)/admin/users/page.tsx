"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Pencil, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
    getRbacUsersAction,
    getGroupsAction,
    setUserGroupsAction,
} from "@/app/dashboard/actions";
import { toast } from "sonner";

interface AdminUserRow {
    id: string;
    name: string;
    email: string;
    created_at: string;
    group_ids: string[];
}

interface UserGroupRow {
    id: string;
    name: string;
    description: string | null;
    is_system: boolean;
    member_count: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [groups, setGroups] = useState<UserGroupRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
    const [saving, setSaving] = useState(false);
    const [groupIds, setGroupIds] = useState<string[]>([]);

    useEffect(() => {
        Promise.all([getRbacUsersAction(), getGroupsAction()])
            .then(([u, g]) => {
                setUsers(u);
                setGroups(g);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const reloadUsers = async () => setUsers(await getRbacUsersAction());

    const openEditModal = (u: AdminUserRow) => {
        setEditingUser(u);
        setGroupIds([...u.group_ids]);
    };

    const closeModal = () => {
        if (saving) return;
        setEditingUser(null);
    };

    const toggleGroup = (groupId: string) => {
        setGroupIds((prev) =>
            prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || saving) return;
        setSaving(true);
        try {
            await setUserGroupsAction(editingUser.id, groupIds);
            toast.success("Grup user berhasil diperbarui!");
            setEditingUser(null);
            await reloadUsers();
        } catch (err: any) {
            toast.error(err?.message || "Gagal memperbarui grup user.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    User
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">Kelola akun pengguna & keanggotaan grup.</p>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-foreground">Ubah Akses User</h2>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{editingUser.name} · {editingUser.email}</p>
                            </div>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Grup</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {groups.map((g) => {
                                        const checked = groupIds.includes(g.id);
                                        return (
                                            <button
                                                type="button"
                                                key={g.id}
                                                onClick={() => toggleGroup(g.id)}
                                                className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${checked
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-white text-muted-foreground border-border hover:bg-muted"
                                                    }`}
                                            >
                                                {g.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={closeModal}
                                    className="px-4 py-2.5 rounded-lg border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                                    Batal
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60 cursor-pointer">
                                    {saving ? <Spinner size={14} /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                    Simpan Akses
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-muted/50 p-6 border border-border/60">
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-xs font-bold text-muted-foreground text-center py-12">Memuat daftar user...</p>
                    ) : (
                        users.map((u) => (
                            <div key={u.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-white p-4">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-extrabold text-foreground">{u.name}</p>
                                    <p className="text-[11px] text-muted-foreground">{u.email}</p>
                                    {u.group_ids.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {u.group_ids.map((gid) => {
                                                const g = groups.find((x) => x.id === gid);
                                                return g ? (
                                                    <span key={gid} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[9px] font-bold">
                                                        {g.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => openEditModal(u)}
                                    className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                                    title="Ubah Akses"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}