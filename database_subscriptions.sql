-- ============================================
-- TABELA DE ASSINATURAS STRIPE
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Criar tabela de assinaturas de usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_subscriptions_updated_at();

-- RLS Policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas sua própria assinatura
CREATE POLICY "Users can view own subscription"
    ON user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem inserir sua própria assinatura (primeira vez)
CREATE POLICY "Users can insert own subscription"
    ON user_subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Apenas serviços podem atualizar (via service_role)
CREATE POLICY "Service role can update subscriptions"
    ON user_subscriptions
    FOR UPDATE
    USING (true);

-- Criar assinatura free para usuários novos automaticamente
CREATE OR REPLACE FUNCTION create_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar assinatura ao criar usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_subscription();

-- Comentários
COMMENT ON TABLE user_subscriptions IS 'Assinaturas Stripe dos usuários';
COMMENT ON COLUMN user_subscriptions.stripe_customer_id IS 'ID do cliente no Stripe';
COMMENT ON COLUMN user_subscriptions.stripe_subscription_id IS 'ID da assinatura no Stripe';
COMMENT ON COLUMN user_subscriptions.plan IS 'Plano atual (free ou pro)';
COMMENT ON COLUMN user_subscriptions.status IS 'Status da assinatura';

