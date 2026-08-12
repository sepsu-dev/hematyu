import { pool } from "@/lib/db";

export interface BudgetRow {
    id: string;
    category_id: string;
    category: string;
    amount: number;
    spent: number;
    remaining: number;
    pct: number;
}

export async function getBudgets(userId: string): Promise<BudgetRow[]> {
    const { rows } = await pool.query(
        `SELECT
           b.id, b.category_id, c.name AS category, b.amount::float AS amount,
           COALESCE((
             SELECT SUM(t.amount) FROM transactions t
             WHERE t.user_id = b.user_id
               AND t.category_id = b.category_id
               AND t.type = 'EXPENSE'
               AND t.date >= date_trunc('month', NOW())
               AND t.date < date_trunc('month', NOW()) + INTERVAL '1 month'
           ), 0)::float AS spent
         FROM budgets b
         JOIN categories c ON c.id = b.category_id
         WHERE b.user_id = $1
           AND b.period = 'MONTHLY'
           AND b.deleted_at IS NULL
         ORDER BY c.name ASC`,
        [userId]
    );
    return rows.map((r) => ({
        ...r,
        remaining: r.amount - r.spent,
        pct: r.amount > 0 ? (r.spent / r.amount) * 100 : 0,
    }));
}

export async function createBudget(data: {
    userId: string;
    categoryId: string;
    amount: number;
    period?: "MONTHLY";
}): Promise<BudgetRow> {
    const { rows } = await pool.query(
        `INSERT INTO budgets (user_id, category_id, amount, period)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, category_id, period)
         DO UPDATE SET amount = EXCLUDED.amount, deleted_at = NULL
         RETURNING id, category_id, amount::float AS amount`,
        [data.userId, data.categoryId, data.amount, data.period ?? "MONTHLY"]
    );
    const b = rows[0];
    return getBudgets(data.userId).then((list) => list.find((x) => x.id === b.id)!);
}

export async function deleteBudget(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await pool.query(
        `UPDATE budgets
         SET deleted_at = NOW()
         WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}