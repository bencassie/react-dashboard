/**
 * Transform functions for converting raw API responses into chart-ready data
 * Naming convention: transform[DataSource]For[Purpose]
 */

/**
 * Passthrough transform for API endpoints that already return transformed data
 */
export function passthroughTransform(raw: any) {
  return raw;
}

/**
 * Passthrough transform that converts date strings to Date objects for D3
 */
export function passthroughWithDateTransform(raw: any) {
  if (!Array.isArray(raw)) return raw;
  return raw.map((item: any) => ({
    ...item,
    date: item.date ? new Date(item.date) : item.date,
  }));
}

/**
 * Transform difficulty/count to name/value for pie charts
 */
export function transformDifficultyToNameValue(raw: any) {
  if (!Array.isArray(raw)) return raw;
  return raw.map((item: any) => ({
    name: item.difficulty || item.name,
    value: item.count || item.value,
  }));
}

/**
 * Transform status/count to name/value for pie charts
 */
export function transformStatusToNameValue(raw: any) {
  if (!Array.isArray(raw)) return raw;
  return raw.map((item: any) => ({
    name: item.status || item.name,
    value: item.count || item.value,
  }));
}

/**
 * Transform Open Library API for subject works distribution
 */
export function transformOpenLibraryForSubjectWorksDonut(raw: any) {
  if (!raw) return [];

  // Handle different response structures
  if (Array.isArray(raw.subjects) && raw.subjects.length) {
    return raw.subjects
      .map((s: any) => ({
        name: String(s?.name ?? s?.key ?? "").trim(),
        value: Number(s?.work_count ?? s?.count ?? 0),
      }))
      .filter((d: any) => d.name && Number.isFinite(d.value) && d.value > 0)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 12);
  }

  if (Array.isArray(raw.works) && raw.works.length) {
    const counts = new Map<string, number>();
    for (const w of raw.works) {
      const subjects = Array.isArray(w?.subject) 
        ? w.subject 
        : Array.isArray(w?.subjects) 
        ? w.subjects 
        : [];
      for (const s of subjects) {
        const k = String(s ?? "").trim();
        if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    return Array.from(counts, ([name, value]) => ({ name, value }))
      .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
  }

  return [];
}

/**
 * Transform PokéAPI for base experience bar chart (top 15)
 */
export function transformPokeApiForBaseExperienceBar(raw: any) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p: any) => p.base_experience && p.base_experience > 0)
    .sort((a: any, b: any) => (b.base_experience || 0) - (a.base_experience || 0))
    .slice(0, 15)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      base_experience: p.base_experience,
    }));
}

/**
 * Transform SpaceX API for launches per year area chart
 */
