CREATE TABLE threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(255) NOT NULL,
    tx_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    proof JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE quarantined_nodes (
    node_id VARCHAR(255) PRIMARY KEY,
    reason TEXT,
    locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE balance_snapshots (
    tx_id VARCHAR(255) NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    pre_tx_balance DECIMAL(18,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (tx_id, account_id)
);

CREATE TABLE rollbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_id VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);
