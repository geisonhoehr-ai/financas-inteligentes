# Sistema de Dívidas Internas e Responsabilidade de Gastos

## Problema Real
**Cenário**: Usuário estourou o limite do cartão e fez uma compra parcelada no cartão da esposa. A dívida é dele, mas está no cartão dela.

## Solução Implementada

### 1. Campos Adicionais em Gastos
```sql
ALTER TABLE gastos ADD COLUMN pago_por UUID REFERENCES users(id);
ALTER TABLE gastos ADD COLUMN responsavel_por UUID REFERENCES users(id);
ALTER TABLE gastos ADD COLUMN percentual_divisao JSONB; -- Para dividir entre múltiplos membros
```

### 2. Tabela de Dívidas Internas
```sql
CREATE TABLE dividas_internas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID REFERENCES familias(id) NOT NULL,
  credor_id UUID REFERENCES users(id) NOT NULL, -- Quem pagou
  devedor_id UUID REFERENCES users(id) NOT NULL, -- Quem deve
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  gasto_original_id UUID REFERENCES gastos(id), -- Link com o gasto original
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, paga, cancelada
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_pagamento TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dividas_familia ON dividas_internas(familia_id);
CREATE INDEX idx_dividas_credor ON dividas_internas(credor_id);
CREATE INDEX idx_dividas_devedor ON dividas_internas(devedor_id);
```

### 3. View de Resumo de Dívidas
```sql
CREATE OR REPLACE VIEW resumo_dividas AS
SELECT 
  familia_id,
  credor_id,
  devedor_id,
  SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as total_pendente,
  SUM(CASE WHEN status = 'paga' THEN valor ELSE 0 END) as total_pago,
  COUNT(CASE WHEN status = 'pendente' THEN 1 END) as qtd_pendente
FROM dividas_internas
GROUP BY familia_id, credor_id, devedor_id;
```

### 4. Funcionalidades

#### A. Registrar Gasto com Responsabilidade Diferente
- Ao criar um gasto, pode indicar:
  - **Pago por**: Maria (usou o cartão dela)
  - **Responsável**: João (quem realmente deve)
  - Sistema cria automaticamente uma dívida interna

#### B. Divisão de Gastos
- Dividir uma conta de restaurante:
  - João: 60%
  - Maria: 40%
- Sistema calcula automaticamente as dívidas proporcionais

#### C. Painel de Dívidas Internas
- Visualizar quanto você deve para cada membro
- Visualizar quanto cada membro te deve
- Marcar dívidas como pagas
- Histórico de acertos

#### D. Relatórios
- Saldo entre membros (quem deve para quem)
- Histórico de dívidas
- Sugestão de acertos (otimizar pagamentos)

### 5. Casos de Uso

#### Caso 1: Compra Parcelada no Cartão de Outro Membro
```
Situação: João estourou o limite, comprou TV parcelada no cartão da Maria
Solução:
- Cria gasto "TV Samsung 55"
- Valor: R$ 3.000,00 (12x R$ 250,00)
- Pago por: Maria
- Responsável: João
- Sistema cria parcelas e dívidas internas mensais
```

#### Caso 2: Dividir Conta do Restaurante
```
Situação: Jantar em família, João pagou, mas é conta de todos
Solução:
- Cria gasto "Jantar em Família"
- Valor: R$ 200,00
- Pago por: João
- Divisão: João 50%, Maria 30%, Filho 20%
- Sistema cria dívidas internas: Maria deve R$ 60, Filho deve R$ 40
```

#### Caso 3: Reembolso de Compra
```
Situação: Maria comprou remédios para João na farmácia
Solução:
- Cria gasto "Remédios"
- Pago por: Maria
- Responsável: João
- João pode marcar como "pago" quando reembolsar Maria
```

### 6. Interface do Usuário

#### Formulário de Gasto Aprimorado
```tsx
<Form>
  <Input name="descricao" />
  <Input name="valor" />
  <Select name="categoria" />
  
  {/* Novo: Quem pagou */}
  <Select name="pago_por" label="Pago por">
    <option value={user.id}>Eu</option>
    {membros.map(m => <option value={m.id}>{m.nome}</option>)}
  </Select>
  
  {/* Novo: Quem é responsável */}
  <Select name="responsavel_por" label="Responsável pelo gasto">
    <option value={user.id}>Eu</option>
    {membros.map(m => <option value={m.id}>{m.nome}</option>)}
    <option value="dividir">Dividir entre membros</option>
  </Select>
  
  {/* Se escolher dividir */}
  {responsavel === 'dividir' && (
    <DivisaoGasto membros={membros} />
  )}
</Form>
```

#### Painel de Dívidas
```tsx
<Card>
  <CardTitle>Você deve</CardTitle>
  <List>
    <Item>Maria: R$ 250,00 (TV - Parcela 1/12)</Item>
    <Item>João: R$ 45,00 (Pizza)</Item>
  </List>
  <Total>R$ 295,00</Total>
</Card>

<Card>
  <CardTitle>Devem para você</CardTitle>
  <List>
    <Item>Filho: R$ 40,00 (Restaurante)</Item>
  </List>
  <Total>R$ 40,00</Total>
</Card>

<Card>
  <CardTitle>Saldo Final</CardTitle>
  <Balance className="text-red-500">- R$ 255,00</Balance>
  <p>Você deve R$ 255,00 no total</p>
</Card>
```

### 7. Regras de Negócio

1. **Criação Automática de Dívidas**
   - Se `pago_por` ≠ `responsavel_por`, cria dívida interna automaticamente

2. **Parcelas**
   - Para compras parceladas, cria uma dívida para cada parcela
   - Atualiza mensalmente o status

3. **Notificações**
   - Notificar quando uma nova dívida é criada
   - Lembrete mensal de dívidas pendentes
   - Confirmação quando dívida é marcada como paga

4. **Dashboard**
   - Mostrar saldo de dívidas no dashboard principal
   - Alertas para dívidas altas

5. **Relatórios**
   - Incluir dívidas internas nos relatórios financeiros
   - Separar "gastos pagos por mim" de "gastos de minha responsabilidade"

### 8. Otimização de Acertos

**Algoritmo de Simplificação de Dívidas**
```
Exemplo:
- João deve R$ 100 para Maria
- Maria deve R$ 80 para João

Simplificado:
- João deve R$ 20 para Maria
```

Sistema sugere acertos otimizados para minimizar número de transferências.

### 9. Segurança

- RLS: Apenas membros da mesma família veem as dívidas
- Apenas o credor ou devedor pode marcar dívida como paga
- Admin da família pode gerenciar todas as dívidas

### 10. Implementação em Fases

**Fase 1** (Atual):
- ✅ Campos `pago_por` e `responsavel_por` em gastos
- ✅ Tabela `dividas_internas`
- ✅ CRUD básico de dívidas

**Fase 2**:
- Divisão percentual de gastos
- Painel de dívidas internas
- Marcar dívidas como pagas

**Fase 3**:
- Algoritmo de otimização de acertos
- Notificações automáticas
- Relatórios avançados

**Fase 4**:
- Histórico de acertos
- Integração com PIX para pagamentos
- Recorrência de dívidas (ex: mesada)

