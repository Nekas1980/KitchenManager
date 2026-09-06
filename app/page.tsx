import { AppShell } from "@/components/AppShell";

const metrics = [
  { label: "Valor em stock", value: "€ 12 480,35", trend: "+4,8%", tone: "green" },
  { label: "Vendas do mês", value: "€ 8 960,20", trend: "+12,4%", tone: "blue" },
  { label: "Compras do mês", value: "€ 4 215,60", trend: "-2,1%", tone: "amber" },
  { label: "Stock baixo", value: "7 produtos", trend: "Ação necessária", tone: "red" },
];

const stock = [
  { product: "Farinha T55", category: "Ingredientes", current: "8 kg", minimum: "15 kg", status: "Crítico" },
  { product: "Café em grão", category: "Café", current: "4 kg", minimum: "6 kg", status: "Baixo" },
  { product: "Leite meio-gordo", category: "Ingredientes", current: "18 L", minimum: "20 L", status: "Baixo" },
  { product: "Água 0,5 L", category: "Bebidas", current: "42 un.", minimum: "24 un.", status: "Normal" },
];

const activity = [
  ["Compra #1048", "Fornecedor Algarve", "€ 486,20", "Hoje, 09:42"],
  ["Venda #2081", "Balcão", "€ 38,60", "Hoje, 09:18"],
  ["Ajuste de stock", "Farinha T55", "-2 kg", "Ontem, 18:30"],
  ["Nova receita", "Bacalhau à Brás", "12 doses", "Ontem, 16:05"],
];

export default function Dashboard() {
  return (
    <AppShell title="Dashboard" eyebrow="Visão geral">
        <div className="content">
          <div className="intro"><div><h2>Bom dia</h2><p>Acompanhe os indicadores principais da operação.</p></div><button>+ Registar compra</button></div>
          <div className="metrics">
            {metrics.map((metric) => <article className={`metric ${metric.tone}`} key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong><span>{metric.trend}</span></article>)}
          </div>

          <div className="grid">
            <article className="panel chart-panel">
              <div className="panel-title"><div><h3>Compras e vendas</h3><p>Evolução dos últimos seis meses</p></div><select aria-label="Período"><option>6 meses</option></select></div>
              <div className="chart" aria-label="Gráfico demonstrativo de compras e vendas">
                {[42, 55, 48, 67, 61, 82].map((h, i) => <div className="bars" key={i}><span style={{height: `${h * .72}%`}}></span><b style={{height: `${h}%`}}></b><small>{['Abr','Mai','Jun','Jul','Ago','Set'][i]}</small></div>)}
              </div>
              <div className="legend"><span><i className="sales"></i>Vendas</span><span><i className="purchases"></i>Compras</span></div>
            </article>

            <article className="panel quick"><div className="panel-title"><div><h3>Ações rápidas</h3><p>Operações frequentes</p></div></div>
              <div className="quick-grid">{['Novo produto', 'Nova compra', 'Nova receita', 'Registar venda'].map((x, i) => <button key={x}><span>{['P','C','R','V'][i]}</span>{x}</button>)}</div>
            </article>
          </div>

          <article className="panel table-panel">
            <div className="panel-title"><div><h3>Estado do stock</h3><p>Produtos que exigem acompanhamento</p></div><button className="link-button">Ver todo o stock →</button></div>
            <div className="table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Stock atual</th><th>Stock mínimo</th><th>Estado</th></tr></thead><tbody>
              {stock.map(row => <tr key={row.product}><td><strong>{row.product}</strong></td><td>{row.category}</td><td>{row.current}</td><td>{row.minimum}</td><td><span className={`status ${row.status.toLowerCase()}`}>{row.status}</span></td></tr>)}
            </tbody></table></div>
          </article>

          <article className="panel activity"><div className="panel-title"><div><h3>Atividade recente</h3><p>Últimos movimentos registados</p></div></div>
            {activity.map(item => <div className="activity-row" key={item[0]}><span>{item[0].charAt(0)}</span><div><strong>{item[0]}</strong><small>{item[1]}</small></div><b>{item[2]}</b><time>{item[3]}</time></div>)}
          </article>
        </div>
    </AppShell>
  );
}
