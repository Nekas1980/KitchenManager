# Orientações para agentes de IA

## Objetivo

Desenvolver o KitchenManager de forma incremental, segura e documentada.

## Regras

- Utilizar português de Portugal na interface e documentação.
- Não incluir dados reais de clientes, credenciais ou ficheiros `.env`.
- Preservar o schema PostgreSQL `kitchenmanager`.
- Utilizar TypeScript estrito, componentes acessíveis e interface responsiva.
- Validar dados na API e parametrizar todas as queries.
- Executar `npm run lint` e `npm run build` antes de concluir alterações.
- Atualizar o README ou a documentação quando a arquitetura mudar.

## Responsabilidades sugeridas

- Agente frontend: componentes, acessibilidade e responsividade.
- Agente API: validação, rotas e tratamento de erros.
- Agente PostgreSQL: schema, Views, índices e transações.
- Agente QA: lint, build, testes e fluxos críticos.
- Agente documentação: README, Wiki e decisões técnicas.
