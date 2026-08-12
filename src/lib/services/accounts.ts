import { pool } from "@/lib/db";
import { getMasterAccountTypes, type MasterAccountTypeRow } from "./master";

export type AccountType = string; // dynamic from master_account_types
export type { MasterAccountTypeRow as AccountTypeRow };

export interface AccountRow {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
    current_balance: number;
}

/** Fetch all active account types from master table (for dropdowns) */
export async function getAccountTypes(): Promise<MasterAccountTypeRow[]> {
    return getMasterAccountTypes();
}

export async function getAccounts(userId: string): Promise<AccountRow[]> {
    const { rows } = await pool.query(
        `SELECT
           a.id, a.name, a.type, a.balance::float AS balance,
           (a.balance
             + COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0)
             - COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0)
           )::float AS current_balance
         FROM accounts a
         LEFT JOIN transactions t ON t.account_id = a.id
         WHERE a.user_id = $1
           AND a.deleted_at IS NULL
         GROUP BY a.id, a.name, a.type, a.balance
         ORDER BY a.created_at ASC`,
        [userId]
    );
    return rows;
}

export async function createAccount(data: {
    userId: string;
    name: string;
    type: AccountType;
    balance?: number;
}): Promise<AccountRow> {
    const { rows } = await pool.query(
        `INSERT INTO accounts (user_id, name, type, balance)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, type, balance::float AS balance, balance::float AS current_balance`,
        [data.userId, data.name.trim(), data.type, data.balance ?? 0]
    );
    return rows[0];
}

/** Insert a user's default "Utama" pocket if they don't have any active pocket yet. */
export async function ensureDefaultAccount(userId: string, client?: { query: typeof pool.query }): Promise<void> {
    const db = client ?? pool;
    await db.query(
        `INSERT INTO accounts (user_id, name, type, balance)
         SELECT $1, 'Utama', 'CASH', 0
         WHERE NOT EXISTS (
             SELECT 1 FROM accounts
             WHERE user_id = $1 AND deleted_at IS NULL
         )`,
        [userId]
    );
}

export async function deleteAccount(id: string, userId: string): Promise<boolean> {
    // Guard: every user must keep at least one active pocket
    const active = await pool.query(
        `SELECT COUNT(*)::int AS count
         FROM accounts
         WHERE user_id = $1 AND deleted_at IS NULL`,
        [userId]
    );
    if ((active.rows[0]?.count ?? 0) <= 1) {
        throw new Error("Tidak bisa menghapus kantong terakhir. Minimal harus ada 1 kantong.");
    }
    const { rowCount } = await pool.query(
        `UPDATE accounts
         SET deleted_at = NOW()
         WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}