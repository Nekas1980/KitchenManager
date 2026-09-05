# KitchenManager

Aplicação de gestão operacional para pastelarias, cafés e pequenos restaurantes. O projeto acompanha o fluxo **Compra → Stock → Produção → Custo → Venda → Margem**.

> Estado: versão demonstrativa em desenvolvimento. Não constitui software de faturação certificado.

## Objetivos

- Centralizar produtos, categorias e fornecedores.
- Registar compras, vendas internas e movimentos de stock.
- Criar fichas técnicas e calcular custos por unidade ou dose.
- Identificar stock baixo e apoiar decisões de aprovisionamento.
- Disponibilizar dashboards e relatórios de gestão.

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript e Tailwind CSS |
| API | Route Handlers do Next.js / Node.js |
| Base de dados | PostgreSQL, schema `kitchenmanager` |
| ORM previsto | Prisma |
| Aplicação desktop | Electron, numa fase posterior |

## Dashboard inicial

O protótipo inclui indicadores de valor em stock, compras, vendas e produtos com stock baixo, bem como evolução mensal, ações rápidas e atividade recente. Os valores apresentados são fictícios.

## Módulos planeados

- Dashboard
- Produtos e categorias
- Fornecedores e compras
- Stock e movimentos
- Receitas e fichas técnicas
- Vendas internas demonstrativas
- Relatórios de compras, vendas, stock e rentabilidade
- Backups e configuração por cliente

## Executar localmente

Requisitos: Node.js 24 e npm 11 ou versões compatíveis.

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estrutura

```text
app/                 Interface e rotas Next.js
docs/wiki/           Conteúdo preparado para a Wiki
sql/                 Views e scripts PostgreSQL
public/              Recursos visuais
```

## Base de dados

O modelo utiliza o schema `kitchenmanager` e as entidades: categorias, produtos, fornecedores, compras, compra_itens, receitas, receita_ingredientes, movimentos_stock, vendas e venda_itens.

Cada cliente deverá ter uma base de dados independente. Dados reais só devem ser inseridos com autorização e nunca publicados no repositório.

## Roadmap

1. Validar tabelas, chaves estrangeiras, índices e Views.
2. Ligar o dashboard à API e substituir os dados demonstrativos.
3. Implementar CRUD de produtos, categorias e fornecedores.
4. Implementar compras, stock, receitas e vendas.
5. Adicionar autenticação, testes e backups automáticos.
6. Preparar Electron, instalador e demonstração comercial.

## Documentação

Consulte a pasta [`docs/wiki`](docs/wiki/Home.md), preparada para publicação na Wiki do GitHub.

## Segurança

- Nunca incluir palavras-passe ou ficheiros `.env` no GitHub.
- Utilizar queries parametrizadas para prevenir SQL Injection.
- Separar dados de demonstração e dados de clientes.
- Criar cópias de segurança antes de alterações estruturais.

## Licença

Ainda não definida. Até ser adicionada uma licença, todos os direitos permanecem reservados ao autor.
