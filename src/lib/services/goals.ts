import { pool } from "@/lib/db";

export interface GoalRow {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: Date | null;
    pct: number;
    remaining: number;
}

export async function getGoals(userId: string): Promise<GoalRow[]> {
    const { rows } = await pool.query(
        `SELECT id, name, target_amount::float AS target_amount,
                current_amount::float AS current_amount, deadline
         FROM goals
         WHERE user_id = $1
           AND deleted_at IS NULL
         ORDER BY
           CASE WHEN current_amount >= target_amount THEN 1 ELSE 0 END ASC,
           target_amount - current_amount ASC`,
        [userId]
    );
    return rows.map((r) => ({
        ...r,
        pct: r.target_amount > 0 ? (r.current_amount / r.target_amount) * 100 : 0,
        remaining: Math.max(0, r.target_amount - r.current_amount),
    }));
}

export async function createGoal(data: {
    userId: string;
    name: string;
    targetAmount: number;
    deadline?: Date;
}): Promise<GoalRow> {
    const { rows } = await pool.query(
        `INSERT INTO goals (user_id, name, target_amount, current_amount, deadline)
         VALUES ($1, $2, $3, 0, $4)
         RETURNING id, name, target_amount::float AS target_amount,
                   current_amount::float AS current_amount, deadline`,
        [data.userId, data.name.trim(), data.targetAmount, data.deadline ?? null]
    );
    const g = rows[0];
    return { ...g, pct: 0, remaining: g.target_amount };
}

export async function updateGoalAmount(id: string, userId: string, amount: number): Promise<boolean> {
    const { rowCount } = await pool.query(
        `UPDATE goals
         SET current_amount = current_amount + $3
         WHERE id = $1 AND user_id = $2
           AND deleted_at IS NULL
           AND current_amount + $3 >= 0`,
        [id, userId, amount]
    );
    return (rowCount ?? 0) > 0;
}

export async function deleteGoal(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await pool.query(
        `UPDATE goals
         SET deleted_at = NOW()
         WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}