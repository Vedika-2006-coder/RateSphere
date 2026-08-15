-- ============================================================
-- RateSphere — development seed data
--
-- DEVELOPMENT ONLY. Every account below shares one bcrypt-hashed
-- development password (see README → "Development seed data").
-- Never load this file into a production database.
--
-- Run with:  cd backend && npm run db:seed
-- ============================================================

USE ratesphere;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ratings;
TRUNCATE TABLE stores;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Users (all names are 20–60 characters, per the challenge rules)
-- ------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
  (1,  'Aditi Raghunathan Menon',        'admin@ratesphere.dev',      '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '4th Floor, Orchid Tower, MG Road, Bengaluru 560001',   'administrator'),
  (2,  'Rajeshwari Balakrishnan Iyer',   'rajeshwari@ratesphere.dev', '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '221 Linking Road, Bandra West, Mumbai 400050',         'store_owner'),
  (3,  'Devanshu Krishnamurthy Rao',     'devanshu@ratesphere.dev',   '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '18 Park Street, Ballygunge, Kolkata 700019',           'store_owner'),
  (4,  'Meenakshi Sundareswaran Nair',   'meenakshi@ratesphere.dev',  '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '9 Anna Salai, Thousand Lights, Chennai 600002',        'store_owner'),
  (5,  'Harshvardhan Deshpande Patil',   'harsh@ratesphere.dev',      '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '77 FC Road, Shivajinagar, Pune 411005',                'normal_user'),
  (6,  'Priyadarshini Venkataraman',     'priya@ratesphere.dev',      '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '12 Residency Road, Richmond Town, Bengaluru 560025',   'normal_user'),
  (7,  'Siddharth Chandrasekaran Bose',  'siddharth@ratesphere.dev',  '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '55 Sector 18, Noida, Uttar Pradesh 201301',            'normal_user'),
  (8,  'Ananya Bhattacharya Sengupta',   'ananya@ratesphere.dev',     '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '31 Salt Lake Sector V, Kolkata 700091',                'normal_user'),
  (9,  'Vikramaditya Ranganathan Shah',  'vikram@ratesphere.dev',     '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '8 CG Road, Navrangpura, Ahmedabad 380009',             'normal_user'),
  (10, 'Kavyashree Lakshminarayanan',    'kavya@ratesphere.dev',      '$2b$10$7iia7n11udW/BWDoAMCQ2e6jIlWLYm6p/nstcZ/wo4IocMA3uHhFa', '64 Jubilee Hills Road No 10, Hyderabad 500033',        'normal_user');

-- ------------------------------------------------------------
-- Stores (owned by the three store_owner accounts above)
-- ------------------------------------------------------------
INSERT INTO stores (id, name, email, address, owner_id) VALUES
  (1, 'Verdant Grocers & Provisions', 'hello@verdantgrocers.dev', '221 Linking Road, Bandra West, Mumbai 400050',        2),
  (2, 'Northline Coffee Roasters',    'hello@northlineroast.dev', '14 Hill Road, Bandra West, Mumbai 400050',            2),
  (3, 'Paperleaf Books & Stationery', 'hello@paperleafbooks.dev', '18 Park Street, Ballygunge, Kolkata 700019',          3),
  (4, 'Cobalt Electronics Emporium',  'hello@cobaltelectro.dev',  '9 Anna Salai, Thousand Lights, Chennai 600002',       4),
  (5, 'Saffron Table Fine Foods',     'hello@saffrontable.dev',   '27 Besant Nagar Beach Road, Chennai 600090',          4),
  (6, 'Harbour Lane Home Studio',     'hello@harbourlane.dev',    '3 Marine Drive, Fort, Mumbai 400001',                 NULL);

-- ------------------------------------------------------------
-- Ratings (max one per user per store)
-- ------------------------------------------------------------
INSERT INTO ratings (user_id, store_id, rating) VALUES
  (5, 1, 5), (6, 1, 4), (7, 1, 5), (8, 1, 3), (9, 1, 4), (10, 1, 5),
  (5, 2, 4), (6, 2, 5), (8, 2, 4), (10, 2, 3),
  (6, 3, 5), (7, 3, 5), (9, 3, 4),
  (5, 4, 2), (7, 4, 3), (8, 4, 3), (10, 4, 1),
  (6, 5, 4), (9, 5, 5), (10, 5, 4), (5, 5, 5);
