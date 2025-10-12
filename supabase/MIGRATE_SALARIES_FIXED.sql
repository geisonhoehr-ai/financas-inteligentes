-- ============================================
-- MIGRAÇÃO DE DADOS: salaries → salarios (ESTRUTURAS DIFERENTES)
-- ============================================
-- Migra e transforma dados da tabela antiga para o novo modelo
-- Data: 12/10/2025

-- ============================================
-- DIFERENÇAS DE ESTRUTURA
-- ============================================
-- ANTIGA (salaries):
--   - descricao (varchar)
--   - mes_referencia (date)
--   - tipo (varchar)
--   - familia_id (uuid)
--   - visivel_familia (boolean)
--   - deletado (boolean)
--
-- NOVA (salarios):
--   - nome_pessoa (text) <- vem de descricao
--   - dia_recebimento (integer) <- extrair de mes_referencia
--   - ativo (boolean) <- inverso de deletado

-- ============================================
-- 1. VERIFICAR ESTADO ATUAL
-- ============================================

SELECT 'ANTES - salaries (antiga)' as status, COUNT(*) as total
FROM public.salaries
WHERE deletado = false OR deletado IS NULL;

SELECT 'ANTES - salarios (nova)' as status, COUNT(*) as total
FROM public.salarios;

-- ============================================
-- 2. MIGRAR DADOS COM TRANSFORMAÇÃO
-- ============================================

INSERT INTO public.salarios (
  id,
  usuario_id,
  nome_pessoa,
  valor,
  dia_recebimento,
  ativo,
  created_at
)
SELECT
  id,
  usuario_id,
  COALESCE(descricao, 'Salário') as nome_pessoa, -- descricao → nome_pessoa
  valor,
  COALESCE(EXTRACT(DAY FROM mes_referencia)::integer, 1) as dia_recebimento, -- extrair dia do mês
  NOT COALESCE(deletado, false) as ativo, -- inverter: deletado=false → ativo=true
  created_at
FROM public.salaries
WHERE (deletado = false OR deletado IS NULL) -- Só migrar registros não deletados
  AND NOT EXISTS (
    -- Evitar duplicatas
    SELECT 1 FROM public.salarios
    WHERE salarios.id = salaries.id
  );

-- ============================================
-- 3. VERIFICAR RESULTADO
-- ============================================

-- Contar registros migrados
SELECT 'DEPOIS - salaries (antiga)' as status, COUNT(*) as total, SUM(valor) as soma_valores
FROM public.salaries
WHERE deletado = false OR deletado IS NULL;

SELECT 'DEPOIS - salarios (nova)' as status, COUNT(*) as total, SUM(valor) as soma_valores
FROM public.salarios;

-- Ver alguns exemplos migrados
SELECT
  id,
  nome_pessoa,
  valor,
  dia_recebimento,
  ativo,
  created_at
FROM public.salarios
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 4. VALIDAÇÃO
-- ============================================

-- Verificar se algum registro ficou sem nome_pessoa
SELECT COUNT(*) as registros_sem_nome
FROM public.salarios
WHERE nome_pessoa IS NULL OR nome_pessoa = '';

-- Verificar se todos estão ativos
SELECT
  ativo,
  COUNT(*) as quantidade
FROM public.salarios
GROUP BY ativo;

-- ============================================
-- 5. OPCIONAL: BACKUP E REMOÇÃO DA TABELA ANTIGA
-- ============================================

-- ⚠️ ATENÇÃO: Só execute DEPOIS de confirmar que:
-- 1. A migração funcionou (contagens batem)
-- 2. A aplicação está funcionando com a tabela nova
-- 3. Você fez backup dos dados

-- -- Criar backup antes de deletar
-- CREATE TABLE salaries_backup AS SELECT * FROM public.salaries;

-- -- Remover tabela antiga
-- DROP TABLE IF EXISTS public.salaries CASCADE;

-- ============================================
-- RESULTADO ESPERADO
-- ============================================
-- ✅ Todos os registros ativos de 'salaries' foram migrados
-- ✅ descricao → nome_pessoa
-- ✅ mes_referencia → dia_recebimento (dia do mês)
-- ✅ deletado=false → ativo=true
-- ✅ Os totais de valores batem
