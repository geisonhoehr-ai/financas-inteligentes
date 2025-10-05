-- ============================================
-- SCRIPT DE CORREÇÃO COMPLETA DO SISTEMA
-- ============================================
-- Este script corrige TODOS os problemas encontrados
-- Execute APENAS este arquivo no Supabase SQL Editor
-- ============================================

-- PASSO 1: Criar extensões necessárias
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PASSO 2: Criar ENUM types
-- ============================================
DO $$ BEGIN
    CREATE TYPE tipo_usuario AS ENUM ('pessoa', 'empresa');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_divida AS ENUM ('pendente', 'paga', 'cancelada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_emprestimo AS ENUM ('emprestei', 'peguei');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_pagamento AS ENUM ('dinheiro', 'pix', 'debito', 'credito', 'transferencia');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- PASSO 3: Backup de dados existentes (se houver)
-- ============================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        DROP TABLE IF EXISTS users_backup;
        CREATE TABLE users_backup AS SELECT * FROM users;
        RAISE NOTICE 'Backup de users criado: % registros', (SELECT COUNT(*) FROM users_backup);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gastos') THEN
        DROP TABLE IF EXISTS gastos_backup;
        CREATE TABLE gastos_backup AS SELECT * FROM gastos;
        RAISE NOTICE 'Backup de gastos criado: % registros', (SELECT COUNT(*) FROM gastos_backup);
    END IF;
END $$;

-- PASSO 4: Recriar users com UUID
-- ============================================
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  tipo tipo_usuario DEFAULT 'pessoa',
  cor VARCHAR(7) DEFAULT '#007AFF',
  foto_url VARCHAR(500),
  ativo BOOLEAN DEFAULT TRUE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT nome_nao_vazio CHECK (TRIM(nome) != ''),
  CONSTRAINT email_valido CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Adicionar FK após criar tabela
ALTER TABLE users ADD CONSTRAINT fk_users_deletado_por
  FOREIGN KEY (deletado_por) REFERENCES users(id);

CREATE INDEX idx_users_email ON users(email) WHERE deletado = FALSE;
CREATE INDEX idx_users_tipo ON users(tipo) WHERE deletado = FALSE;
CREATE INDEX idx_users_ativo ON users(ativo) WHERE ativo = TRUE AND deletado = FALSE;

-- PASSO 5: Criar tabela familias
-- ============================================
DROP TABLE IF EXISTS familias CASCADE;
CREATE TABLE familias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  modo_calculo VARCHAR(20) DEFAULT 'familiar',
  codigo_convite VARCHAR(20) UNIQUE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT modo_valido CHECK (modo_calculo IN ('familiar', 'individual'))
);

CREATE INDEX idx_familias_admin ON familias(admin_id) WHERE deletado = FALSE;
CREATE INDEX idx_familias_codigo ON familias(codigo_convite) WHERE deletado = FALSE;

-- PASSO 6: Criar tabela familia_membros
-- ============================================
DROP TABLE IF EXISTS familia_membros CASCADE;
CREATE TABLE familia_membros (
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  papel VARCHAR(50) DEFAULT 'membro',
  aprovado BOOLEAN DEFAULT FALSE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (familia_id, usuario_id),
  CONSTRAINT papel_valido CHECK (papel IN ('admin', 'owner', 'membro', 'dependente', 'visualizador'))
);

