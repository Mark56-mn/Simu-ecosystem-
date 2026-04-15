-- 1. CREATE MISSING TABLES
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  wallet_address TEXT,
  to_address TEXT,
  type TEXT,
  amount NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.node_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  status TEXT,
  uptime NUMERIC,
  last_ping TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.node_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id TEXT,
  work_done NUMERIC,
  proof TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  url TEXT,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE ADMIN USER & BYPASS EMAIL VERIFICATION
DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
BEGIN
  -- Check if user exists first to avoid ON CONFLICT constraint issues
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@simugmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_uid, 'authenticated', 'authenticated', 'admin@simugmail.com', crypt('2026', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false
    );
  ELSE
    SELECT id INTO admin_uid FROM auth.users WHERE email = 'admin@simugmail.com';
  END IF;

  -- Insert into public.users with admin role
  INSERT INTO public.users (id, role)
  VALUES (admin_uid, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- 4. SELECT POLICIES
CREATE POLICY "Allow public read on ledger" ON ledger FOR SELECT USING (true);
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read on node_stats" ON node_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read on bug_reports" ON bug_reports FOR SELECT USING (true);

-- 5. INSERT/UPDATE POLICIES
CREATE POLICY "Allow owner or admin write on ledger" ON ledger FOR ALL USING (
  auth.uid() = user_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Allow owner or admin write on users" ON users FOR ALL USING (
  auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Allow owner or admin write on node_stats" ON node_stats FOR ALL USING (
  auth.uid() = user_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Allow owner or admin write on bug_reports" ON bug_reports FOR ALL USING (
  auth.uid() = user_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- 6. ADMIN OVERRIDE POLICIES
CREATE POLICY "Service role bypass ledger" ON ledger FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "Service role bypass users" ON users FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "Service role bypass node_stats" ON node_stats FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "Service role bypass bug_reports" ON bug_reports FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- 7. INDEXES
CREATE INDEX IF NOT EXISTS idx_ledger_wallet_address ON ledger(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ledger_status ON ledger(status);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_node_stats_status ON node_stats(status);
CREATE INDEX IF NOT EXISTS idx_node_stats_created_at ON node_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports(created_at);
