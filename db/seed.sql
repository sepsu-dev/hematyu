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
), (
  'Siti Aminah',
  'siti.aminah@example.com',
  '+62 811 2345 6789',
  'scrypt:9e07378fd9389517547336abe96ba0fe:ccb00b120ec66e01ebf02d0db9928678c81f5c28f5c5851f45a33fad9a06fdaf6358728ed74025689a1dcdad707498aa6e83bca9f69323e17e68f2291c10adc7'
)
ON CONFLICT DO NOTHING;

-- ─── Group Members (role = grup; satu-satunya sumber) ────────────
INSERT INTO user_group_members (user_id, group_id)
SELECT u.id, g.id
FROM users u, user_groups g
WHERE (u.email = 'jason.david@example.com' AND g.name = 'Superadmin')
   OR (u.email = 'siti.aminah@example.com' AND g.name = 'User')
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

-- ─── Sample Transactions ─────────────────────────────────────────
-- 6 bulan terakhir: pemasukan bulanan + pengeluaran bervariasi per kategori/akun
-- Semua relasi disambung via subquery kunci natural (email user, nama kategori, nama akun).
INSERT INTO transactions (user_id, category_id, account_id, type, amount, description, note, date) VALUES
  -- ── Bulan ke-6 (≈180 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '180 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 620000,  'Tagihan Listrik & Air', NULL,                  NOW() - INTERVAL '179 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Belanja / Toko' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 1100000, 'Belanja Bulanan',       'Sembako',             NOW() - INTERVAL '178 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Transportasi' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 350000,  'Bensin & Tol',          NULL,                  NOW() - INTERVAL '176 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Langganan / Media' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 186000,  'Netflix & Spotify',     'Streaming',           NOW() - INTERVAL '175 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Makanan & Minuman' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 85000,   'Makan Siang Kantor',    NULL,                  NOW() - INTERVAL '175 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Hiburan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 250000,  'Nonton Bioskop',        NULL,                  NOW() - INTERVAL '172 days'),

  -- ── Bulan ke-5 (≈150 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '150 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Freelance / Projek' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  2500000,  'Project UI/UX',         'Klien Narasena',      NOW() - INTERVAL '148 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 780000,  'Tagihan Listrik & WiFi', NULL,                 NOW() - INTERVAL '149 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Belanja / Toko' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 950000,  'Belanja Tokopedia',     'Jaket & sepatu',      NOW() - INTERVAL '147 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Kesehatan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 150000,  'Vitamin & Obat',        NULL,                  NOW() - INTERVAL '145 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Makanan & Minuman' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 120000,  'Makan Keluarga',        'RM Padang',           NOW() - INTERVAL '143 days'),

  -- ── Bulan ke-4 (≈120 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '120 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Bonus' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  1000000,  'THR Lebaran',           NULL,                  NOW() - INTERVAL '118 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 650000,  'Tagihan Listrik & Air', NULL,                  NOW() - INTERVAL '119 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Pendidikan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 750000,  'Bootcamp Online',       'Course data',         NOW() - INTERVAL '116 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Hiburan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 300000,  'Konser Musik',          NULL,                  NOW() - INTERVAL '114 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Makanan & Minuman' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 95000,   'Makan Siang',           NULL,                  NOW() - INTERVAL '112 days'),

  -- ── Bulan ke-3 (≈90 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '90 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Penjualan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'INCOME',  1200000,  'Jual Barang Bekas',     'Kamera lama',         NOW() - INTERVAL '88 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 720000,  'Tagihan Listrik & WiFi', NULL,                 NOW() - INTERVAL '89 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Transportasi' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 400000,  'Bensin & Parkir',       NULL,                  NOW() - INTERVAL '87 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Belanja / Toko' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 650000,  'Belanja Baju',          'Harbolnas',           NOW() - INTERVAL '85 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Langganan / Media' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 199000,  'iCloud & Langganan',    NULL,                  NOW() - INTERVAL '83 days'),

  -- ── Bulan ke-2 (≈60 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '60 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Investasi' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  500000,   'Dividen Saham',         NULL,                  NOW() - INTERVAL '58 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 600000,  'Tagihan Listrik & Air', NULL,                  NOW() - INTERVAL '59 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Kesehatan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 250000,  'Dokter Gigi',           NULL,                  NOW() - INTERVAL '57 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Makanan & Minuman' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 145000,  'Makan & Kopi',          'Weekend',             NOW() - INTERVAL '55 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Lainnya' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 100000,  'Laundry & Lainnya',     NULL,                  NOW() - INTERVAL '53 days'),

  -- ── Bulan ke-1 (≈30 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Freelance / Projek' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  3000000,  'Website Company Profile','Klien PT Maju',   NOW() - INTERVAL '28 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 680000,  'Tagihan Listrik & WiFi', NULL,                 NOW() - INTERVAL '29 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Belanja / Toko' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 1450000, 'Belanja Perabot',       'Meja kerja',          NOW() - INTERVAL '26 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Hiburan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 220000,  'Game & Hiburan',        NULL,                  NOW() - INTERVAL '24 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Transportasi' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 380000,  'Bensin Mingguan',       NULL,                  NOW() - INTERVAL '22 days'),

  -- ── Bulan berjalan (≈2–20 hari lalu) ──
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Gaji / Pendapatan' AND type = 'INCOME'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'INCOME',  15000000, 'Gaji Bulanan',          'Transfer BCA',        NOW() - INTERVAL '20 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Tagihan & Listrik' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 750000,  'Tagihan Listrik',       NULL,                  NOW() - INTERVAL '19 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Belanja / Toko' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 1200000, 'Belanja Tokopedia',     'Sepatu olahraga',     NOW() - INTERVAL '18 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Langganan / Media' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'BCA'), 'EXPENSE', 186000,  'Netflix',               NULL,                  NOW() - INTERVAL '15 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Makanan & Minuman' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 55000,   'Kopi & Snack',          NULL,                  NOW() - INTERVAL '10 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Transportasi' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 420000,  'Bensin & Tol',          NULL,                  NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Lainnya' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'Dompet Tunai'), 'EXPENSE', 130000,  'Parkir & Lainnya',      NULL,                  NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users       WHERE email = 'jason.david@example.com'),
   (SELECT id FROM categories  WHERE user_id = (SELECT id FROM users WHERE email = 'jason.david@example.com') AND name = 'Kesehatan' AND type = 'EXPENSE'),
   (SELECT id FROM accounts    WHERE name = 'GoPay'), 'EXPENSE', 95000,   'Obat & Vitamin',        NULL,                  NOW() - INTERVAL '2 days');

