-- Enable Row Level Security
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- SELECT Policies: Allow read for authenticated & anonymous (public data)
CREATE POLICY "Allow public read on ledger" ON ledger FOR SELECT USING (true);
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read on node_stats" ON node_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read on bug_reports" ON bug_reports FOR SELECT USING (true);

-- INSERT/UPDATE Policies: Only allow writes where auth.uid() matches owner or role = 'admin'
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

-- Admin Override Policy: Service role can bypass RLS
CREATE POLICY "Service role bypass ledger" ON ledger FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "Service role bypass users" ON users FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "Service role bypass node_stats" ON node_stats FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "Service role bypass bug_reports" ON bug_reports FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ledger_wallet_address ON ledger(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ledger_status ON ledger(status);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_node_stats_status ON node_stats(status);
CREATE INDEX IF NOT EXISTS idx_node_stats_created_at ON node_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports(created_at);
