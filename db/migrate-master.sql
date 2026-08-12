-- ─── Migration: Master Data + Role ──────────────────────────────────────────
-- Run this once against your existing database.

-- 1. Add role column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

-- 2. Create master_account_types table
CREATE TABLE IF NOT EXISTS master_account_types (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(50) NOT NULL UNIQUE,
  label      VARCHAR(100) NOT NULL,
  icon_name  VARCHAR(50) NOT NULL DEFAULT 'wallet',
  color      VARCHAR(50) NOT NULL DEFAULT 'stone',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_account_types_deleted_at
  ON master_account_types(deleted_at) WHERE deleted_at IS NULL;

-- 3. Seed default account types (idempotent)
INSERT INTO master_account_types (code, label, icon_name, color) VALUES
  ('BANK',     'Bank',     'landmark',   'primary'),
  ('E_WALLET', 'E-Wallet', 'smartphone', 'emerald'),
  ('CASH',     'Tunai',    'wallet',     'orange')
ON CONFLICT (code) DO NOTHING;

-- NOTE: Manually run this after migration to set superadmin:
-- UPDATE users SET role = 'superadmin' WHERE email = 'your@email.com';
