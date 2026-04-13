-- 1. USSD Pins
CREATE TABLE active_pins (
  pin TEXT PRIMARY KEY,
  signature TEXT NOT NULL,
  amount BIGINT NOT NULL,
  expiry BIGINT NOT NULL
);

-- 2. Agent Transactions
CREATE TABLE agent_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  amount BIGINT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Recovery Sessions
CREATE TABLE recovery_sessions (
  session_id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  approvals INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Telemetry & Analytics
CREATE TABLE telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  device_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
