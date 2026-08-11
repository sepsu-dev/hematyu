import { pool } from "@/lib/db";

export type AccountType = "BANK" | "E_WALLET" | "CASH";

export interface AccountRow {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
    current_balance: number;
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

export async function deleteAccount(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await pool.query(
        `DELETE FROM accounts WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}