-- Adicionar campo 'pago' nas tabelas financeiras

-- Adicionar campo pago na tabela gastos
ALTER TABLE gastos 
ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT false;

-- Adicionar campo pago na tabela contas_fixas
ALTER TABLE contas_fixas 
ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT false;

-- Adicionar campo pago na tabela parcelas
ALTER TABLE parcelas 
ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT false;

-- Adicionar campo pago na tabela salarios
ALTER TABLE salarios 
ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT false;

-- Adicionar data_pagamento caso não exista
ALTER TABLE gastos 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

ALTER TABLE contas_fixas 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

ALTER TABLE parcelas 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

ALTER TABLE salarios 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

-- Criar índices para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_gastos_pago ON gastos(pago);
CREATE INDEX IF NOT EXISTS idx_contas_fixas_pago ON contas_fixas(pago);
CREATE INDEX IF NOT EXISTS idx_parcelas_pago ON parcelas(pago);
CREATE INDEX IF NOT EXISTS idx_salarios_pago ON salarios(pago);

-- Comentários
COMMENT ON COLUMN gastos.pago IS 'Indica se o gasto foi pago';
COMMENT ON COLUMN contas_fixas.pago IS 'Indica se a conta fixa foi paga no mês atual';
COMMENT ON COLUMN parcelas.pago IS 'Indica se a parcela foi paga';
COMMENT ON COLUMN salarios.pago IS 'Indica se o salário foi recebido';