export function transformSpaceXForLaunchesPerYearArea(raw: any) {
  const launches = Array.isArray(raw) ? raw : [];
  const counts: Record<string, number> = {};
  for (const l of launches) {
    const y = (l.date_utc || l.date_local || "").slice(0, 4);
    if (y) counts[y] = (counts[y] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([year, count]) => ({
      date: new Date(`${year}-01-01T00:00:00Z`),
      count,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Transform DummyJSON products for low stock bar chart
 */
export function transformProductsForLowStockBar(raw: any) {
  const products = raw?.products || [];
  return products
    .filter((p: any) => p.stock < 50)
    .sort((a: any, b: any) => a.stock - b.stock)
    .slice(0, 10)
    .map((p: any) => ({
      product: p.title.slice(0, 15),
      stock: p.stock,
    }));
}

/**
 * Transform DummyJSON users for age distribution donut chart
 */
export function transformUsersForAgeDistributionDonut(raw: any) {
  const users = raw?.users || [];
  const ageRanges: Record<string, number> = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-60": 0,
    "60+": 0,
  };

  users.forEach((u: any) => {
    const age = u.age;
    if (age <= 25) ageRanges["18-25"]++;
    else if (age <= 35) ageRanges["26-35"]++;
    else if (age <= 45) ageRanges["36-45"]++;
    else if (age <= 60) ageRanges["46-60"]++;
    else ageRanges["60+"]++;
  });

  return Object.entries(ageRanges).map(([name, value]) => ({
    name,
    value,
  }));
}

/**
 * Transform Pokemon stats for Recharts radar chart
 * Recharts radar expects: [{name: "Pokemon1", height: 10, weight: 100, baseExp: 50}, ...]
 */
export function transformPokemonForRechartsRadar(raw: any) {
  if (!Array.isArray(raw)) return [];
  return raw.map((p: any) => ({
    name: p.name || "Unknown",
    height: p.height || 0,
    weight: Math.min(p.weight || 0, 200), // Cap weight at 200 for better visualization
    baseExp: p.baseExp || 0,
  }));
}

/**
 * Transform Pokemon stats for ECharts radar chart
 * ECharts radar expects: {indicator: [{name, max}, ...], series: [{data: [{value: [...], name: ""}]}]}
 */
export function transformPokemonForEchartsRadar(raw: any) {
  if (!Array.isArray(raw)) return { indicator: [], data: [] };

  // Define indicators with max values
  const indicator = [
    { name: "Height", max: 35 },
    { name: "Weight", max: 200 },
    { name: "Base XP", max: 250 },
  ];

  // Transform each pokemon into a data series
  const data = raw.map((p: any) => ({
    value: [
      p.height || 0,
      Math.min(p.weight || 0, 200), // Cap weight
      p.baseExp || 0,
    ],
    name: p.name || "Unknown",
  }));

  return { indicator, data };
}

/**
 * Transform Pokemon stats for Chart.js radar chart
 * Chart.js radar expects: [{name: "Pokemon1", height: 10, weight: 100, baseExp: 50}, ...]
 */
export function transformPokemonForChartJsRadar(raw: any) {
  if (!Array.isArray(raw)) return [];
  return raw.map((p: any) => ({
    name: p.name || "Unknown",
    height: p.height || 0,
    weight: Math.min(p.weight || 0, 200),
    baseExp: p.baseExp || 0,
  }));
}

/**
 * Transform flat array data to Nivo line chart format
 * Nivo line expects: [{id: "series", data: [{x: val, y: val}, ...]}]
 */
export function transformForNivoLine(xKey: string, yKey: string, seriesName = "Data") {
  return (raw: any) => {
    if (!Array.isArray(raw)) return [];
    return [{
      id: seriesName,
      data: raw.map((item: any) => ({
        x: item[xKey],
        y: item[yKey],
      })),
    }];
  };
}

// ============================================================================
// TREEMAP & SUNBURST - Products by Category/Brand Hierarchy
// ============================================================================

interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
}

export function transformProductsForTreemap(products: any[]): HierarchyNode {
  if (!Array.isArray(products)) return { name: "All Products", children: [] };

  const categoryMap = new Map<string, Map<string, any[]>>();

  // Group by category → brand
  products.forEach((product) => {
    const category = product.category || "Unknown";
    const brand = product.brand || "Unknown";

    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Map());
    }
    const brandMap = categoryMap.get(category)!;
    if (!brandMap.has(brand)) {
      brandMap.set(brand, []);
    }
    brandMap.get(brand)!.push(product);
  });

  // Build hierarchy: All Products → Category → Brand → Products
  const children = Array.from(categoryMap.entries()).map(([category, brandMap]) => ({
    name: category,
    children: Array.from(brandMap.entries()).map(([brand, items]) => ({
      name: brand,
      children: items.slice(0, 10).map((p) => ({
        name: p.title || "Unknown Product",
        value: Math.round(p.price || 0),
      })),
    })),
  }));

  return {
    name: "All Products",
    children,
  };
}

export const transformProductsForSunburst = transformProductsForTreemap; // Same structure

// ============================================================================
// BOX PLOT - Product Prices by Category
// ============================================================================

interface BoxPlotData {
  categories: string[];
  values: number[][];
}

function calculateBoxPlotStats(values: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  if (n === 0) return [0, 0, 0, 0, 0];

  const min = sorted[0];
  const max = sorted[n - 1];
  const q1 = sorted[Math.floor(n * 0.25)];
  const median = sorted[Math.floor(n * 0.5)];
  const q3 = sorted[Math.floor(n * 0.75)];

  return [min, q1, median, q3, max];
}

export function transformProductsForPriceBoxPlot(products: any[]): BoxPlotData {
  if (!Array.isArray(products)) return { categories: [], values: [] };

  const categoryPrices = new Map<string, number[]>();

  products.forEach((product) => {
    const category = product.category || "Unknown";
    const price = parseFloat(product.price);

    if (!isNaN(price)) {
      if (!categoryPrices.has(category)) {
        categoryPrices.set(category, []);
      }
      categoryPrices.get(category)!.push(price);
    }
  });

  const categories: string[] = [];
  const values: number[][] = [];

  categoryPrices.forEach((prices, category) => {
    if (prices.length > 0) {
      categories.push(category);
      values.push(calculateBoxPlotStats(prices));
    }
  });

  return { categories, values };
}

export function transformRecipesForCookTimeBoxPlot(recipes: any[]): BoxPlotData {
  if (!Array.isArray(recipes)) return { categories: [], values: [] };

  const difficultyTimes = new Map<string, number[]>();

  recipes.forEach((recipe) => {
    const difficulty = recipe.difficulty || "Unknown";
    const cookTime = parseInt(recipe.cookTimeMinutes);

    if (!isNaN(cookTime)) {
      if (!difficultyTimes.has(difficulty)) {
        difficultyTimes.set(difficulty, []);
      }
      difficultyTimes.get(difficulty)!.push(cookTime);
    }
  });

  const categories: string[] = [];
  const values: number[][] = [];

  difficultyTimes.forEach((times, difficulty) => {
    if (times.length > 0) {
      categories.push(difficulty);
      values.push(calculateBoxPlotStats(times));
    }
  });

  return { categories, values };
}

// ============================================================================
// FUNNEL - Conversion Pipeline
// ============================================================================

export function passthroughTransformForFunnel(data: any[]): any[] {
  // Funnel API returns data in correct format already
  return Array.isArray(data) ? data : [];
}