-- ─── Budgets (Bulan Berjalan) ────────────────────────────────────
INSERT INTO budgets (user_id, category_id, amount, period)
SELECT u.id, c.id, b.amount, 'MONTHLY'
FROM users u
JOIN categories c
  ON c.user_id = u.id
 AND c.type = 'EXPENSE'
JOIN (
  VALUES
    ('Makanan & Minuman',  1500000),
    ('Tagihan & Listrik',  1000000),
    ('Belanja / Toko',     1500000),
    ('Transportasi',       500000),
    ('Langganan / Media',  400000),
    ('Hiburan',            500000)
) AS b(category_name, amount) ON b.category_name = c.name
WHERE u.email = 'jason.david@example.com';

-- ─── Goals ───────────────────────────────────────────────────────
INSERT INTO goals (user_id, name, target_amount, current_amount, deadline)
SELECT u.id, g.name, g.target_amount, g.current_amount, g.deadline
FROM users u,
     (VALUES
       ('Dana Darurat',     15000000, 6500000,  NULL),
       ('Liburan ke Bali',  8000000,  3500000,  NOW() + INTERVAL '6 months'),
       ('Laptop Baru',      20000000, 12500000, NOW() + INTERVAL '12 months')
     ) AS g(name, target_amount, current_amount, deadline)
WHERE u.email = 'jason.david@example.com';