CREATE INDEX idx_familia_membros_familia ON familia_membros(familia_id) WHERE deletado = FALSE;
CREATE INDEX idx_familia_membros_usuario ON familia_membros(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_familia_membros_lookup ON familia_membros(familia_id, usuario_id, aprovado) WHERE deletado = FALSE;

-- PASSO 7: Criar tabela categorias CORRETAMENTE
-- ============================================
DROP TABLE IF EXISTS categorias CASCADE;
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  icone VARCHAR(50),
  cor VARCHAR(7) DEFAULT '#007AFF',
  tipo VARCHAR(50) NOT NULL,
  ativa BOOLEAN DEFAULT TRUE,
  sistema BOOLEAN DEFAULT FALSE,
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categorias_tipo ON categorias(tipo) WHERE deletado = FALSE;
CREATE INDEX idx_categorias_usuario ON categorias(usuario_id) WHERE deletado = FALSE;

-- Inserir categorias padrão
INSERT INTO categorias (nome, icone, tipo, sistema) VALUES
('Alimentação', '🍔', 'gasto', TRUE),
('Transporte', '🚗', 'gasto', TRUE),
('Saúde', '🏥', 'gasto', TRUE),
('Educação', '📚', 'gasto', TRUE),
('Lazer', '🎮', 'gasto', TRUE),
('Vestuário', '👕', 'gasto', TRUE),
('Moradia', '🏠', 'gasto', TRUE),
('Outros', '📦', 'gasto', TRUE),
('Eletrodomésticos', '🔌', 'parcela', TRUE),
('Eletrônicos', '📱', 'parcela', TRUE),
('Móveis', '🛋️', 'parcela', TRUE),
('Veículo', '🚗', 'parcela', TRUE),
('Reforma', '🔨', 'parcela', TRUE);

-- PASSO 8: Criar tabela salaries
-- ============================================
DROP TABLE IF EXISTS salaries CASCADE;
CREATE TABLE salaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  valor DECIMAL(15, 2) NOT NULL,
  descricao VARCHAR(255),
  mes_referencia DATE,
  tipo VARCHAR(20) DEFAULT 'principal',
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  visivel_familia BOOLEAN DEFAULT TRUE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor >= 0),
  CONSTRAINT tipo_salario_valido CHECK (tipo IN ('principal', 'extra', 'bonus', '13_salario'))
);

CREATE INDEX idx_salaries_usuario ON salaries(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_salaries_mes ON salaries(mes_referencia) WHERE deletado = FALSE;
CREATE INDEX idx_salaries_familia ON salaries(familia_id, usuario_id) WHERE deletado = FALSE;

-- PASSO 9: Criar tabela gastos
-- ============================================
DROP TABLE IF EXISTS gastos CASCADE;
CREATE TABLE gastos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(15, 2) NOT NULL,
  data DATE NOT NULL,
  tipo_pagamento tipo_pagamento DEFAULT 'dinheiro',
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  privado BOOLEAN DEFAULT FALSE,
  visivel_familia BOOLEAN DEFAULT TRUE,
  pago_por UUID REFERENCES users(id),
  responsavel_por UUID REFERENCES users(id),
  percentual_divisao JSONB,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor >= 0.01)
);

CREATE INDEX idx_gastos_usuario_data ON gastos(usuario_id, data DESC) WHERE deletado = FALSE;
CREATE INDEX idx_gastos_categoria_data ON gastos(categoria_id, data DESC) WHERE deletado = FALSE;
CREATE INDEX idx_gastos_familia ON gastos(familia_id, data DESC) WHERE deletado = FALSE;
CREATE INDEX idx_gastos_pago_por ON gastos(pago_por) WHERE deletado = FALSE;
CREATE INDEX idx_gastos_responsavel ON gastos(responsavel_por) WHERE deletado = FALSE;

-- PASSO 10: Criar tabela compras_parceladas
-- ============================================
DROP TABLE IF EXISTS compras_parceladas CASCADE;
CREATE TABLE compras_parceladas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  produto VARCHAR(255) NOT NULL,
  valor_total DECIMAL(15, 2) NOT NULL,
  total_parcelas INTEGER NOT NULL,
  valor_parcela DECIMAL(15, 2) NOT NULL,
  parcelas_pagas INTEGER DEFAULT 0,
  data_compra DATE NOT NULL,
  primeira_parcela DATE,
  dia_vencimento INTEGER,
  tipo_pagamento tipo_pagamento,
  observacoes TEXT,
  finalizada BOOLEAN DEFAULT FALSE,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  privado BOOLEAN DEFAULT FALSE,
  visivel_familia BOOLEAN DEFAULT TRUE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT total_parcelas_valido CHECK (total_parcelas > 0),
  CONSTRAINT parcelas_pagas_valido CHECK (parcelas_pagas >= 0 AND parcelas_pagas <= total_parcelas),
  CONSTRAINT valor_total_positivo CHECK (valor_total > 0),
  CONSTRAINT valor_parcela_positivo CHECK (valor_parcela > 0),
  CONSTRAINT parcela_coerente CHECK (ABS(valor_parcela * total_parcelas - valor_total) < 1.00),
  CONSTRAINT finalizada_coerente CHECK (NOT finalizada OR parcelas_pagas = total_parcelas)
);

