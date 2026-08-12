import { pool } from "@/lib/db";

// ─── Master Categories ────────────────────────────────────────────────────────

export interface MasterCategoryRow {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    created_at: string;
}

export async function getMasterCategories(): Promise<MasterCategoryRow[]> {
    const { rows } = await pool.query(
        `SELECT id, name, type, created_at
         FROM categories
         WHERE user_id IS NULL
           AND deleted_at IS NULL
         ORDER BY type, name ASC`
    );
    return rows;
}

export async function createMasterCategory(data: {
    name: string;
    type: "INCOME" | "EXPENSE";
}): Promise<MasterCategoryRow> {
    const { rows } = await pool.query(
        `INSERT INTO categories (user_id, name, type, is_default)
         VALUES (NULL, $1, $2, TRUE)
         RETURNING id, name, type, created_at`,
        [data.name.trim(), data.type]
    );
    return rows[0];
}

export async function deleteMasterCategory(id: string): Promise<boolean> {
    const { rowCount } = await pool.query(
        `UPDATE categories
         SET deleted_at = NOW()
         WHERE id = $1 AND user_id IS NULL AND deleted_at IS NULL`,
        [id]
    );
    return (rowCount ?? 0) > 0;
}

// ─── Master Account Types ─────────────────────────────────────────────────────

export interface MasterAccountTypeRow {
    id: string;
    code: string;
    label: string;
    icon_name: string;
    color: string;
    created_at: string;
}

export async function getMasterAccountTypes(): Promise<MasterAccountTypeRow[]> {
    const { rows } = await pool.query(
        `SELECT id, code, label, icon_name, color, created_at
         FROM master_account_types
         WHERE deleted_at IS NULL
         ORDER BY created_at ASC`
    );
    return rows;
}

export async function createMasterAccountType(data: {
    code: string;
    label: string;
    icon_name?: string;
    color?: string;
}): Promise<MasterAccountTypeRow> {
    const { rows } = await pool.query(
        `INSERT INTO master_account_types (code, label, icon_name, color)
         VALUES ($1, $2, $3, $4)
         RETURNING id, code, label, icon_name, color, created_at`,
        [
            data.code.toUpperCase().replace(/\s+/g, "_"),
            data.label.trim(),
            data.icon_name ?? "wallet",
            data.color ?? "stone",
        ]
    );
    return rows[0];
}

export async function deleteMasterAccountType(id: string): Promise<boolean> {
    const { rowCount } = await pool.query(
        `UPDATE master_account_types
         SET deleted_at = NOW()
         WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    );
    return (rowCount ?? 0) > 0;
}
