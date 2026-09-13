import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RecipeWorkbench } from "../RecipeWorkbench";
import styles from "../receitas.module.css";

export default function NovaReceitaPage() {
  return (
    <AppShell title="Nova ficha técnica" eyebrow="Receitas · Produção · HACCP">
      <div className="content">
        <div className={styles.page}>
          <div className={styles.hero}>
            <div>
              <h2>Construir ficha técnica</h2>
              <p>Defina rendimento, ingredientes, desperdícios, processos, custos e controlos HACCP num único fluxo operacional.</p>
            </div>
            <Link href="/receitas" className={styles.secondary}>← Voltar às receitas</Link>
          </div>
          <RecipeWorkbench />
        </div>
      </div>
    </AppShell>
  );
}
