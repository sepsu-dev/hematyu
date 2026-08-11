import { pool, DEMO_USER_ID } from "../db";

export type TxType = "INCOME" | "EXPENSE";

export interface TransactionRow {
    id: string;
    date: Date;
    description: string;
    category: string;
    category_id: string;
    amount: number;
    type: TxType;
    note: string | null;
}

const SELECT_FIELDS = `
  t.id, t.date, t.description, c.name AS category, t.category_id,
  t.amount::float AS amount, t.type, t.note
`;

export async function getTransactions(userId: string = DEMO_USER_ID): Promise<TransactionRow[]> {
    const { rows } = await pool.query(
        `SELECT ${SELECT_FIELDS}
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1
     ORDER BY t.date DESC`,
        [userId]
    );
    return rows;
}

export async function getTransactionById(id: string, userId: string = DEMO_USER_ID): Promise<TransactionRow | null> {
    const { rows } = await pool.query(
        `SELECT ${SELECT_FIELDS}
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.id = $1 AND t.user_id = $2`,
        [id, userId]
    );
    return rows[0] ?? null;
}

export async function createTransaction(data: {
    userId?: string;
    categoryId: string;
    type: TxType;
    amount: number;
    description: string;
    note?: string;
    date?: Date;
}): Promise<TransactionRow> {
    const { rows } = await pool.query(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, note, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, date, description, category_id, amount::float AS amount, type, note`,
        [
            data.userId ?? DEMO_USER_ID,
            data.categoryId,
            data.type,
            data.amount,
            data.description,
            data.note ?? null,
            data.date ?? new Date(),
        ]
    );
    return rows[0];
}

export async function deleteTransaction(id: string, userId: string = DEMO_USER_ID): Promise<boolean> {
    const { rowCount } = await pool.query(
        `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}

export async function getSummary(userId: string = DEMO_USER_ID) {
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

export async function getExpenseByCategory(userId: string = DEMO_USER_ID) {
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

export async function getMonthlySummary(userId: string = DEMO_USER_ID, months: number = 5) {
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