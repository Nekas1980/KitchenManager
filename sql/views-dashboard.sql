CREATE OR REPLACE VIEW kitchenmanager.vw_dashboard_resumo AS
SELECT
    (SELECT COUNT(*) FROM kitchenmanager.produtos WHERE ativo = TRUE) AS total_produtos,
    (SELECT COUNT(*) FROM kitchenmanager.categorias) AS total_categorias,
    (SELECT COUNT(*) FROM kitchenmanager.fornecedores) AS total_fornecedores,
    (SELECT COUNT(*) FROM kitchenmanager.compras) AS total_compras,
    (SELECT COUNT(*) FROM kitchenmanager.vendas) AS total_vendas,
    (SELECT COALESCE(SUM(stock_atual * preco_compra), 0)
       FROM kitchenmanager.produtos WHERE ativo = TRUE) AS valor_stock,
    (SELECT COALESCE(SUM(total), 0) FROM kitchenmanager.compras) AS valor_total_compras,
    (SELECT COALESCE(SUM(subtotal + iva), 0) FROM kitchenmanager.vendas) AS valor_total_vendas;

CREATE OR REPLACE VIEW kitchenmanager.vw_stock_baixo AS
SELECT
    p.id,
    p.nome AS produto,
    c.nome AS categoria,
    p.unidade,
    p.stock_atual,
    p.stock_minimo,
    p.stock_minimo - p.stock_atual AS quantidade_em_falta,
    p.preco_compra
FROM kitchenmanager.produtos p
LEFT JOIN kitchenmanager.categorias c ON c.id = p.categoria_id
WHERE p.ativo = TRUE AND p.stock_atual <= p.stock_minimo
ORDER BY p.stock_atual ASC;

CREATE OR REPLACE VIEW kitchenmanager.vw_dashboard_evolucao_mensal AS
WITH compras AS (
    SELECT DATE_TRUNC('month', data_compra)::date AS mes, SUM(total) AS total_compras
    FROM kitchenmanager.compras GROUP BY 1
), vendas AS (
    SELECT DATE_TRUNC('month', data_venda)::date AS mes, SUM(subtotal + iva) AS total_vendas
    FROM kitchenmanager.vendas GROUP BY 1
)
SELECT
    COALESCE(c.mes, v.mes) AS mes,
    COALESCE(c.total_compras, 0) AS total_compras,
    COALESCE(v.total_vendas, 0) AS total_vendas
FROM compras c
FULL OUTER JOIN vendas v ON c.mes = v.mes
ORDER BY mes;
