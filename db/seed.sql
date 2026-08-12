-- ─── hemat.yu Seed Data ─────────────────────────────────────────
-- PostgreSQL

-- ─── Master Account Types ───────────────────────────────────────
INSERT INTO master_account_types (code, label, icon_name, color) VALUES
  ('BANK',     'Bank',     'landmark',   'primary'),
  ('E_WALLET', 'E-Wallet', 'smartphone', 'emerald'),
  ('CASH',     'Tunai',    'wallet',     'orange')
ON CONFLICT DO NOTHING;

-- ─── Menus (dynamic sidebar — sumber kebenaran navigasi) ─────────
-- Parent (path NULL) = submenu; leaf = halaman.
-- id auto-increment; parent/child disambung via label.
INSERT INTO menus (parent_id, label, path, icon_name, sort_order) VALUES
  (NULL, 'Dashboard',       '/dashboard',    'layout-dashboard', 1),
  (NULL, 'Transaksi',       '/transactions', 'arrow-left-right', 2),
  (NULL, 'Rekening',        '/wallets',      'wallet',           3),
  (NULL, 'Anggaran',        '/budgets',      'piggy-bank',       4),
  (NULL, 'Tujuan',          '/goals',        'target',           5),
  (NULL, 'Laporan',         '/reports',      'bar-chart-3',      6),
  (NULL, 'User Management', NULL,            'shield-check',     7),
  (NULL, 'Master Data',     NULL,            'database',         8);

INSERT INTO menus (parent_id, label, path, icon_name, sort_order)
SELECT m_parent.id, child.label, child.path, child.icon_name, child.sort_order
FROM (
  VALUES
    ('User Management', 'User',           '/admin/users',           'users', 1),
    ('User Management', 'User Group',     '/admin/user-groups',     'user-cog', 2),
    ('User Management', 'User Privileges','/admin/user-privileges', 'key-round', 3),
    ('User Management', 'Menu',           '/admin/menus',           'menu', 4),
    ('User Management', 'Menu Action',    '/admin/menu-actions',    'list-checks', 5),
    ('Master Data',     'Kategori',       '/master/categories',     'folder-tree', 1),
    ('Master Data',     'Jenis Rekening', '/master/account-types',  'landmark', 2),
    ('Master Data',     'Laporan Admin',  '/master/laporan',        'file-bar-chart', 3)
) AS child(parent_label, label, path, icon_name, sort_order)
JOIN menus m_parent ON m_parent.label = child.parent_label AND m_parent.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- ─── Menu Actions (CRUD per menu leaf) ───────────────────────────
INSERT INTO menu_actions (menu_id, code, label)
SELECT m.id, a.code, a.label
FROM menus m
CROSS JOIN (
  VALUES
    ('create', 'Tambah'),
    ('update', 'Ubah'),
    ('delete', 'Hapus'),
    ('view',   'Lihat')
) AS a(code, label)
WHERE m.path IS NOT NULL
ON CONFLICT DO NOTHING;

-- ─── User Groups ─────────────────────────────────────────────────
INSERT INTO user_groups (name, description, is_system) VALUES
  ('Superadmin', 'Akses penuh ke semua menu & aksi', TRUE),
  ('User',       'Akses fitur keuangan standar',    TRUE)
ON CONFLICT DO NOTHING;

-- ─── User Privileges ─────────────────────────────────────────────
-- Superadmin: semua menu, semua aksi
INSERT INTO user_privileges (group_id, menu_id, actions)
SELECT g.id, m.id,
       CASE WHEN m.path IS NOT NULL
            THEN ARRAY['create','update','delete','view']
            ELSE '{}'::text[] END
FROM user_groups g, menus m
WHERE g.name = 'Superadmin'
ON CONFLICT DO NOTHING;

-- User: hanya fitur keuangan (bukan User Management / Master Data)
INSERT INTO user_privileges (group_id, menu_id, actions)
SELECT g.id, m.id, ARRAY['create','update','delete','view']
FROM user_groups g, menus m
WHERE g.name = 'User'
  AND m.parent_id IS NULL
  AND m.path IS NOT NULL
  AND m.path NOT IN ('/admin/users',
                     '/admin/user-groups',
                     '/admin/user-privileges',
                     '/admin/menus',
                     '/admin/menu-actions',
                     '/master/categories',
                     '/master/account-types',
                     '/master/laporan')
