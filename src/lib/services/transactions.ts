import { pool } from "@/lib/db";

export type TxType = "INCOME" | "EXPENSE";

export interface TransactionRow {
    id: string;
    date: Date;
    description: string;
    category: string;
    category_id: string;
    account_id: string | null;
    account: string | null;
    amount: number;
    type: TxType;
    note: string | null;
}

const SELECT_FIELDS = `
  t.id, t.date, t.description, c.name AS category, t.category_id,
  t.account_id, a.name AS account,
  t.amount::float AS amount, t.type, t.note
`;

export async function getTransactions(userId: string): Promise<TransactionRow[]> {
    const { rows } = await pool.query(
        `SELECT ${SELECT_FIELDS}
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     LEFT JOIN accounts a ON a.id = t.account_id
     WHERE t.user_id = $1
     ORDER BY t.date DESC`,
        [userId]
    );
    return rows;
}

export async function createTransaction(data: {
    userId: string;
    categoryId: string;
    type: TxType;
    amount: number;
    description: string;
    note?: string;
    date?: Date;
    accountId?: string;
}): Promise<TransactionRow> {
    const { rows } = await pool.query(
        `INSERT INTO transactions (user_id, category_id, account_id, type, amount, description, note, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, date, description, category_id, account_id,
               amount::float AS amount, type, note`,
        [
            data.userId,
            data.categoryId,
            data.accountId ?? null,
            data.type,
            data.amount,
            data.description,
            data.note ?? null,
            data.date ?? new Date(),
        ]
    );
    return rows[0];
}

export async function deleteTransaction(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await pool.query(
        `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}

export async function getSummary(userId: string) {
    const { rows } = await pool.query(
        `SELECT
       COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0)::float AS total_income,
       COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)::float AS total_expense,
       COUNT(*)::int AS total_count
     FROM transactions
     WHERE user_id = $1`,
        [userId]
    );
    const r = rows[0];
    return {
        totalIncome: r.total_income,
        totalExpense: r.total_expense,
        balance: r.total_income - r.total_expense,
        totalCount: r.total_count,
    };
}

export async function getExpenseByCategory(userId: string) {
    const { rows } = await pool.query(
        `SELECT c.name AS category, SUM(t.amount)::float AS total
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1 AND t.type = 'EXPENSE'
     GROUP BY c.name
     ORDER BY total DESC`,
        [userId]
    );
    return rows;
}

export async function getMonthlySummary(userId: string, months: number = 5) {
    const { rows } = await pool.query(
        `SELECT
       TO_CHAR(date_trunc('month', date), 'Mon') AS month,
       date_trunc('month', date) AS month_start,
       COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0)::float AS income,
       COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)::float AS expense
     FROM transactions
     WHERE user_id = $1
       AND date >= date_trunc('month', NOW()) - ($2::int - 1) * INTERVAL '1 month'
     GROUP BY date_trunc('month', date)
     ORDER BY month_start ASC`,
        [userId, months]
    );
    return rows;
}

export async function getRecentTransactions(userId: string, limit = 5): Promise<TransactionRow[]> {
    const { rows } = await pool.query(
        `SELECT ${SELECT_FIELDS}
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     LEFT JOIN accounts a ON a.id = t.account_id
     WHERE t.user_id = $1
     ORDER BY t.date DESC
     LIMIT $2`,
        [userId, limit]
    );
    return rows;
}

export async function getWeeklySummary(userId: string, weeks: number = 7) {
    const { rows } = await pool.query(
        `SELECT
           TO_CHAR(date_trunc('week', date), 'DD Mon') AS week_label,
           date_trunc('week', date) AS week_start,
           COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0)::float AS income,
           COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)::float AS expense
         FROM transactions
         WHERE user_id = $1
           AND date >= date_trunc('week', NOW()) - ($2::int - 1) * INTERVAL '1 week'
         GROUP BY date_trunc('week', date)
         ORDER BY week_start ASC`,
        [userId, weeks]
    );
    return rows;
}
