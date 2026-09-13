# CODEX FRONTEND HANDOFF — KitchenManager

## Objetivo
Continuar o módulo `Receitas / Fichas Técnicas / HACCP` sem alterar a filosofia visual do KitchenManager.

## Branch de trabalho
`feature/fichas-tecnicas-haccp`

## Estado atual
- `app/receitas/page.tsx`: dashboard/listagem de fichas técnicas.
- `app/receitas/nova/page.tsx`: entrada para criação de uma nova ficha.
- `app/receitas/RecipeWorkbench.tsx`: editor interativo.
- `app/receitas/receitas.module.css`: estilos isolados do módulo.
- `app/lib/recipe-costs.ts`: funções de cálculo.
- `sql/fichas-tecnicas-haccp.sql`: modelo SQL proposto.

## O que já funciona no frontend
- edição de nome, categoria, doses e preço de venda;
- ingredientes dinâmicos;
- desperdício e quantidade líquida;
- custo por ingrediente;
- custo total e custo por dose;
- food cost e margem bruta;
- processos de confeção dinâmicos;
- tempo total;
- área HACCP preparada para ligação ao backend;
- layout responsivo compatível com AppShell.

## Melhorias prioritárias
1. Executar `npm install`, `npm run lint` e `npm run build` e corrigir qualquer erro real antes de merge.
2. Não ligar ainda a uma base de produção.
3. Criar API Route Handlers para CRUD de receitas, ingredientes e processos.
4. Escolher e implementar a camada PostgreSQL (Prisma apenas se a decisão for confirmada; atualmente o README diz que é previsto).
5. Substituir dados demonstrativos da página `/receitas` por dados reais da API.
6. Fazer o botão `Guardar ficha técnica` persistir tudo numa transação.
7. Implementar validação de formulário, estados loading/error/success e confirmação antes de remover linhas.
8. Criar página `/receitas/[id]` para consultar/editar uma ficha existente.
9. Criar catálogo selecionável de alergénios e ligação às versões HACCP.
10. Adicionar testes unitários para `recipe-costs.ts` e testes do fluxo de criação.
11. Implementar impressão/exportação PDF apenas depois do CRUD estar estável.
12. Garantir acessibilidade: labels ligadas aos inputs, foco, navegação por teclado e mensagens de erro.

## Regras de segurança
- Nunca incluir `.env`, passwords ou dados reais de clientes no GitHub.
- Usar queries parametrizadas.
- Fazer backup antes de executar migrações SQL estruturais.
- Não interpretar automaticamente uma norma HACCP como validada; exigir revisão humana.
- Manter versões antigas da documentação HACCP.

## Pedido ao Codex
Analisa o código completo desta branch. Primeiro executa lint/build e apresenta os problemas encontrados. Corrige apenas problemas que possas justificar pelo código existente. Depois prepara o backend CRUD das fichas técnicas, mas não executes migrações destrutivas nem alteres bases de dados de produção. Mantém a UI atual e reutiliza AppShell e os estilos existentes sempre que possível. Trabalha em commits pequenos e descreve cada alteração.
