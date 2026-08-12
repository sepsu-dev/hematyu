-- ─── hemat.yu Database Schema ───────────────────────────────────
-- PostgreSQL — Single source of truth (merges previous migrations:
--   migrate-master.sql, migrate-soft-delete.sql, migrate-google-linked.ts, migrate-indexes.ts)
-- Idempotent-friendly: safe to re-run on a fresh database.

-- Drop tables if exist (bottom-up to respect FKs)
DROP TABLE IF EXISTS user_privileges CASCADE;
DROP TABLE IF EXISTS user_group_members CASCADE;
DROP TABLE IF EXISTS user_groups CASCADE;
DROP TABLE IF EXISTS menu_actions CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS master_account_types CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─── Enums ───────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE budget_period AS ENUM ('MONTHLY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- NOTE: account type is a lookup table (master_account_types), not an enum —
-- icons/colors live in the DB and are editable via Admin > Tipe Kantong.

-- ─── Users ───────────────────────────────────────────────────────
-- Role/permission TIDAK ada di tabel ini — satu-satunya sumber adalah
-- user_groups → user_group_members → user_privileges.
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  phone         VARCHAR(50),
  google_linked BOOLEAN NOT NULL DEFAULT FALSE,
  google_id     VARCHAR(255) UNIQUE,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- ─── Menus (dynamic sidebar — no hardcoded menu) ────────────────
CREATE TABLE menus (
  id         BIGSERIAL PRIMARY KEY,
  parent_id  BIGINT REFERENCES menus(id) ON DELETE CASCADE,
  label      VARCHAR(100) NOT NULL,
  path       VARCHAR(255),
  icon_name  VARCHAR(50) NOT NULL DEFAULT 'circle',
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE INDEX idx_menus_parent ON menus(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_menus_active ON menus(is_active) WHERE deleted_at IS NULL;

-- ─── Menu Actions (CRUD-level permission per menu) ──────────────
CREATE TABLE menu_actions (
  id         BIGSERIAL PRIMARY KEY,
  menu_id    BIGINT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  code       VARCHAR(50) NOT NULL,
  label      VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (menu_id, code)
);

CREATE INDEX idx_menu_actions_menu ON menu_actions(menu_id);

-- ─── User Groups (role = group — permission berbasis grup) ──────
CREATE TABLE user_groups (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── User Group Members ─────────────────────────────────────────
CREATE TABLE user_group_members (
  user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id BIGINT NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, group_id)
);

CREATE INDEX idx_user_group_members_group ON user_group_members(group_id);

-- ─── User Privileges (matrix group × menu + actions) ─────────────
CREATE TABLE user_privileges (
  id         BIGSERIAL PRIMARY KEY,
  group_id   BIGINT NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
  menu_id    BIGINT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  actions    TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, menu_id)
);

CREATE INDEX idx_user_privileges_menu ON user_privileges(menu_id);

-- ─── Master Data: Account Types ─────────────────────────────────
-- Global lookup referenced by accounts.type (FK), NOT an enum.
-- Soft-deleted rows are excluded from uniqueness so a code can be
-- re-created after deletion.
CREATE TABLE master_account_types (
  id         BIGSERIAL PRIMARY KEY,
  code       VARCHAR(50) NOT NULL UNIQUE,
  label      VARCHAR(100) NOT NULL,
  icon_name  VARCHAR(50) NOT NULL DEFAULT 'wallet',
  color      VARCHAR(50) NOT NULL DEFAULT 'stone',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE INDEX idx_master_account_types_deleted_at
  ON master_account_types(deleted_at) WHERE deleted_at IS NULL;

-- ─── Categories ──────────────────────────────────────────────────
-- Global (user_id NULL) = master categories shown to all users.
-- Partial unique index: a deleted category name can be re-created.
-- NULLS NOT DISTINCT: global master rows also can't duplicate each other.
CREATE TABLE categories (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  type       transaction_type NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  icon_name  VARCHAR(50) NOT NULL DEFAULT 'circle',
  color_hex  VARCHAR(20) NOT NULL DEFAULT '#71717a',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE UNIQUE INDEX uq_categories_user_name_type_active
  ON categories (user_id, name, type) NULLS NOT DISTINCT WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_user_type ON categories(user_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_global_type ON categories(user_id, type) WHERE user_id IS NULL AND deleted_at IS NULL;
CREATE INDEX idx_categories_deleted_at ON categories(deleted_at) WHERE deleted_at IS NULL;

-- ─── Accounts ────────────────────────────────────────────────────
CREATE TABLE accounts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  type       VARCHAR(50) NOT NULL DEFAULT 'CASH' REFERENCES master_account_types(code),
  balance    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE INDEX idx_accounts_user ON accounts(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_user_type ON accounts(user_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_deleted_at ON accounts(deleted_at) WHERE deleted_at IS NULL;

-- ─── Transactions ────────────────────────────────────────────────
CREATE TABLE transactions (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id),
  account_id  BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
  type        transaction_type NOT NULL,
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255) NOT NULL,
  note        TEXT,
  date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feed list: WHERE user_id = ? ORDER BY date DESC
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
-- Filter by type + sort by date (dashboard/report filters)
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, date DESC);
-- Budget spent: subquery per user/category/period
CREATE INDEX idx_transactions_user_cat_type_date ON transactions(user_id, category_id, type, date);
-- JOIN pada categories
CREATE INDEX idx_transactions_category ON transactions(category_id);
-- Aggregate saldo per akun
CREATE INDEX idx_transactions_account_type ON transactions(account_id, type);
CREATE INDEX idx_transactions_account ON transactions(account_id);

-- ─── Budgets ─────────────────────────────────────────────────────
CREATE TABLE budgets (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id),
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  period      budget_period NOT NULL DEFAULT 'MONTHLY',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ NULL DEFAULT NULL
);

-- Partial unique: soft-deleted budget doesn't block re-creating the same combo
CREATE UNIQUE INDEX uq_budgets_user_cat_period_active
  ON budgets(user_id, category_id, period) WHERE deleted_at IS NULL;
CREATE INDEX idx_budgets_user ON budgets(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_budgets_user_period ON budgets(user_id, period) WHERE deleted_at IS NULL;
CREATE INDEX idx_budgets_deleted_at ON budgets(deleted_at) WHERE deleted_at IS NULL;

-- ─── Goals ───────────────────────────────────────────────────────
CREATE TABLE goals (
  id             BIGSERIAL PRIMARY KEY,
  user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  target_amount  NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deadline       TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE INDEX idx_goals_user ON goals(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_deleted_at ON goals(deleted_at) WHERE deleted_at IS NULL;

-- ─── Trigger: auto-update updated_at ─────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_menus_updated_at BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_user_groups_updated_at BEFORE UPDATE ON user_groups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_master_account_types_updated_at BEFORE UPDATE ON master_account_types
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();