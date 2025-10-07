-- Adicionar colunas faltantes na tabela familia_membros
ALTER TABLE public.familia_membros 
ADD COLUMN IF NOT EXISTS deletado_por uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT NOW();

-- Adicionar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger na tabela familia_membros se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_familia_membros_updated_at'
    ) THEN
        CREATE TRIGGER update_familia_membros_updated_at
            BEFORE UPDATE ON public.familia_membros
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'familia_membros' 
ORDER BY ordinal_position;
