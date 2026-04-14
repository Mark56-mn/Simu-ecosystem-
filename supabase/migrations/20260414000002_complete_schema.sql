-- 1. Wallets / Accounts
CREATE TABLE IF NOT EXISTS wallets (
    address VARCHAR(255) PRIMARY KEY,
    balance DECIMAL(18,4) DEFAULT 0.0000,
    public_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ledger (Transactions)
CREATE TABLE IF NOT EXISTS ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender VARCHAR(255) REFERENCES wallets(address),
    receiver VARCHAR(255) REFERENCES wallets(address),
    amount DECIMAL(18,4) NOT NULL,
    status VARCHAR(50) DEFAULT 'provisional' CHECK (status IN ('provisional', 'confirmed', 'rolled_back')),
    signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Faucet Claims & USSD
CREATE TABLE IF NOT EXISTS spent_codes (
    code VARCHAR(255) PRIMARY KEY,
    claimed_by VARCHAR(255) REFERENCES wallets(address),
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faucet_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address VARCHAR(255) REFERENCES wallets(address),
    amount DECIMAL(18,4) NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ang Nodes (Infrastructure)
CREATE TABLE IF NOT EXISTS node_stats (
    device_id VARCHAR(255) PRIMARY KEY,
    validations_count INT DEFAULT 0,
    accuracy_rate DECIMAL(5,2) DEFAULT 100.00,
    total_earned DECIMAL(18,4) DEFAULT 0.0000,
    reputation_score INT DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS validation_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_id UUID REFERENCES ledger(id),
    device_id VARCHAR(255) REFERENCES node_stats(device_id),
    result VARCHAR(10) CHECK (result IN ('valid', 'invalid')),
    node_signature TEXT NOT NULL,
    server_match BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Active Threat Response Protocol (ATRP) & Security
CREATE TABLE IF NOT EXISTS threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(255) REFERENCES node_stats(device_id),
    tx_id UUID REFERENCES ledger(id),
    type VARCHAR(50) NOT NULL,
    proof JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quarantined_nodes (
    node_id VARCHAR(255) PRIMARY KEY REFERENCES node_stats(device_id),
    reason TEXT,
    locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS balance_snapshots (
    tx_id UUID REFERENCES ledger(id),
    account_id VARCHAR(255) REFERENCES wallets(address),
    pre_tx_balance DECIMAL(18,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (tx_id, account_id)
);

CREATE TABLE IF NOT EXISTS rollbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_id UUID REFERENCES ledger(id),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);
