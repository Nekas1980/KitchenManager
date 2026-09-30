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

type IngredientOrigin = "Compra" | "Stock" | "Aproveitamento";

type Ingredient = {
  name: string;
  gross: number;
  unit: string;
  waste: number;
  unitCost: number;
  origin: IngredientOrigin;
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
    { name: "Ingrediente principal", gross: 1, unit: "kg", waste: 10, unitCost: 8.5, origin: "Compra" },
    { name: "Azeite", gross: 0.08, unit: "L", waste: 0, unitCost: 6.2, origin: "Compra" },
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
    const reusedCost = ingredients.reduce(
      (sum, item) => sum + (item.origin === "Aproveitamento" ? item.gross * item.unitCost : 0),
      0,
    );
    const totalMinutes = processes.reduce((sum, process) => sum + Number(process.minutes || 0), 0);
    return { totalCost, costPerPortion, foodCost, margin, totalMinutes, reusedCost };
  }, [ingredients, portions, salePrice, processes]);

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((current) => current.map((item, i) => i === index ? {
      ...item,
      [field]: field === "name" || field === "unit" || field === "origin" ? value : Number(value),
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
        <section className={styles.section} aria-labelledby="recipe-identification">
          <div className={styles.tabs} aria-label="Secções da ficha técnica">
            <span className={`${styles.tab} ${styles.tabActive}`}>Geral</span>
            <span className={styles.tab}>Ingredientes</span>
            <span className={styles.tab}>Processos</span>
            <span className={styles.tab}>Custos</span>
            <span className={styles.tab}>HACCP</span>
          </div>
          <h3 id="recipe-identification">Identificação da ficha</h3>
          <p>Defina o prato, o rendimento real do lote e o preço de venda sem IVA.</p>
          <div className={styles.grid2}>
            <div className={styles.field}><label htmlFor="recipe-name">Nome da receita</label><input id="recipe-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className={styles.field}><label htmlFor="recipe-category">Categoria</label><select id="recipe-category" value={category} onChange={(e) => setCategory(e.target.value)}><option>Pratos principais</option><option>Pastelaria</option><option>Entradas</option><option>Massas</option><option>Molhos e bases</option><option>Sobremesas</option></select></div>
            <div className={styles.field}><label htmlFor="recipe-portions">Doses que o lote realmente rende</label><input id="recipe-portions" type="number" min="1" step="1" value={portions} onChange={(e) => setPortions(Number(e.target.value))} /></div>
            <div className={styles.field}><label htmlFor="recipe-sale-price">Preço de venda líquido / dose (€)</label><input id="recipe-sale-price" type="number" min="0" step="0.01" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} /></div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="ingredients-heading">
          <h3 id="ingredients-heading">Ingredientes, stock e aproveitamentos</h3>
          <p>Registe o que entra no lote, incluindo preparações já feitas. A quantidade útil ajuda a medir o rendimento; o custo usa a quantidade retirada do stock.</p>
          <div className={styles.reuseNote}>
            <strong>Como lançar um aproveitamento</strong>
            <p>Escolha “Aproveitamento”, indique a quantidade usada e o custo por unidade útil da preparação. Exemplo: um molho que custou 12 € e rendeu 1 kg custa 3 € por cada 250 g usados. Atribua apenas a parcela usada a este prato; o restante lote conserva o respetivo custo no stock.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.subtable}>
              <thead><tr><th>Ingrediente / preparação</th><th>Origem</th><th>Qtd. retirada</th><th>Un.</th><th>Perda %</th><th>Qtd. útil</th><th>Custo / un. (€)</th><th>Custo neste lote</th><th></th></tr></thead>
              <tbody>{ingredients.map((item, index) => {
                const net = calculateNetQuantity(item.gross, item.waste);
                const cost = item.gross * item.unitCost;
                return <tr key={`${item.name}-${index}`}>
                  <td><input aria-label={`Ingrediente ${index + 1}`} value={item.name} onChange={(e) => updateIngredient(index, "name", e.target.value)} /></td>
                  <td><select aria-label={`Origem de ${item.name}`} value={item.origin} onChange={(e) => updateIngredient(index, "origin", e.target.value)}><option>Compra</option><option>Stock</option><option>Aproveitamento</option></select></td>
                  <td><input aria-label={`Quantidade de ${item.name}`} type="number" min="0" step="0.001" value={item.gross} onChange={(e) => updateIngredient(index, "gross", e.target.value)} /></td>
                  <td><select aria-label={`Unidade de ${item.name}`} value={item.unit} onChange={(e) => updateIngredient(index, "unit", e.target.value)}><option>kg</option><option>g</option><option>L</option><option>ml</option><option>un.</option></select></td>
                  <td><input aria-label={`Perda de ${item.name} em percentagem`} type="number" min="0" max="100" step="0.1" value={item.waste} onChange={(e) => updateIngredient(index, "waste", e.target.value)} /></td>
                  <td>{net.toFixed(3)}</td>
                  <td><input aria-label={`Custo por unidade de ${item.name}`} type="number" min="0" step="0.01" value={item.unitCost} onChange={(e) => updateIngredient(index, "unitCost", e.target.value)} /></td>
                  <td><strong>{money.format(cost)}</strong></td>
                  <td><button type="button" className={styles.secondary} aria-label={`Remover ${item.name}`} onClick={() => setIngredients((current) => current.filter((_, i) => i !== index))}>×</button></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <p className={styles.tableHint}>Use sempre unidades compatíveis: quantidade em kg com custo €/kg, quantidade em L com custo €/L, ou quantidade em unidades com custo €/unidade. Para preparações reaproveitadas, divida o custo do lote original pelo rendimento útil antes de preencher o custo por unidade.</p>
          <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setIngredients((current) => [...current, { name: "Novo ingrediente", gross: 0, unit: "kg", waste: 0, unitCost: 0, origin: "Compra" }])}>+ Adicionar ingrediente</button><button type="button" className={styles.secondary} onClick={() => setIngredients((current) => [...current, { name: "Preparação aproveitada", gross: 0, unit: "kg", waste: 0, unitCost: 0, origin: "Aproveitamento" }])}>+ Adicionar aproveitamento</button></div>
        </section>

        <section className={styles.section}>
          <h3>Processos de confeção</h3>
          <p>Registe as etapas para comparar tempos previstos com o trabalho real.</p>
          <div className={styles.tableWrap}>
            <table className={styles.subtable}>
              <thead><tr><th>Etapa</th><th>Descrição</th><th>Tempo (min)</th><th>Temperatura</th><th></th></tr></thead>
              <tbody>{processes.map((process, index) => <tr key={`${process.name}-${index}`}>
                <td><input aria-label={`Etapa ${index + 1}`} value={process.name} onChange={(e) => updateProcess(index, "name", e.target.value)} /></td>
                <td><input aria-label={`Descrição da etapa ${index + 1}`} value={process.description} onChange={(e) => updateProcess(index, "description", e.target.value)} /></td>
                <td><input aria-label={`Tempo da etapa ${index + 1}`} type="number" min="0" value={process.minutes} onChange={(e) => updateProcess(index, "minutes", e.target.value)} /></td>
                <td><input aria-label={`Temperatura da etapa ${index + 1}`} value={process.temperature} onChange={(e) => updateProcess(index, "temperature", e.target.value)} /></td>
                <td><button type="button" className={styles.secondary} aria-label={`Remover etapa ${process.name}`} onClick={() => setProcesses((current) => current.filter((_, i) => i !== index))}>×</button></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setProcesses((current) => [...current, { name: "Nova etapa", description: "", minutes: 0, temperature: "—" }])}>+ Adicionar processo</button></div>
        </section>

        <section className={styles.section}>
          <h3>Guia de utilização</h3>
          <p>O cálculo serve qualquer prato: feijoada, massas, carnes, sobremesas, molhos e preparações de base.</p>
          <details className={styles.guide}>
            <summary>Estou a começar: como preencher a ficha</summary>
            <ol>
              <li>Escreva o nome e pese o lote completo, não uma dose imaginada.</li>
              <li>Adicione cada ingrediente. Registe a quantidade retirada e o preço pago por kg, litro ou unidade.</li>
              <li>Indique perdas de limpeza apenas quando o custo unitário estiver associado à quantidade comprada. O custo é calculado sobre a quantidade retirada; a quantidade útil fica visível para controlar o rendimento.</li>
              <li>Conte as doses que realmente consegue servir. O custo por dose é o custo do lote dividido por esse número.</li>
              <li>Introduza o preço de venda sem IVA para ver o food cost e o valor que sobra depois dos ingredientes.</li>
              <li>Inclua sobras seguras que vão ser reaproveitadas como uma preparação com o respetivo custo proporcional, sem voltar a lançar o seu custo como uma nova compra.</li>
            </ol>
          </details>
          <details className={styles.guide}>
            <summary>Já faço gestão: controlos para acompanhar</summary>
            <ul>
              <li><strong>Food cost</strong> = custo dos ingredientes por dose ÷ preço de venda líquido × 100. A margem apresentada é a parcela após ingredientes; ainda tem de cobrir mão de obra, energia, renda, comissões, impostos e outros custos.</li>
              <li>Compare rendimento teórico e rendimento real, atualize preços de compra e faça nova ficha quando mudar fornecedor, gramagem ou processo.</li>
              <li>Nos aproveitamentos, valorize pelo custo real do lote de origem dividido pelo rendimento útil. Transfira só a quantidade utilizada e mantenha o saldo remanescente identificado no stock, de acordo com o procedimento interno.</li>
              <li>Use origem, data, identificação e prazo definidos no controlo HACCP do restaurante para cada preparação reaproveitada. Esta ficha não substitui os registos de segurança alimentar.</li>
            </ul>
          </details>
        </section>

        <section className={styles.section}>
          <h3>HACCP e controlo</h3>
          <p>Registe os dados definidos no plano de segurança alimentar do estabelecimento.</p>
          <div className={styles.grid2}>
            <div className={styles.field}><label htmlFor="haccp-version">Versão HACCP aplicável</label><select id="haccp-version"><option>Por validar</option><option>HACCP 2026.09</option></select></div>
            <div className={styles.field}><label htmlFor="haccp-status">Estado de conformidade</label><select id="haccp-status"><option>Rever</option><option>Conforme</option><option>Não conforme</option><option>Não aplicável</option></select></div>
            <div className={styles.field}><label htmlFor="service-temperature">Temperatura mínima de serviço</label><input id="service-temperature" placeholder="Conforme plano HACCP" /></div>
            <div className={styles.field}><label htmlFor="storage">Conservação</label><input id="storage" placeholder="Conforme plano HACCP" /></div>
          </div>
          <div className={styles.field} style={{ marginTop: 12 }}><label htmlFor="allergens">Alergénios e observações</label><textarea id="allergens" placeholder="Registar alergénios e pontos de controlo..." /></div>
        </section>
      </div>

      <aside className={styles.sideColumn} aria-label="Resumo de custos e margem">
        <section className={styles.section}>
          <h3>Resumo económico</h3>
          <p>{name}</p>
          <div className={styles.summary}>
            <div className={styles.summaryRow}><span>Custo total do lote</span><strong>{money.format(totals.totalCost)}</strong></div>
            <div className={styles.summaryRow}><span>Custo por dose ({portions})</span><strong>{money.format(totals.costPerPortion)}</strong></div>
            <div className={styles.summaryRow}><span>Food cost</span><strong>{totals.foodCost.toFixed(1)}%</strong></div>
            <div className={styles.summaryRow}><span>Margem após ingredientes</span><strong>{totals.margin.toFixed(1)}%</strong></div>
            <div className={styles.summaryRow}><span>Custo de aproveitamentos</span><strong>{money.format(totals.reusedCost)}</strong></div>
            <div className={styles.summaryRow}><span>Tempo declarado</span><strong>{totals.totalMinutes} min</strong></div>
            <div className={styles.summaryTotal}><span>Venda líquida prevista<br />({portions} doses)</span><strong>{money.format(portions * salePrice)}</strong></div>
          </div>
        </section>
        <div className={styles.alert}><strong>Margem antes dos restantes custos.</strong><br />O valor após ingredientes ainda não desconta mão de obra, energia, renda, comissões ou outros encargos. Confirme também o tratamento do IVA com a contabilidade.</div>
        <div className={styles.alert}><strong>Dados de demonstração.</strong><br />A ficha atualiza os cálculos no ecrã; a gravação em base de dados ainda não está ligada.</div>
        <button type="button" className={styles.primary} disabled>Guardar ficha técnica (disponível quando ligada à base de dados)</button>
        <button type="button" className={styles.secondary} disabled>Guardar como rascunho</button>
      </aside>
    </div>
  );
}

