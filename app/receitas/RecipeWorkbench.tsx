"use client";

import { useMemo, useState } from "react";
import {
  calculateCostPerPortion,
  calculateFoodCostPct,
  calculateGrossMarginPct,
  calculateNetQuantity,
  calculateRecipeCost,
} from "@/app/lib/recipe-costs";
import styles from "./receitas.module.css";

type Ingredient = {
  name: string;
  gross: number;
  unit: string;
  waste: number;
  unitCost: number;
};

type Process = {
  name: string;
  description: string;
  minutes: number;
  temperature: string;
};

const money = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

export function RecipeWorkbench() {
  const [name, setName] = useState("Nova ficha técnica");
  const [category, setCategory] = useState("Pratos principais");
  const [portions, setPortions] = useState(10);
  const [salePrice, setSalePrice] = useState(12.5);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "Ingrediente principal", gross: 1, unit: "kg", waste: 10, unitCost: 8.5 },
    { name: "Azeite", gross: 0.08, unit: "L", waste: 0, unitCost: 6.2 },
  ]);
  const [processes, setProcesses] = useState<Process[]>([
    { name: "Mise en place", description: "Preparar, pesar e organizar ingredientes.", minutes: 12, temperature: "—" },
    { name: "Confeção", description: "Executar o processo principal de confeção.", minutes: 25, temperature: "95 °C" },
  ]);

  const totals = useMemo(() => {
    const costs = ingredients.map((item) => ({
      quantityGross: item.gross,
      quantityNet: calculateNetQuantity(item.gross, item.waste),
      unitCost: item.unitCost,
      wastePct: item.waste,
    }));
    const totalCost = calculateRecipeCost(costs);
    const costPerPortion = portions > 0 ? calculateCostPerPortion(totalCost, portions) : 0;
    const foodCost = salePrice > 0 ? calculateFoodCostPct(costPerPortion, salePrice) : 0;
    const margin = salePrice > 0 ? calculateGrossMarginPct(costPerPortion, salePrice) : 0;
    const totalMinutes = processes.reduce((sum, process) => sum + Number(process.minutes || 0), 0);
    return { totalCost, costPerPortion, foodCost, margin, totalMinutes };
  }, [ingredients, portions, salePrice, processes]);

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((current) => current.map((item, i) => i === index ? {
      ...item,
      [field]: field === "name" || field === "unit" ? value : Number(value),
    } : item));
  }

  function updateProcess(index: number, field: keyof Process, value: string) {
    setProcesses((current) => current.map((item, i) => i === index ? {
      ...item,
      [field]: field === "minutes" ? Number(value) : value,
    } : item));
  }

  return (
    <div className={styles.editor}>
      <div className={styles.mainColumn}>
        <section className={styles.section}>
          <div className={styles.tabs}>
            <span className={`${styles.tab} ${styles.tabActive}`}>Geral</span>
            <span className={styles.tab}>Ingredientes</span>
            <span className={styles.tab}>Processos</span>
            <span className={styles.tab}>Custos</span>
            <span className={styles.tab}>HACCP</span>
          </div>
          <h3>Identificação da ficha</h3>
          <p>Dados base da receita e do rendimento operacional.</p>
          <div className={styles.grid2}>
            <div className={styles.field}><label>Nome da receita</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className={styles.field}><label>Categoria</label><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Pratos principais</option><option>Pastelaria</option><option>Entradas</option><option>Molhos e bases</option><option>Sobremesas</option></select></div>
            <div className={styles.field}><label>N.º de doses</label><input type="number" min="1" value={portions} onChange={(e) => setPortions(Number(e.target.value))} /></div>
            <div className={styles.field}><label>Preço de venda líquido / dose</label><input type="number" min="0" step="0.01" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} /></div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Ingredientes e rendimentos</h3>
          <p>O custo e a quantidade líquida são recalculados automaticamente.</p>
          <div className={styles.tableWrap}>
            <table className={styles.subtable}>
              <thead><tr><th>Ingrediente</th><th>Qtd. bruta</th><th>Un.</th><th>Desperdício %</th><th>Qtd. líquida</th><th>Custo unit.</th><th>Custo</th><th></th></tr></thead>
              <tbody>{ingredients.map((item, index) => {
                const net = calculateNetQuantity(item.gross, item.waste);
                const cost = net * item.unitCost;
                return <tr key={`${item.name}-${index}`}>
                  <td><input value={item.name} onChange={(e) => updateIngredient(index, "name", e.target.value)} /></td>
                  <td><input type="number" min="0" step="0.001" value={item.gross} onChange={(e) => updateIngredient(index, "gross", e.target.value)} /></td>
                  <td><select value={item.unit} onChange={(e) => updateIngredient(index, "unit", e.target.value)}><option>kg</option><option>g</option><option>L</option><option>ml</option><option>un.</option></select></td>
                  <td><input type="number" min="0" max="100" step="0.1" value={item.waste} onChange={(e) => updateIngredient(index, "waste", e.target.value)} /></td>
                  <td>{net.toFixed(3)}</td>
                  <td><input type="number" min="0" step="0.01" value={item.unitCost} onChange={(e) => updateIngredient(index, "unitCost", e.target.value)} /></td>
                  <td><strong>{money.format(cost)}</strong></td>
                  <td><button className={styles.secondary} onClick={() => setIngredients((current) => current.filter((_, i) => i !== index))}>×</button></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <div className={styles.actions}><button className={styles.secondary} onClick={() => setIngredients((current) => [...current, { name: "Novo ingrediente", gross: 0, unit: "kg", waste: 0, unitCost: 0 }])}>+ Adicionar ingrediente</button></div>
        </section>

        <section className={styles.section}>
          <h3>Processos de confeção</h3>
          <p>Registe cada etapa de forma independente para obter tempos e controlos operacionais.</p>
          <div className={styles.tableWrap}>
            <table className={styles.subtable}>
              <thead><tr><th>Etapa</th><th>Descrição</th><th>Tempo</th><th>Temperatura</th><th></th></tr></thead>
              <tbody>{processes.map((process, index) => <tr key={`${process.name}-${index}`}>
                <td><input value={process.name} onChange={(e) => updateProcess(index, "name", e.target.value)} /></td>
                <td><input value={process.description} onChange={(e) => updateProcess(index, "description", e.target.value)} /></td>
                <td><input type="number" min="0" value={process.minutes} onChange={(e) => updateProcess(index, "minutes", e.target.value)} /></td>
                <td><input value={process.temperature} onChange={(e) => updateProcess(index, "temperature", e.target.value)} /></td>
                <td><button className={styles.secondary} onClick={() => setProcesses((current) => current.filter((_, i) => i !== index))}>×</button></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className={styles.actions}><button className={styles.secondary} onClick={() => setProcesses((current) => [...current, { name: "Nova etapa", description: "", minutes: 0, temperature: "—" }])}>+ Adicionar processo</button></div>
        </section>

        <section className={styles.section}>
          <h3>HACCP e controlo</h3>
          <p>Área preparada para ser ligada às versões documentais e requisitos HACCP.</p>
          <div className={styles.grid2}>
            <div className={styles.field}><label>Versão HACCP aplicável</label><select><option>Por validar</option><option>HACCP 2026.09</option></select></div>
            <div className={styles.field}><label>Estado de conformidade</label><select><option>Rever</option><option>Conforme</option><option>Não conforme</option><option>Não aplicável</option></select></div>
            <div className={styles.field}><label>Temperatura mínima de serviço</label><input placeholder="Ex.: ≥ 65 °C" /></div>
            <div className={styles.field}><label>Conservação</label><input placeholder="Ex.: 0–5 °C" /></div>
          </div>
          <div className={styles.field} style={{ marginTop: 12 }}><label>Alergénios e observações</label><textarea placeholder="Selecionar alergénios e registar pontos de controlo..." /></div>
        </section>
      </div>

      <aside className={styles.sideColumn}>
        <section className={styles.section}>
          <h3>Resumo económico</h3>
          <p>{name}</p>
          <div className={styles.summary}>
            <div className={styles.summaryRow}><span>Custo total</span><strong>{money.format(totals.totalCost)}</strong></div>
            <div className={styles.summaryRow}><span>Custo por dose</span><strong>{money.format(totals.costPerPortion)}</strong></div>
            <div className={styles.summaryRow}><span>Food cost</span><strong>{totals.foodCost.toFixed(1)}%</strong></div>
            <div className={styles.summaryRow}><span>Margem bruta</span><strong>{totals.margin.toFixed(1)}%</strong></div>
            <div className={styles.summaryRow}><span>Tempo total</span><strong>{totals.totalMinutes} min</strong></div>
            <div className={styles.summaryTotal}><span>Venda prevista<br />({portions} doses)</span><strong>{money.format(portions * salePrice)}</strong></div>
          </div>
        </section>
        <div className={styles.alert}><strong>HACCP pendente de validação.</strong><br />O sistema pode sinalizar alterações normativas, mas a aprovação final deve permanecer humana.</div>
        <button className={styles.primary}>Guardar ficha técnica</button>
        <button className={styles.secondary}>Guardar como rascunho</button>
      </aside>
    </div>
  );
}
