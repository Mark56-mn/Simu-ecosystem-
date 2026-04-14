CREATE TABLE node_stats (
    device_id UUID PRIMARY KEY,
    validations_count INT DEFAULT 0,
    accuracy_rate DECIMAL(5,2) DEFAULT 100.00,
    total_earned DECIMAL(10,2) DEFAULT 0.00,
    reputation_score INT DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE validation_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_id VARCHAR(255) NOT NULL,
    device_id UUID REFERENCES node_stats(device_id),
    result VARCHAR(10) CHECK (result IN ('valid', 'invalid')),
    node_signature TEXT NOT NULL,
    server_match BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