CREATE INDEX idx_parcelas_usuario_ativas ON compras_parceladas(usuario_id, finalizada)
  WHERE finalizada = FALSE AND deletado = FALSE;

-- PASSO 11: Criar tabela gasolina
-- ============================================
DROP TABLE IF EXISTS gasolina CASCADE;
CREATE TABLE gasolina (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  litros DECIMAL(10, 3),
  preco_litro DECIMAL(10, 3),
  km_atual INTEGER,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0)
);

CREATE INDEX idx_gasolina_usuario_data ON gasolina(usuario_id, data DESC) WHERE deletado = FALSE;

-- PASSO 12: Criar tabela assinaturas
-- ============================================
DROP TABLE IF EXISTS assinaturas CASCADE;
CREATE TABLE assinaturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  dia_cobranca INTEGER,
  ativa BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0),
  CONSTRAINT dia_valido CHECK (dia_cobranca IS NULL OR (dia_cobranca >= 1 AND dia_cobranca <= 31))
);

CREATE INDEX idx_assinaturas_usuario ON assinaturas(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_assinaturas_ativa ON assinaturas(ativa) WHERE ativa = TRUE AND deletado = FALSE;

-- PASSO 13: Criar tabela contas_fixas
-- ============================================
DROP TABLE IF EXISTS contas_fixas CASCADE;
CREATE TABLE contas_fixas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  dia_vencimento INTEGER,
  ativa BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0),
  CONSTRAINT dia_valido CHECK (dia_vencimento IS NULL OR (dia_vencimento >= 1 AND dia_vencimento <= 31))
);

CREATE INDEX idx_contas_fixas_usuario ON contas_fixas(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_contas_fixas_ativa ON contas_fixas(ativa) WHERE ativa = TRUE AND deletado = FALSE;

-- PASSO 14: Criar tabela ferramentas_ia_dev
-- ============================================
DROP TABLE IF EXISTS ferramentas_ia_dev CASCADE;
CREATE TABLE ferramentas_ia_dev (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  dia_cobranca INTEGER,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0)
);

CREATE INDEX idx_ferramentas_usuario ON ferramentas_ia_dev(usuario_id) WHERE deletado = FALSE;

-- PASSO 15: Criar tabela cartoes
-- ============================================
DROP TABLE IF EXISTS cartoes CASCADE;
CREATE TABLE cartoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  limite DECIMAL(15, 2),
  gasto_atual DECIMAL(15, 2) DEFAULT 0,
  dia_fechamento INTEGER,
  dia_vencimento INTEGER,
  ativo BOOLEAN DEFAULT TRUE,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT limite_positivo CHECK (limite IS NULL OR limite >= 0),
  CONSTRAINT gasto_valido CHECK (gasto_atual >= 0),
  CONSTRAINT dia_fechamento_valido CHECK (dia_fechamento IS NULL OR (dia_fechamento >= 1 AND dia_fechamento <= 31)),
  CONSTRAINT dia_vencimento_valido CHECK (dia_vencimento IS NULL OR (dia_vencimento >= 1 AND dia_vencimento <= 31))
);

CREATE INDEX idx_cartoes_usuario ON cartoes(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_cartoes_ativo ON cartoes(ativo) WHERE ativo = TRUE AND deletado = FALSE;

-- PASSO 16: Criar tabela emprestimos
-- ============================================
DROP TABLE IF EXISTS emprestimos CASCADE;
CREATE TABLE emprestimos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tipo tipo_emprestimo NOT NULL,
  para_quem VARCHAR(255),
  valor DECIMAL(15, 2) NOT NULL,
  valor_parcela DECIMAL(15, 2),
  data_emprestimo DATE NOT NULL,
  data_vencimento DATE,
  pago BOOLEAN DEFAULT FALSE,
  data_pagamento DATE,
  quitado BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0),
  CONSTRAINT datas_coerentes CHECK (data_vencimento IS NULL OR data_vencimento >= data_emprestimo)
);