ON CONFLICT DO NOTHING;

-- ─── Users ───────────────────────────────────────────────────────
-- Password demo: password123 (demo user = superadmin via keanggotaan grup)
INSERT INTO users (name, email, phone, password_hash)
VALUES (
  'Jason David',
  'jason.david@example.com',
  '+62 812 3456 7890',
  'scrypt:9e07378fd9389517547336abe96ba0fe:ccb00b120ec66e01ebf02d0db9928678c81f5c28f5c5851f45a33fad9a06fdaf6358728ed74025689a1dcdad707498aa6e83bca9f69323e17e68f2291c10adc7'
)
ON CONFLICT DO NOTHING;

-- ─── Group Members (role = grup; satu-satunya sumber) ────────────
INSERT INTO user_group_members (user_id, group_id)
SELECT u.id, g.id
FROM users u, user_groups g
WHERE (u.email = 'jason.david@example.com' AND g.name = 'Superadmin')
ON CONFLICT DO NOTHING;

-- ─── Global Master Categories (user_id NULL = milik semua user) ──
INSERT INTO categories (user_id, name, type, is_default, icon_name, color_hex) VALUES
  -- Income
  (NULL, 'Gaji / Pendapatan', 'INCOME', TRUE, 'banknote',  '#16a34a'),
  (NULL, 'Freelance / Projek', 'INCOME', TRUE, 'briefcase', '#0ea5e9'),
  (NULL, 'Bonus',             'INCOME', TRUE, 'gift',      '#f59e0b'),
  (NULL, 'Investasi',         'INCOME', TRUE, 'chart-line','#10b981'),
  (NULL, 'Penjualan',         'INCOME', TRUE, 'shopping-bag','#8b5cf6'),
  (NULL, 'Lainnya',           'INCOME', TRUE, 'circle',    '#71717a'),
  -- Expense
  (NULL, 'Makanan & Minuman',  'EXPENSE', TRUE, 'utensils',      '#18181b'),
  (NULL, 'Tagihan & Listrik',  'EXPENSE', TRUE, 'zap',           '#27272a'),
  (NULL, 'Belanja / Toko',     'EXPENSE', TRUE, 'shopping-cart', '#3f3f46'),
  (NULL, 'Transportasi',       'EXPENSE', TRUE, 'car',           '#52525b'),
  (NULL, 'Langganan / Media',  'EXPENSE', TRUE, 'tv',            '#71717a'),
  (NULL, 'Kesehatan',          'EXPENSE', TRUE, 'heart-pulse',   '#a1a1aa'),
  (NULL, 'Hiburan',            'EXPENSE', TRUE, 'clapperboard',  '#d4d4d8'),
  (NULL, 'Pendidikan',         'EXPENSE', TRUE, 'graduation-cap','#e4e4e7'),
  (NULL, 'Lainnya',            'EXPENSE', TRUE, 'circle',        '#f4f4f5');

-- ─── Default Categories (copy of global, milik demo user) ────────
INSERT INTO categories (user_id, name, type, is_default, icon_name, color_hex)
SELECT u.id, c.name, c.type, TRUE, c.icon_name, c.color_hex
FROM users u, categories c
WHERE u.email = 'jason.david@example.com'
  AND c.user_id IS NULL
ON CONFLICT DO NOTHING;

-- ─── Accounts ────────────────────────────────────────────────────
INSERT INTO accounts (user_id, name, type, balance)
SELECT u.id, a.name, a.type, a.balance
FROM users u,
     (VALUES
       ('BCA',          'BANK',     8250000),
       ('GoPay',        'E_WALLET',  450000),
       ('Dompet Tunai', 'CASH',      600000)
     ) AS a(name, type, balance)
WHERE u.email = 'jason.david@example.com';

-- ─── Clean Transactional Seeds ────────────────────────────────────
-- No transactions, budgets, or goals are seeded to keep the database fresh.