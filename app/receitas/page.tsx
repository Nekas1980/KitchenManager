import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import styles from "./receitas.module.css";

const recipes = [
  { name: "Bacalhau à Brás", category: "Pratos principais", yield: "12 doses", cost: "€ 38,40", portion: "€ 3,20", status: "Ativa" },
  { name: "Pastel de nata", category: "Pastelaria", yield: "24 un.", cost: "€ 10,80", portion: "€ 0,45", status: "Ativa" },
  { name: "Bolo de laranja", category: "Pastelaria", yield: "12 fatias", cost: "€ 7,92", portion: "€ 0,66", status: "Rever HACCP" },
];

export default function ReceitasPage() {
  return (
    <AppShell title="Receitas" eyebrow="Produção · Custos · HACCP">
      <div className="content">
        <div className={styles.page}>
          <div className={styles.hero}>
            <div>
              <h2>Fichas técnicas</h2>
              <p>Centralize receitas, rendimentos, desperdícios, processos de confeção, tempos, custos e controlo HACCP.</p>
            </div>
            <Link href="/receitas/nova" className={styles.primary}>+ Nova ficha técnica</Link>
          </div>

          <div className={styles.metrics}>
            <article className={styles.metric}><span>Fichas técnicas</span><strong>36</strong></article>
            <article className={styles.metric}><span>Custo médio / receita</span><strong>€ 8,42</strong></article>
            <article className={styles.metric}><span>A rever</span><strong>4</strong></article>
            <article className={styles.metric}><span>HACCP conforme</span><strong>88%</strong></article>
          </div>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div><h3>Receitas e fichas técnicas</h3><p>Dados demonstrativos até à ligação da API PostgreSQL.</p></div>
              <div className={styles.toolbar}>
                <input aria-label="Pesquisar receitas" placeholder="Pesquisar receita..." />
                <button className={styles.secondary}>Filtros</button>
                <button className={styles.secondary}>Exportar</button>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Receita</th><th>Categoria</th><th>Rendimento</th><th>Custo total</th><th>Custo/dose</th><th>Estado</th></tr></thead>
                <tbody>
                  {recipes.map((recipe) => (
                    <tr key={recipe.name}>
                      <td><strong>{recipe.name}</strong></td>
                      <td>{recipe.category}</td>
                      <td>{recipe.yield}</td>
                      <td>{recipe.cost}</td>
                      <td>{recipe.portion}</td>
                      <td><span className={recipe.status === "Ativa" ? styles.badge : styles.badgeWarning}>{recipe.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