CREATE INDEX idx_emprestimos_usuario ON emprestimos(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_emprestimos_tipo_pago ON emprestimos(tipo, pago) WHERE deletado = FALSE;

-- PASSO 17: Criar tabela dividas
-- ============================================
DROP TABLE IF EXISTS dividas CASCADE;
CREATE TABLE dividas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  descricao VARCHAR(255) NOT NULL,
  valor_total DECIMAL(15, 2) NOT NULL,
  valor_pago DECIMAL(15, 2) DEFAULT 0,
  quitada BOOLEAN DEFAULT FALSE,
  data_contratacao DATE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_total_positivo CHECK (valor_total > 0),
  CONSTRAINT valor_pago_valido CHECK (valor_pago >= 0),
  CONSTRAINT valores_coerentes CHECK (valor_pago <= valor_total)
);

CREATE INDEX idx_dividas_usuario ON dividas(usuario_id) WHERE deletado = FALSE;
CREATE INDEX idx_dividas_quitada ON dividas(quitada) WHERE quitada = FALSE AND deletado = FALSE;

-- PASSO 18: Criar tabela metas
-- ============================================
DROP TABLE IF EXISTS metas CASCADE;
CREATE TABLE metas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor_objetivo DECIMAL(15, 2) NOT NULL,
  valor_atual DECIMAL(15, 2) DEFAULT 0,
  prazo DATE,
  concluida BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_objetivo_positivo CHECK (valor_objetivo > 0),
  CONSTRAINT valor_atual_valido CHECK (valor_atual >= 0)
);

CREATE INDEX idx_metas_usuario ON metas(usuario_id) WHERE deletado = FALSE;

-- PASSO 19: Criar tabela investimentos
-- ============================================
DROP TABLE IF EXISTS investimentos CASCADE;
CREATE TABLE investimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(15, 2) NOT NULL,
  tipo VARCHAR(100),
  data_aplicacao DATE,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0)
);

CREATE INDEX idx_investimentos_usuario ON investimentos(usuario_id) WHERE deletado = FALSE;

-- PASSO 20: Criar tabela patrimonio
-- ============================================
DROP TABLE IF EXISTS patrimonio CASCADE;
CREATE TABLE patrimonio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(15, 2) NOT NULL,
  tipo VARCHAR(100),
  data_aquisicao DATE,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0)
);

CREATE INDEX idx_patrimonio_usuario ON patrimonio(usuario_id) WHERE deletado = FALSE;

-- PASSO 21: Criar tabela dividas_internas
-- ============================================
DROP TABLE IF EXISTS dividas_internas CASCADE;
CREATE TABLE dividas_internas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  credor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  devedor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  valor DECIMAL(12,2) NOT NULL,
  descricao TEXT,
  gasto_original_id UUID REFERENCES gastos(id) ON DELETE SET NULL,
  parcela_numero INT,
  parcela_total INT,
  status status_divida DEFAULT 'pendente',
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_vencimento DATE,
  data_pagamento TIMESTAMP,
  comprovante_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT valor_positivo CHECK (valor > 0),
  CONSTRAINT diferentes_pessoas CHECK (credor_id != devedor_id)
);

