-- ─── Migration: Add soft delete (deleted_at) to master tables ────────────────
-- Run this once against your existing database.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL DEFAULT NULL;
ALTER TABLE accounts   ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL DEFAULT NULL;
ALTER TABLE budgets    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL DEFAULT NULL;
ALTER TABLE goals      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL DEFAULT NULL;

-- Optional: indexes to speed up "WHERE deleted_at IS NULL" filters
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON categories(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_accounts_deleted_at   ON accounts(deleted_at)   WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_budgets_deleted_at    ON budgets(deleted_at)    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_goals_deleted_at      ON goals(deleted_at)      WHERE deleted_at IS NULL;
