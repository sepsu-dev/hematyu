import { pool } from "@/lib/db";

// ─── Users ──────────────────────────────────────────────────────
export interface AdminUserRow {
    id: string;
    name: string;
    email: string;
    created_at: string;
    group_ids: string[];
}

export async function getRbacUsers(): Promise<AdminUserRow[]> {
    const { rows } = await pool.query(
        `SELECT u.id, u.name, u.email, u.created_at,
                COALESCE(ARRAY[u.group_id] FILTER (WHERE u.group_id IS NOT NULL), '{}') AS group_ids
         FROM users u
         ORDER BY u.created_at ASC`
    );
    return rows;
}

// ─── Superadmin check ──
export async function isSuperadmin(userId: string): Promise<boolean> {
    const { rows } = await pool.query(
        `SELECT 1
         FROM users u
         JOIN user_groups g ON g.id = u.group_id
         WHERE u.id = $1 AND g.name = 'Superadmin'`,
        [userId]
    );
    return rows.length > 0;
}

export async function setUserGroups(userId: string, groupIds: string[]) {
    const gid = groupIds[0] ? groupIds[0] : null;
    await pool.query(
        `UPDATE users SET group_id = $2 WHERE id = $1`,
        [userId, gid]
    );
}

// ─── User Groups ─────────────────────────────────────────────────
export interface UserGroupRow {
    id: string;
    name: string;
    description: string | null;
    is_system: boolean;
    member_count: number;
}

export async function getGroups(): Promise<UserGroupRow[]> {
    const { rows } = await pool.query(
        `SELECT g.id, g.name, g.description, g.is_system,
                COUNT(u.id)::int AS member_count
         FROM user_groups g
         LEFT JOIN users u ON u.group_id = g.id
         GROUP BY g.id
         ORDER BY g.is_system DESC, g.name ASC`
    );
    return rows;
}

export async function createGroup(data: { name: string; description?: string }) {
    await pool.query(
        `INSERT INTO user_groups (name, description) VALUES ($1, $2)`,
        [data.name.trim(), data.description?.trim() || null]
    );
}

export async function updateGroup(id: string, data: { name: string; description?: string }) {
    const { rowCount } = await pool.query(
        `UPDATE user_groups SET name = $2, description = $3 WHERE id = $1 AND is_system = FALSE`,
        [id, data.name.trim(), data.description?.trim() || null]
    );
    if ((rowCount ?? 0) === 0) throw new Error("Grup system tidak dapat diubah");
}

export async function deleteGroup(id: string) {
    const { rowCount } = await pool.query(
        `DELETE FROM user_groups WHERE id = $1 AND is_system = FALSE`,
        [id]
    );
    if ((rowCount ?? 0) === 0) throw new Error("Grup system tidak dapat dihapus");
}

// ─── User Privileges ─────────────────────────────────────────────
export interface PrivilegeRow {
    group_id: string;
    menu_id: string;
    actions: string[];
    menu_label: string;
    menu_path: string | null;
}

export async function getPrivileges(groupId?: string): Promise<PrivilegeRow[]> {
    const params: unknown[] = [];
    let where = "";
    if (groupId) {
        params.push(groupId);
        where = "WHERE p.group_id = $1";
    }
    const { rows } = await pool.query(
        `SELECT p.group_id, p.menu_id, p.actions,
                m.label AS menu_label, m.path AS menu_path
         FROM user_privileges p
         JOIN menus m ON m.id = p.menu_id
         ${where}
         ORDER BY m.sort_order ASC`,
        params
    );
    return rows;
}

export async function setPrivilege(groupId: string, menuId: string, actions: string[]) {
    await pool.query(
        `INSERT INTO user_privileges (group_id, menu_id, actions)
         VALUES ($1, $2, $3)
         ON CONFLICT (group_id, menu_id)
         DO UPDATE SET actions = EXCLUDED.actions`,
        [groupId, menuId, actions]
    );
}

// ─── Menus ───────────────────────────────────────────────────────
export interface RbacMenuRow {
    id: string;
    parent_id: string | null;
    label: string;
    path: string | null;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
}

export async function getRbacMenus(): Promise<RbacMenuRow[]> {
    const { rows } = await pool.query(
        `SELECT id, parent_id, label, path, icon_name, sort_order, is_active
         FROM menus
         WHERE deleted_at IS NULL
         ORDER BY sort_order ASC, label ASC`
    );
    return rows;
}

export async function createMenu(data: {
    label: string;
    parent_id?: string | null;
    path?: string | null;
    icon_name?: string;
    sort_order?: number;
    is_active?: boolean;
}) {
    const { rows } = await pool.query(
        `INSERT INTO menus (label, parent_id, path, icon_name, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
            data.label.trim(),
            data.parent_id ?? null,
            data.path?.trim() || null,
            data.icon_name ?? "circle",
            data.sort_order ?? 0,
            data.is_active ?? true,
        ]
    );
    // Auto-create default actions untuk menu leaf baru
    const path = data.path?.trim();
    if (path) {
        await pool.query(
            `INSERT INTO menu_actions (menu_id, code, label)
             SELECT $1, a.code, a.label
             FROM (VALUES ('create','Tambah'),('update','Ubah'),('delete','Hapus'),('view','Lihat')) a(code,label)`,
            [rows[0].id]
        );
    }
    return rows[0].id;
}

export async function updateMenu(id: string, data: {
    label: string;
    parent_id?: string | null;
    path?: string | null;
    icon_name?: string;
    sort_order?: number;
    is_active?: boolean;
}) {
    await pool.query(
        `UPDATE menus
         SET label = $2, parent_id = $3, path = $4, icon_name = $5, sort_order = $6, is_active = $7, updated_at = NOW()
         WHERE id = $1`,
        [
            id,
            data.label.trim(),
            data.parent_id ?? null,
            data.path?.trim() || null,
            data.icon_name ?? "circle",
            data.sort_order ?? 0,
            data.is_active ?? true,
        ]
    );
}

export async function deleteMenu(id: string) {
    await pool.query(
        `UPDATE menus SET deleted_at = NOW() WHERE id = $1`,
        [id]
    );
}

// ─── Menu Actions ────────────────────────────────────────────────
export interface MenuActionRow {
    id: string;
    menu_id: string;
    code: string;
    label: string;
    menu_label: string;
}

export async function getMenuActions(): Promise<MenuActionRow[]> {
    const { rows } = await pool.query(
        `SELECT ma.id, ma.menu_id, ma.code, ma.label, m.label AS menu_label
         FROM menu_actions ma
         JOIN menus m ON m.id = ma.menu_id
         ORDER BY m.sort_order ASC, ma.code ASC`
    );
    return rows;
}

export async function createMenuAction(menuId: string, code: string, label: string) {
    await pool.query(
        `INSERT INTO menu_actions (menu_id, code, label) VALUES ($1, $2, $3)`,
        [menuId, code.toLowerCase().trim(), label.trim()]
    );
}

export async function deleteMenuAction(id: string) {
    await pool.query(`DELETE FROM menu_actions WHERE id = $1`, [id]);
}