import { pool } from "@/lib/db";

export interface AdminStats {
    totalUsers: number;
    activeUsers: number; // has transaction in last 30 days
    totalTransactions: number;
    thisMonthTransactions: number;
    totalVolume: number;
    thisMonthVolume: number;
}

export interface AdminUserRow {
    id: string;
    name: string;
    email: string;
    group_names: string[];
    created_at: string;
    total_transactions: number;
    total_income: number;
    total_expense: number;
    last_transaction: string | null;
}

export async function getAdminStats(): Promise<AdminStats> {
    const { rows } = await pool.query(`
        SELECT
          (SELECT COUNT(*)::int FROM users)                                                AS total_users,
          (SELECT COUNT(DISTINCT user_id)::int FROM transactions
           WHERE date >= NOW() - INTERVAL '30 days')                                       AS active_users,
          (SELECT COUNT(*)::int FROM transactions)                                         AS total_transactions,
          (SELECT COUNT(*)::int FROM transactions
           WHERE date >= date_trunc('month', NOW()))                                       AS this_month_transactions,
          (SELECT COALESCE(SUM(amount), 0)::float FROM transactions)                       AS total_volume,
          (SELECT COALESCE(SUM(amount), 0)::float FROM transactions
           WHERE date >= date_trunc('month', NOW()))                                       AS this_month_volume
    `);
    const r = rows[0];
    return {
        totalUsers: r.total_users,
        activeUsers: r.active_users,
        totalTransactions: r.total_transactions,
        thisMonthTransactions: r.this_month_transactions,
        totalVolume: r.total_volume,
        thisMonthVolume: r.this_month_volume,
    };
}

export async function getAdminUserList(): Promise<AdminUserRow[]> {
    const { rows } = await pool.query(`
        SELECT
          u.id, u.name, u.email,
          COALESCE(
            ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL),
            '{}'
          )::text[]                                                                  AS group_names,
          u.created_at,
          COUNT(DISTINCT t.id)::int                                                  AS total_transactions,
          COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0)::float AS total_income,
          COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0)::float AS total_expense,
          MAX(t.date)                                                                AS last_transaction
        FROM users u
        LEFT JOIN user_group_members ugm ON ugm.user_id = u.id
        LEFT JOIN user_groups g ON g.id = ugm.group_id
        LEFT JOIN transactions t ON t.user_id = u.id
        GROUP BY u.id, u.name, u.email, u.created_at
        ORDER BY u.created_at ASC
    `);
    return rows;
}
