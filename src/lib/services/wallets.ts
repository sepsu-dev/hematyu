import { pool } from "@/lib/db";
import { getMasterWalletTypes, type MasterWalletTypeRow } from "./master";

export type WalletType = string;
export type { MasterWalletTypeRow as WalletTypeRow };

export interface WalletRow {
    id: string;
    name: string;
    type: WalletType;
    wallet_type_id: string;
    balance: number;
    current_balance: number;
}

/** Fetch all active wallet types from master table (for dropdowns) */
export async function getWalletTypes(): Promise<MasterWalletTypeRow[]> {
    return getMasterWalletTypes();
}

export async function getWallets(userId: string): Promise<WalletRow[]> {
    const { rows } = await pool.query(
        `SELECT
           w.id, w.name, wt.code AS type, w.wallet_type_id, w.balance::float AS balance,
           (w.balance
             + COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0)
             - COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0)
           )::float AS current_balance
         FROM wallets w
         JOIN wallet_types wt ON wt.id = w.wallet_type_id
         LEFT JOIN transactions t ON t.wallet_id = w.id
         WHERE w.user_id = $1
           AND w.deleted_at IS NULL
         GROUP BY w.id, w.name, wt.code, w.wallet_type_id, w.balance
         ORDER BY w.created_at ASC`,
        [userId]
    );
    return rows;
}

export async function createWallet(data: {
    userId: string;
    name: string;
    walletTypeId: string;
    balance?: number;
}): Promise<WalletRow> {
    const { rows } = await pool.query(
        `INSERT INTO wallets (user_id, name, wallet_type_id, balance)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, wallet_type_id, balance::float AS balance, balance::float AS current_balance`,
         [data.userId, data.name.trim(), data.walletTypeId, data.balance ?? 0]
    );
    const walletTypes = await getWalletTypes();
    const matched = walletTypes.find(t => String(t.id) === String(rows[0].wallet_type_id));
    return {
        ...rows[0],
        type: matched ? matched.code : ''
    };
}

/** Insert a user's default "Utama" wallet if they don't have any active wallet yet. */
export async function ensureDefaultWallet(userId: string, client?: { query: typeof pool.query }): Promise<void> {
    const db = client ?? pool;
    await db.query(
        `INSERT INTO wallets (user_id, name, wallet_type_id, balance)
         SELECT $1, 'Utama', id, 0
         FROM wallet_types
         WHERE code = 'CASH'
           AND NOT EXISTS (
               SELECT 1 FROM wallets
               WHERE user_id = $1 AND deleted_at IS NULL
           )`,
        [userId]
    );
}

export async function deleteWallet(id: string, userId: string): Promise<boolean> {
    // Guard: every user must keep at least one active wallet
    const active = await pool.query(
        `SELECT COUNT(*)::int AS count
         FROM wallets
         WHERE user_id = $1 AND deleted_at IS NULL`,
        [userId]
    );
    if ((active.rows[0]?.count ?? 0) <= 1) {
        throw new Error("Tidak bisa menghapus kantong terakhir. Minimal harus ada 1 kantong.");
    }
    const { rowCount } = await pool.query(
        `UPDATE wallets
         SET deleted_at = NOW()
         WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}
