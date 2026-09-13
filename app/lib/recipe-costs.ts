export type RecipeIngredientCost = {
  quantityGross?: number | null;
  quantityNet?: number | null;
  unitCost?: number | null;
  wastePct?: number | null;
};

export type RecipeProcess = {
  preparationMinutes?: number | null;
  cookingMinutes?: number | null;
  finishingMinutes?: number | null;
};

export function calculateNetQuantity(
  quantityGross: number,
  wastePct = 0,
): number {
  if (quantityGross < 0) throw new Error("A quantidade bruta não pode ser negativa.");
  if (wastePct < 0 || wastePct > 100) {
    throw new Error("A percentagem de desperdício deve estar entre 0 e 100.");
  }

  return quantityGross * (1 - wastePct / 100);
}

export function calculateIngredientCost(item: RecipeIngredientCost): number {
  const quantity = item.quantityNet ?? item.quantityGross ?? 0;
  const unitCost = item.unitCost ?? 0;

  if (quantity < 0 || unitCost < 0) {
    throw new Error("Quantidade e custo unitário não podem ser negativos.");
  }

  return quantity * unitCost;
}

export function calculateRecipeCost(items: RecipeIngredientCost[]): number {
  return items.reduce((total, item) => total + calculateIngredientCost(item), 0);
}

export function calculateCostPerPortion(totalCost: number, portions: number): number {
  if (totalCost < 0) throw new Error("O custo total não pode ser negativo.");
  if (portions <= 0) throw new Error("O número de doses deve ser superior a zero.");

  return totalCost / portions;
}

export function calculateFoodCostPct(costPerPortion: number, salePriceNet: number): number {
  if (costPerPortion < 0) throw new Error("O custo por dose não pode ser negativo.");
  if (salePriceNet <= 0) throw new Error("O preço de venda líquido deve ser superior a zero.");

  return (costPerPortion / salePriceNet) * 100;
}

export function calculateGrossMarginPct(costPerPortion: number, salePriceNet: number): number {
  return 100 - calculateFoodCostPct(costPerPortion, salePriceNet);
}

export function calculateTotalDeclaredTime(process: RecipeProcess): number {
  return (
    (process.preparationMinutes ?? 0) +
    (process.cookingMinutes ?? 0) +
    (process.finishingMinutes ?? 0)
  );
}
