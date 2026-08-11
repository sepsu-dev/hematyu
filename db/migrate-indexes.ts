import "dotenv/config";
import { pool } from "../src/lib/db";

async function migrate() {
    console.log("🔧 Menambahkan index baru...");

    const indexes = [
        {
            name: "idx_transactions_user_type_date",
            sql: `CREATE INDEX IF NOT EXISTS idx_transactions_user_type_date
                  ON transactions(user_id, type, date DESC)`,
        },
        {
            name: "idx_transactions_user_cat_type_date",
            sql: `CREATE INDEX IF NOT EXISTS idx_transactions_user_cat_type_date
                  ON transactions(user_id, category_id, type, date)`,
        },
        {
            name: "idx_transactions_account_type",
            sql: `CREATE INDEX IF NOT EXISTS idx_transactions_account_type
                  ON transactions(account_id, type)`,
        },
        {
            name: "idx_budgets_user_period",
            sql: `CREATE INDEX IF NOT EXISTS idx_budgets_user_period
                  ON budgets(user_id, period)`,
        },
    ];

    for (const idx of indexes) {
        try {
            await pool.query(idx.sql);
            console.log(`✅ Index ${idx.name} berhasil dibuat`);
        } catch (err) {
            console.error(`❌ Gagal membuat index ${idx.name}:`, err);
        }
    }

    await pool.end();
    console.log("🎉 Migrasi index selesai!");
}

migrate().catch((err) => {
    console.error("❌ Migrasi gagal:", err);
    process.exit(1);
});