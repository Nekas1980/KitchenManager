# Modelo de dados

```mermaid
flowchart TD
    C[Categorias] --> P[Produtos]
    F[Fornecedores] --> CO[Compras]
    CO --> CI[Itens de compra]
    CI --> P
    R[Receitas] --> RI[Ingredientes]
    RI --> P
    V[Vendas] --> VI[Itens de venda]
    VI --> P
    P --> MS[Movimentos de stock]
```

## Entidades

| Entidade | Finalidade |
|---|---|
| categorias | Classificação dos produtos |
| produtos | Ingredientes, bebidas e produtos acabados |
| fornecedores | Entidades fornecedoras |
| compras / compra_itens | Registo das entradas adquiridas |
| receitas / receita_ingredientes | Fichas técnicas e respetivos componentes |
| movimentos_stock | Entradas, saídas e ajustes |
| vendas / venda_itens | Vendas internas demonstrativas |