CREATE INDEX idx_dividas_familia ON dividas_internas(familia_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dividas_credor ON dividas_internas(credor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dividas_devedor ON dividas_internas(devedor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dividas_status ON dividas_internas(status) WHERE deleted_at IS NULL;

-- PASSO 22: Criar trigger para dívidas automáticas
-- ============================================
CREATE OR REPLACE FUNCTION criar_divida_automatica()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pago_por IS NOT NULL
     AND NEW.responsavel_por IS NOT NULL
     AND NEW.pago_por != NEW.responsavel_por
     AND NEW.familia_id IS NOT NULL THEN

    INSERT INTO dividas_internas (
      familia_id,
      credor_id,
      devedor_id,
      valor,
      descricao,
      gasto_original_id,
      status
    ) VALUES (
      NEW.familia_id,
      NEW.pago_por,
      NEW.responsavel_por,
      NEW.valor,
      'Ref: ' || NEW.descricao,
      NEW.id,
      'pendente'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_criar_divida_automatica ON gastos;
CREATE TRIGGER trigger_criar_divida_automatica
  AFTER INSERT ON gastos
  FOR EACH ROW
  EXECUTE FUNCTION criar_divida_automatica();

-- PASSO 23: Criar funções para gerenciar dívidas
-- ============================================
CREATE OR REPLACE FUNCTION marcar_divida_paga(
  p_divida_id UUID,
  p_comprovante_url TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE dividas_internas
  SET
    status = 'paga',
    data_pagamento = NOW(),
    comprovante_url = COALESCE(p_comprovante_url, comprovante_url),
    updated_at = NOW()
  WHERE id = p_divida_id
    AND status = 'pendente'
    AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dívida não encontrada ou já foi paga';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cancelar_divida(
  p_divida_id UUID,
  p_motivo TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE dividas_internas
  SET
    status = 'cancelada',
    observacoes = COALESCE(p_motivo, observacoes),
    updated_at = NOW()
  WHERE id = p_divida_id
    AND status = 'pendente'
    AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dívida não encontrada ou já foi processada';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obter_meu_resumo_dividas(p_familia_id UUID DEFAULT NULL)
RETURNS TABLE (
  familia_id UUID,
  familia_nome TEXT,
  total_devo NUMERIC,
  total_recebo NUMERIC,
  saldo_liquido NUMERIC,
  qtd_dividas_pendentes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH minhas_dividas AS (
    SELECT
      d.familia_id,
      f.nome as familia_nome,
      SUM(CASE WHEN d.devedor_id = auth.uid() AND d.status = 'pendente' THEN d.valor ELSE 0 END) as devo,
      SUM(CASE WHEN d.credor_id = auth.uid() AND d.status = 'pendente' THEN d.valor ELSE 0 END) as recebo,
      COUNT(CASE WHEN d.status = 'pendente' AND (d.devedor_id = auth.uid() OR d.credor_id = auth.uid()) THEN 1 END) as qtd
    FROM dividas_internas d
    JOIN familias f ON f.id = d.familia_id
    WHERE d.deleted_at IS NULL
      AND (p_familia_id IS NULL OR d.familia_id = p_familia_id)
      AND (d.devedor_id = auth.uid() OR d.credor_id = auth.uid())
    GROUP BY d.familia_id, f.nome
  )
  SELECT
    md.familia_id,
    md.familia_nome,
    md.devo as total_devo,
    md.recebo as total_recebo,
    (md.recebo - md.devo) as saldo_liquido,
    md.qtd as qtd_dividas_pendentes
  FROM minhas_dividas md;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 24: Criar Materialized View para Dashboard
-- ============================================
DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_mensal CASCADE;
CREATE MATERIALIZED VIEW mv_dashboard_mensal AS
SELECT
    DATE_TRUNC('month', CURRENT_DATE)::DATE as mes_referencia,
    EXTRACT(YEAR FROM CURRENT_DATE)::INT as ano,
    EXTRACT(MONTH FROM CURRENT_DATE)::INT as mes,

    -- Receitas
    (SELECT COALESCE(SUM(valor), 0)
     FROM salaries
     WHERE deletado = FALSE) as receitas_total,

    -- Gastos do mês
    (SELECT COALESCE(SUM(valor), 0)
     FROM gastos
     WHERE DATE_TRUNC('month', data) = DATE_TRUNC('month', CURRENT_DATE)
       AND deletado = FALSE) as gastos_mes,

    -- Parcelas ativas
    (SELECT COALESCE(SUM(valor_parcela), 0)
     FROM compras_parceladas
     WHERE finalizada = FALSE
       AND deletado = FALSE) as parcelas_mes,

    -- Gasolina do mês
    (SELECT COALESCE(SUM(valor), 0)
     FROM gasolina
     WHERE DATE_TRUNC('month', data) = DATE_TRUNC('month', CURRENT_DATE)
       AND deletado = FALSE) as gasolina_mes,

    -- Assinaturas ativas
    (SELECT COALESCE(SUM(valor), 0)
     FROM assinaturas
     WHERE ativa = TRUE
       AND deletado = FALSE) as assinaturas_mes,

    -- Contas fixas ativas
    (SELECT COALESCE(SUM(valor), 0)
     FROM contas_fixas
     WHERE ativa = TRUE
       AND deletado = FALSE) as contas_fixas_mes,

    -- Ferramentas ativas
    (SELECT COALESCE(SUM(valor), 0)
     FROM ferramentas_ia_dev
     WHERE deletado = FALSE) as ferramentas_mes,

    NOW() as atualizado_em;

-- Índice único para REFRESH CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_dashboard_mes ON mv_dashboard_mensal(mes_referencia);

-- PASSO 25: Criar função para refresh das views
-- ============================================
CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_mensal;
EXCEPTION
    WHEN OTHERS THEN
        REFRESH MATERIALIZED VIEW mv_dashboard_mensal;
END;
$$ LANGUAGE plpgsql;

-- PASSO 26: Criar funções soft_delete genéricas
-- ============================================
CREATE OR REPLACE FUNCTION soft_delete(
    p_tabela TEXT,
    p_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    v_usuario_id := auth.uid();

    EXECUTE format('
        UPDATE %I
        SET deletado = TRUE,
            deletado_em = NOW(),
            deletado_por = $1
        WHERE id = $2 AND (deletado = FALSE OR deletado IS NULL)
    ', p_tabela)
    USING v_usuario_id, p_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION soft_undelete(
    p_tabela TEXT,
    p_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    EXECUTE format('
        UPDATE %I
        SET deletado = FALSE,
            deletado_em = NULL,
            deletado_por = NULL
        WHERE id = $1 AND deletado = TRUE
    ', p_tabela)
    USING p_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 27: Habilitar RLS em todas as tabelas
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE familia_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_parceladas ENABLE ROW LEVEL SECURITY;
ALTER TABLE gasolina ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferramentas_ia_dev ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE emprestimos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividas ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrimonio ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividas_internas ENABLE ROW LEVEL SECURITY;

-- PASSO 28: Criar RLS Policies básicas
-- ============================================

-- Users: ver próprio perfil
CREATE POLICY users_select_own ON users
  FOR SELECT USING (id = auth.uid() OR ativo = TRUE);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (id = auth.uid());

-- Gastos: ver próprios gastos e da família
CREATE POLICY gastos_select ON gastos
  FOR SELECT USING (
    deletado = FALSE AND (
      usuario_id = auth.uid() OR
      (privado = FALSE AND familia_id IN (
        SELECT familia_id FROM familia_membros
        WHERE usuario_id = auth.uid() AND deletado = FALSE
      ))
    )
  );

CREATE POLICY gastos_insert ON gastos
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY gastos_update ON gastos
  FOR UPDATE USING (usuario_id = auth.uid());

-- Dívidas internas: ver apenas da própria família
CREATE POLICY dividas_select ON dividas_internas
  FOR SELECT USING (
    familia_id IN (
      SELECT familia_id FROM familia_membros
      WHERE usuario_id = auth.uid() AND deletado = FALSE
    )
  );

CREATE POLICY dividas_insert ON dividas_internas
  FOR INSERT WITH CHECK (
    familia_id IN (
      SELECT familia_id FROM familia_membros
      WHERE usuario_id = auth.uid() AND deletado = FALSE
    )
  );

CREATE POLICY dividas_update ON dividas_internas
  FOR UPDATE USING (
    credor_id = auth.uid() OR devedor_id = auth.uid()
  );

-- PASSO 29: Popular Materialized View
-- ============================================
REFRESH MATERIALIZED VIEW mv_dashboard_mensal;

-- PASSO 30: Verificação final
-- ============================================
SELECT
  'users' as tabela, COUNT(*) as registros FROM users
UNION ALL
SELECT 'familias', COUNT(*) FROM familias
UNION ALL
SELECT 'categorias', COUNT(*) FROM categorias
UNION ALL
SELECT 'gastos', COUNT(*) FROM gastos
UNION ALL
SELECT 'dividas_internas', COUNT(*) FROM dividas_internas
UNION ALL
SELECT 'mv_dashboard_mensal', COUNT(*) FROM mv_dashboard_mensal;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ CORREÇÃO COMPLETA APLICADA COM SUCESSO!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Estrutura criada:';
  RAISE NOTICE '   - 18 tabelas principais';
  RAISE NOTICE '   - Todas com UUID como ID';
  RAISE NOTICE '   - Soft delete implementado';
  RAISE NOTICE '   - Índices otimizados';
  RAISE NOTICE '   - RLS habilitado';
  RAISE NOTICE '   - Triggers configurados';
  RAISE NOTICE '   - Materialized Views criadas';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Próximos passos:';
  RAISE NOTICE '   1. Regenerar types: npx supabase gen types typescript';
  RAISE NOTICE '   2. Atualizar hooks para usar UUID';
  RAISE NOTICE '   3. Testar aplicação';
  RAISE NOTICE '';
END $$;
