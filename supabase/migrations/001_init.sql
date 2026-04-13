-- 1. Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Wallets Table (Tracks the cloud/online state for devices)
CREATE TABLE wallets (
  device_id TEXT PRIMARY KEY,
  balance BIGINT DEFAULT 0 NOT NULL,
  public_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Spent Codes Table (CRITICAL: Prevents double-spending)
CREATE TABLE spent_codes (
  signature TEXT PRIMARY KEY,
  redeemer_device_id TEXT NOT NULL REFERENCES wallets(device_id),
  amount BIGINT NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Faucet Claims Table (Tracks testnet rewards to prevent abuse)
CREATE TABLE faucet_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL REFERENCES wallets(device_id),
  claim_type TEXT NOT NULL, -- e.g., 'daily', 'onboarding', 'first_transfer'
  amount BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sync Logs Table (Audit trail for offline sync events and anomalies)
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL REFERENCES wallets(device_id),
  tx_count INTEGER NOT NULL,
  rollbacks_count INTEGER DEFAULT 0,
  status TEXT NOT NULL, -- e.g., 'success', 'anomaly_flagged'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Performance Indexes (Crucial for fast lookups during sync)
-- FIX: Cast created_at to DATE at UTC to make it IMMUTABLE for the index
CREATE INDEX idx_faucet_claims_device_date ON faucet_claims(device_id, (created_at AT TIME ZONE 'UTC')::DATE);
CREATE INDEX idx_spent_codes_redeemer ON spent_codes(redeemer_device_id);
CREATE INDEX idx_sync_logs_device ON sync_logs(device_id);

-- 7. Row Level Security (RLS)
-- Enable RLS to ensure strict access control. 
-- By default, this blocks ALL direct client access (Anon Key).
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE spent_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE faucet_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Note: We do NOT create public policies here. 
-- All database reads/writes will be routed through your Vercel Edge Functions 
-- using the SUPABASE_SERVICE_ROLE_KEY, which automatically bypasses RLS. 
-- This ensures the client app can never directly manipulate the database.
