# Fichas Técnicas e HACCP

## Objetivo

O módulo de Fichas Técnicas transforma cada receita numa unidade operacional completa: ingredientes, rendimentos, custos, processos, tempos, temperaturas, alergénios, requisitos HACCP e histórico de revisão.

## Estrutura da ficha técnica

### Identificação
- Código
- Nome
- Categoria
- Nº de doses / rendimento
- Peso final
- Peso da porção
- Estado
- Versão

### Ingredientes
Cada ingrediente deve guardar:
- quantidade bruta;
- quantidade líquida;
- unidade;
- desperdício percentual;
- custo unitário de referência;
- custo da linha;
- observações;
- ordem de apresentação.

### Processos de confeção
Cada etapa é independente e ordenada. Exemplos:
1. Mise en place;
2. Preparação;
3. Refogado;
4. Cozedura;
5. Arrefecimento;
6. Regeneração;
7. Finalização;
8. Empratamento.

Para cada processo devem existir descrição, tempo, temperatura, equipamento e observações.

## Cálculos

### Quantidade líquida
`quantidade_liquida = quantidade_bruta × (1 - desperdicio_pct / 100)`

### Custo do ingrediente
`custo_ingrediente = quantidade_liquida × custo_unitario`

### Custo total
Soma do custo de todos os ingredientes.

### Custo por dose
`custo_por_dose = custo_total / rendimento_doses`

### Food cost
`food_cost_pct = custo_por_dose / preco_venda_liquido × 100`

### Margem bruta percentual
`margem_pct = 100 - food_cost_pct`

## HACCP

A documentação HACCP deve ser tratada como fonte normativa versionada. Nunca substituir silenciosamente uma versão anterior.

### Documento
Regista título, entidade emissora, referência, área de aplicação e origem.

### Versão
Regista número da versão, publicação, entrada em vigor, fim de vigência, resumo de alterações, hash e estado.

### Requisito
Cada versão pode originar requisitos estruturados, incluindo:
- procedimento;
- limite crítico;
- monitorização;
- ação corretiva;
- registo;
- alergénio;
- rastreabilidade.

### Ligação à receita
Um requisito HACCP pode ser associado à ficha técnica e, opcionalmente, a um processo específico da confeção.

O estado operacional pode ser:
- conforme;
- rever;
- não conforme;
- não aplicável.

## Alergénios

O catálogo inicial inclui os 14 grupos regulamentares usados na UE para informação sobre alergénios. O sistema permite marcar a origem como ingrediente, contaminação cruzada ou indicação manual.

## Atualização normativa

Fluxo recomendado:
1. Receber documentação oficial;
2. Arquivar o documento sem alterar versões anteriores;
3. Criar nova versão;
4. Registar resumo das alterações;
5. Estruturar apenas os requisitos confirmados;
6. Identificar fichas técnicas afetadas;
7. Marcar fichas como `rever` quando necessário;
8. Rever e aprovar alterações;
9. Guardar histórico da revisão.

A atualização normativa não deve ser automática sem validação humana. O software pode detetar e sinalizar impacto, mas a interpretação e aprovação final devem ser efetuadas por responsável competente.

## Estrutura de interface proposta

`Receitas > Nova Ficha Técnica`

Separadores:
- Geral
- Ingredientes
- Preparação
- Processos e Tempos
- Custos
- HACCP e Alergénios
- Empratamento
- Histórico

Ações:
- Guardar
- Duplicar
- Calcular custo
- Rever HACCP
- Imprimir ficha técnica
- Exportar PDF

## Código desta implementação

- `sql/fichas-tecnicas-haccp.sql`: alterações de base de dados, processos, alergénios, HACCP, histórico e views.
- `app/lib/recipe-costs.ts`: funções TypeScript para quantidades, custos, food cost, margem e tempo total.

## Próximas etapas

1. Executar o SQL numa base de desenvolvimento/backup.
2. Validar nomes e tipos das colunas já existentes em `receitas`, `receita_ingredientes` e `produtos`.
3. Criar API CRUD das fichas técnicas.
4. Criar interface React/Next.js.
5. Adicionar importação controlada de documentação HACCP.
6. Criar mecanismo de revisão e alertas de impacto.
7. Criar impressão/PDF profissional da ficha técnica.
