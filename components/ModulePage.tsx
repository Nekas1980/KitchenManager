import { AppShell } from "./AppShell";

type ModulePageProps = {
  title: string;
  description: string;
  action: string;
  metrics: Array<[string, string]>;
  columns: string[];
  rows: string[][];
};

function statusClass(value: string) {
  return `status ${value.toLocaleLowerCase("pt-PT")}`;
}

export function ModulePage({ title, description, action, metrics, columns, rows }: ModulePageProps) {
  return (
    <AppShell title={title}>
      <div className="content">
        <div className="intro"><div><h2>{title}</h2><p>{description}</p></div><button>+ {action}</button></div>
        <div className="module-metrics">
          {metrics.map(([label, value]) => <article className="mini-metric" key={label}><span>{label}</span><strong>{value}</strong></article>)}
        </div>
        <article className="panel module-panel">
          <div className="module-toolbar">
            <input aria-label={`Pesquisar em ${title}`} placeholder={`Pesquisar em ${title.toLowerCase()}...`} />
            <button>Filtros</button><button>Exportar</button>
          </div>
          <div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>
            {rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => {
              const isStateCell = columns[cellIndex]?.toLocaleLowerCase("pt-PT") === "estado";
              return <td key={`${rowIndex}-${cellIndex}`}>{cellIndex === 0 ? <strong>{cell}</strong> : isStateCell ? <span className={statusClass(cell)}>{cell}</span> : cell}</td>;
            })}</tr>)}
          </tbody></table></div>
          <div className="table-footer"><span>{rows.length} registos demonstrativos</span><div><button disabled>Anterior</button><button>Seguinte</button></div></div>
        </article>
      </div>
    </AppShell>
  );
}
