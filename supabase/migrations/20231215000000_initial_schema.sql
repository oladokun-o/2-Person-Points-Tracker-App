-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '👤',
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
    total_earned INTEGER NOT NULL DEFAULT 0 CHECK (total_earned >= 0),
    total_lost INTEGER NOT NULL DEFAULT 0 CHECK (total_lost >= 0),
    max_points INTEGER NOT NULL DEFAULT 10 CHECK (max_points > 0),
    avatar_url TEXT,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'apple', 'email')),
    is_allowed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Actions table
CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    emoji TEXT NOT NULL,
    points INTEGER NOT NULL,
    category TEXT,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    use_count INTEGER NOT NULL DEFAULT 0 CHECK (use_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    emoji TEXT NOT NULL,
    required_points INTEGER NOT NULL CHECK (required_points >= 0),
    category TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    awarded_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    awarded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_id UUID REFERENCES actions(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_allowed ON users(is_allowed);
CREATE INDEX idx_actions_is_active ON actions(is_active);
CREATE INDEX idx_actions_created_by ON actions(created_by);
CREATE INDEX idx_actions_use_count ON actions(use_count DESC);
CREATE INDEX idx_rewards_is_active ON rewards(is_active);
CREATE INDEX idx_rewards_order ON rewards("order");
CREATE INDEX idx_transactions_awarded_to ON transactions(awarded_to);
CREATE INDEX idx_transactions_awarded_by ON transactions(awarded_by);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users: Can read all allowed users, update only their own profile
CREATE POLICY "Users can view allowed users" ON users
    FOR SELECT USING (is_allowed = true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = auth_id);

-- Actions: All authenticated users can read active actions
CREATE POLICY "Users can view active actions" ON actions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create actions" ON actions
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT auth_id FROM users WHERE id = created_by));

CREATE POLICY "Users can update own actions" ON actions
    FOR UPDATE USING (auth.uid()::text = (SELECT auth_id FROM users WHERE id = created_by));

-- Rewards: All authenticated users can read active rewards
CREATE POLICY "Users can view active rewards" ON rewards
    FOR SELECT USING (is_active = true);

-- Transactions: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (
        auth.uid()::text = (SELECT auth_id FROM users WHERE id = awarded_to) OR
        auth.uid()::text = (SELECT auth_id FROM users WHERE id = awarded_by)
    );

CREATE POLICY "Users can create transactions" ON transactions
    FOR INSERT WITH CHECK (
        auth.uid()::text = (SELECT auth_id FROM users WHERE id = awarded_by)
    );

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user information and points tracking';
COMMENT ON TABLE actions IS 'Available actions that can earn points';
COMMENT ON TABLE rewards IS 'Rewards that can be unlocked with points';
COMMENT ON TABLE transactions IS 'History of all point transactions';

COMMENT ON COLUMN users.auth_id IS 'Supabase Auth user ID';
COMMENT ON COLUMN users.is_allowed IS 'Whether user is whitelisted and allowed to use the app';
COMMENT ON COLUMN users.max_points IS 'Maximum points the user can accumulate';
COMMENT ON COLUMN actions.use_count IS 'Number of times this action has been used';
COMMENT ON COLUMN rewards."order" IS 'Display order for rewards';
