-- ─── hemat.yu Database Schema ───────────────────────────────────
-- PostgreSQL

-- Drop tables if exist (for re-runs)
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
  CREATE TYPE account_type AS ENUM ('BANK', 'E_WALLET', 'CASH');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE budget_period AS ENUM ('MONTHLY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Users ───────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  phone         VARCHAR(50),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Categories ──────────────────────────────────────────────────
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  type       transaction_type NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name, type)
);

CREATE INDEX idx_categories_user_type ON categories(user_id, type);

-- ─── Accounts ────────────────────────────────────────────────────
CREATE TABLE accounts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  type       account_type NOT NULL DEFAULT 'CASH',
  balance    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_user ON accounts(user_id);

-- ─── Transactions ────────────────────────────────────────────────
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  account_id  UUID REFERENCES accounts(id) ON DELETE SET NULL,
  type        transaction_type NOT NULL,
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255) NOT NULL,
  note        TEXT,
  date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);

-- ─── Budgets (Coming Soon) ───────────────────────────────────────
CREATE TABLE budgets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  period      budget_period NOT NULL DEFAULT 'MONTHLY',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category_id, period)
);

CREATE INDEX idx_budgets_user ON budgets(user_id);

-- ─── Goals (Coming Soon) ─────────────────────────────────────────
CREATE TABLE goals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  target_amount  NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deadline       TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);

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