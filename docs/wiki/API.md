# API

## Rotas planeadas

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/dashboard` | Resumo do dashboard |
| GET | `/api/dashboard/evolucao-mensal` | Série mensal |
| GET/POST | `/api/produtos` | Listar e criar produtos |
| PUT/DELETE | `/api/produtos/:id` | Atualizar e eliminar produto |
| GET/POST | `/api/fornecedores` | Gestão de fornecedores |
| GET/POST | `/api/compras` | Gestão de compras |
| GET | `/api/stock/baixo` | Produtos abaixo do mínimo |
| GET/POST | `/api/receitas` | Gestão de fichas técnicas |
| GET/POST | `/api/vendas` | Vendas internas demonstrativas |

Todas as entradas devem ser validadas e todas as queries devem utilizar parâmetros.
