/**
 * Transform functions for converting raw API responses into chart-ready data
 * Naming convention: transform[DataSource]For[Purpose]
 */

import type {
  ChartFilterState,
  FilterConfig,
  RangeValue,
  MultiSelectValue,
} from "./filter-types";

// ============================================================================
// FILTER UTILITIES
// ============================================================================

/**
 * Get nested field value using dot notation (e.g., "company.department")
 */
export function getFieldValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * Apply all filters to a dataset
 */
export function applyFilters<T extends Record<string, any>>(
  data: T[],
  filters: ChartFilterState | undefined,
  filterConfigs: FilterConfig[]
): T[] {
  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter((item) => {
    return filterConfigs.every((config) => {
      const filterValue = filters[config.id];

      // Skip if filter not set or is default
      if (filterValue === undefined || filterValue === null) return true;
      if (config.id.startsWith("_")) return true; // Skip special fields like _limit

      const fieldValue = getFieldValue(item, config.field);

      switch (config.type) {
        case "single-select":
          return filterValue === null || fieldValue === filterValue;

        case "multi-select": {
          const selected = filterValue as MultiSelectValue;
          return selected.length === 0 || selected.includes(String(fieldValue));
        }

        case "range": {
          const range = filterValue as RangeValue;
          const numValue = Number(fieldValue);
          if (isNaN(numValue)) return true;
          return numValue >= range.min && numValue <= range.max;
        }

        case "text": {
          const searchTerm = (filterValue as string).toLowerCase();
          if (!searchTerm) return true;

          // Support multi-field search (comma-separated fields)
          const fields = config.field.split(",");
          return fields.some((field) => {
            const val = getFieldValue(item, field.trim());
            return String(val ?? "").toLowerCase().includes(searchTerm);
          });
        }

        default:
          return true;
      }
    });
  });
}

/**
 * Extract limit from filters (for "topN" style filters)
 */
export function getLimit(filters?: ChartFilterState): number | null {
  if (!filters) return null;
  const topN = filters["topN"] || filters["_limit"];
  if (topN === "All" || !topN) return null;
  const num = parseInt(topN as string, 10);
  return isNaN(num) ? null : num;
}

// ============================================================================
// PASSTHROUGH TRANSFORMS
// ============================================================================

/**
 * Passthrough transform for API endpoints that already return transformed data
 */
export function passthroughTransform(raw: any, _filters?: ChartFilterState) {
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

export function transformProductsForTreemap(
  raw: any,
  filters?: ChartFilterState
): HierarchyNode {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return { name: "All Products", children: [] };

  // Import filter configs lazily to avoid circular dependency
  const filterConfigs: FilterConfig[] = [
    { id: "category", type: "multi-select", field: "category", label: "Categories", options: "auto", defaultValue: [] },
    { id: "priceRange", type: "range", field: "price", label: "Price", bounds: "auto", defaultValue: { min: 0, max: 2000 } },
  ];
  const filtered = applyFilters(products, filters, filterConfigs);

  const categoryMap = new Map<string, Map<string, any[]>>();

  // Group by category → brand
  filtered.forEach((product: any) => {
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
      children: items.slice(0, 10).map((p: any) => ({
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

export function transformProductsForSunburst(
  raw: any,
  filters?: ChartFilterState
): HierarchyNode {
  return transformProductsForTreemap(raw, filters);
}

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

export function transformProductsForPriceBoxPlot(
  raw: any,
  filters?: ChartFilterState
): BoxPlotData {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return { categories: [], values: [] };

  // Apply filters (only category filter makes sense for boxplot by category)
  const filterConfigs: FilterConfig[] = [
    { id: "category", type: "multi-select", field: "category", label: "Categories", options: "auto", defaultValue: [] },
  ];
  const filtered = applyFilters(products, filters, filterConfigs);

  const categoryPrices = new Map<string, number[]>();

  filtered.forEach((product: any) => {
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

export function transformRecipesForCookTimeBoxPlot(
  raw: any,
  filters?: ChartFilterState
): BoxPlotData {
  const recipes = raw?.recipes || raw || [];
  if (!Array.isArray(recipes)) return { categories: [], values: [] };

  // Apply filters
  const filterConfigs: FilterConfig[] = [
    { id: "difficulty", type: "multi-select", field: "difficulty", label: "Difficulty", options: ["Easy", "Medium", "Hard"], defaultValue: [] },
    { id: "cuisine", type: "multi-select", field: "cuisine", label: "Cuisine", options: "auto", defaultValue: [] },
  ];
  const filtered = applyFilters(recipes, filters, filterConfigs);

  const difficultyTimes = new Map<string, number[]>();

  filtered.forEach((recipe: any) => {
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

// ============================================================================
// FILTER-AWARE TRANSFORMS - Products
// ============================================================================

/** Filter configs for Products data source */
export const PRODUCTS_FILTER_CONFIGS: FilterConfig[] = [
  {
    id: "category",
    type: "multi-select",
    field: "category",
    label: "Categories",
    options: "auto",
    defaultValue: [],
  },
  {
    id: "priceRange",
    type: "range",
    field: "price",
    label: "Price",
    bounds: "auto",
    defaultValue: { min: 0, max: 2000 },
  },
  {
    id: "rating",
    type: "range",
    field: "rating",
    label: "Rating",
    bounds: { min: 0, max: 5 },
    step: 0.5,
    defaultValue: { min: 0, max: 5 },
  },
  {
    id: "brand",
    type: "multi-select",
    field: "brand",
    label: "Brands",
    options: "auto",
    defaultValue: [],
  },
];

/**
 * Transform products for brand counts bar chart with filter support
 * Raw data: { products: [...] } or [...]
 */
export function transformProductsForBrandCountsFiltered(
  raw: any,
  filters?: ChartFilterState
): Array<{ brand: string; count: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  // Apply filters (excluding brand filter since we're aggregating by brand)
  const filterConfigsForBrand = PRODUCTS_FILTER_CONFIGS.filter(
    (c) => c.id !== "brand"
  );
  const filtered = applyFilters(products, filters, filterConfigsForBrand);

  // Aggregate by brand
  const brandCount = filtered.reduce(
    (acc: Record<string, number>, p: any) => {
      const brand = p.brand || "Unknown";
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    },
    {}
  );

  // Sort and limit
  const limit = getLimit(filters) ?? 10;
  const sorted = Object.entries(brandCount).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  );

  const limited = limit ? sorted.slice(0, limit) : sorted;

  return limited.map(([brand, count]) => ({ brand, count: count as number }));
}

/**
 * Transform products for category counts bar chart with filter support
 */
export function transformProductsForCategoryCountsFiltered(
  raw: any,
  filters?: ChartFilterState
): Array<{ category: string; count: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  // Apply filters (excluding category filter since we're aggregating by category)
  const filterConfigsForCategory = PRODUCTS_FILTER_CONFIGS.filter(
    (c) => c.id !== "category"
  );
  const filtered = applyFilters(products, filters, filterConfigsForCategory);

  // Aggregate by category
  const categoryCount = filtered.reduce(
    (acc: Record<string, number>, p: any) => {
      const category = p.category || "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {}
  );

  // Sort and limit
  const limit = getLimit(filters) ?? 10;
  const sorted = Object.entries(categoryCount).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  );

  const limited = limit ? sorted.slice(0, limit) : sorted;

  return limited.map(([category, count]) => ({
    category,
    count: count as number,
  }));
}

/**
 * Transform products for price vs rating scatter with filter support
 */
export function transformProductsForPriceRatingFiltered(
  raw: any,
  filters?: ChartFilterState
): Array<{ id: number; title: string; price: number; rating: number; category: string }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  // Apply all filters
  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  return filtered.map((p: any) => ({
    id: p.id,
    title: p.title || "Unknown",
    price: p.price || 0,
    rating: p.rating || 0,
    category: p.category || "Unknown",
  }));
}

// ============================================================================
// PRODUCTS - Additional Client-Side Transforms
// ============================================================================

/** Transform products for categories pie chart */
export function transformProductsForCategories(
  raw: any,
  filters?: ChartFilterState
): Array<{ name: string; value: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  const categoryCounts = filtered.reduce((acc: Record<string, number>, p: any) => {
    const category = p.category || "Unknown";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value);
}

/** Transform products for low stock bar chart */
export function transformProductsForLowStock(
  raw: any,
  filters?: ChartFilterState
): Array<{ product: string; stock: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  return filtered
    .filter((p: any) => p.stock < 50)
    .sort((a: any, b: any) => a.stock - b.stock)
    .slice(0, 10)
    .map((p: any) => ({
      product: (p.title || "Unknown").slice(0, 15),
      stock: p.stock || 0,
    }));
}

/** Transform products for price distribution histogram */
export function transformProductsForPriceDistribution(
  raw: any,
  filters?: ChartFilterState
): Array<{ range: string; count: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  const ranges: Record<string, number> = {
    "$0-50": 0,
    "$50-100": 0,
    "$100-500": 0,
    "$500-1000": 0,
    "$1000+": 0,
  };

  filtered.forEach((p: any) => {
    const price = p.price || 0;
    if (price < 50) ranges["$0-50"]++;
    else if (price < 100) ranges["$50-100"]++;
    else if (price < 500) ranges["$100-500"]++;
    else if (price < 1000) ranges["$500-1000"]++;
    else ranges["$1000+"]++;
  });

  return Object.entries(ranges).map(([range, count]) => ({ range, count }));
}

/** Transform products for discounts bar chart */
export function transformProductsForDiscounts(
  raw: any,
  filters?: ChartFilterState
): Array<{ product: string; discountPercentage: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  return filtered
    .filter((p: any) => p.discountPercentage > 0)
    .sort((a: any, b: any) => b.discountPercentage - a.discountPercentage)
    .slice(0, 20)
    .map((p: any) => ({
      product: (p.title || "Unknown").slice(0, 20),
      discountPercentage: p.discountPercentage || 0,
    }));
}

/** Transform products for bubble chart */
export function transformProductsForBubble(
  raw: any,
  filters?: ChartFilterState
): Array<{ id: number; name: string; price: number; rating: number; stock: number; category: string; brand: string }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  return filtered.slice(0, 30).map((p: any) => ({
    id: p.id,
    name: p.title || "Unknown",
    price: p.price || 0,
    rating: p.rating || 0,
    stock: p.stock || 0,
    category: p.category || "Unknown",
    brand: p.brand || "Unknown",
  }));
}

/** Transform products for price vs rating scatter (top 10) */
export function transformProductsForPriceRatingTop(
  raw: any,
  filters?: ChartFilterState
): Array<{ id: number; price: number; rating: number }> {
  const products = raw?.products || raw || [];
  if (!Array.isArray(products)) return [];

  const filtered = applyFilters(products, filters, PRODUCTS_FILTER_CONFIGS);

  return filtered.slice(0, 10).map((p: any) => ({
    id: p.id,
    price: p.price || 0,
    rating: p.rating || 0,
  }));
}

// ============================================================================
// USERS - Client-Side Transforms
// ============================================================================

/** Filter configs for Users data source */
export const USERS_FILTER_CONFIGS: FilterConfig[] = [
  {
    id: "gender",
    type: "multi-select",
    field: "gender",
    label: "Gender",
    options: "auto",
    defaultValue: [],
  },
  {
    id: "age",
    type: "range",
    field: "age",
    label: "Age",
    bounds: "auto",
    defaultValue: { min: 0, max: 100 },
  },
  {
    id: "bloodGroup",
    type: "multi-select",
    field: "bloodGroup",
    label: "Blood Type",
    options: "auto",
    defaultValue: [],
  },
  {
    id: "department",
    type: "multi-select",
    field: "company.department",
    label: "Department",
    options: "auto",
    defaultValue: [],
  },
];

/** Transform users for gender pie chart */
export function transformUsersForGender(
  raw: any,
  filters?: ChartFilterState
): Array<{ name: string; value: number }> {
  const users = raw?.users || raw || [];
  if (!Array.isArray(users)) return [];

  const filtered = applyFilters(users, filters, USERS_FILTER_CONFIGS);

  const genderCounts = filtered.reduce((acc: Record<string, number>, u: any) => {
    const gender = u.gender || "Unknown";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(genderCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  }));
}

/** Transform users for blood type pie chart */
export function transformUsersForBloodType(
  raw: any,
  filters?: ChartFilterState
): Array<{ name: string; value: number }> {
  const users = raw?.users || raw || [];
  if (!Array.isArray(users)) return [];

  const filtered = applyFilters(users, filters, USERS_FILTER_CONFIGS);

  const bloodCounts = filtered.reduce((acc: Record<string, number>, u: any) => {
    const blood = u.bloodGroup || "Unknown";
    acc[blood] = (acc[blood] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(bloodCounts)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value);
}

/** Transform users for age distribution bar chart */
export function transformUsersForAgeDistribution(
  raw: any,
  filters?: ChartFilterState
): Array<{ range: string; count: number }> {
  const users = raw?.users || raw || [];
  if (!Array.isArray(users)) return [];

  const filtered = applyFilters(users, filters, USERS_FILTER_CONFIGS);

  const ageRanges: Record<string, number> = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-60": 0,
    "60+": 0,
  };

  filtered.forEach((u: any) => {
    const age = u.age || 0;
    if (age <= 25) ageRanges["18-25"]++;
    else if (age <= 35) ageRanges["26-35"]++;
    else if (age <= 45) ageRanges["36-45"]++;
    else if (age <= 60) ageRanges["46-60"]++;
    else ageRanges["60+"]++;
  });

  return Object.entries(ageRanges).map(([range, count]) => ({ range, count }));
}

// ============================================================================
// RECIPES - Client-Side Transforms
// ============================================================================

/** Filter configs for Recipes data source */
export const RECIPES_FILTER_CONFIGS: FilterConfig[] = [
  {
    id: "difficulty",
    type: "multi-select",
    field: "difficulty",
    label: "Difficulty",
    options: ["Easy", "Medium", "Hard"],
    defaultValue: [],
  },
  {
    id: "cuisine",
    type: "multi-select",
    field: "cuisine",
    label: "Cuisine",
    options: "auto",
    defaultValue: [],
  },
  {
    id: "rating",
    type: "range",
    field: "rating",
    label: "Rating",
    bounds: { min: 0, max: 5 },
    step: 0.5,
    defaultValue: { min: 0, max: 5 },
  },
  {
    id: "cookTime",
    type: "range",
    field: "cookTimeMinutes",
    label: "Cook Time",
    bounds: "auto",
    defaultValue: { min: 0, max: 200 },
  },
];

/** Transform recipes for difficulty pie chart (returns name/value for pie charts) */
export function transformRecipesForDifficulty(
  raw: any,
  filters?: ChartFilterState
): Array<{ name: string; value: number }> {
  const recipes = raw?.recipes || raw || [];
  if (!Array.isArray(recipes)) return [];

  const filtered = applyFilters(recipes, filters, RECIPES_FILTER_CONFIGS);

  const difficultyCounts = filtered.reduce((acc: Record<string, number>, r: any) => {
    const difficulty = r.difficulty || "Unknown";
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

  // Custom sort order
  const order = ["Easy", "Medium", "Hard"];
  return Object.entries(difficultyCounts)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
}

/** Transform recipes for ratings bar chart */
export function transformRecipesForRatings(
  raw: any,
  filters?: ChartFilterState
): Array<{ id: number; name: string; rating: number }> {
  const recipes = raw?.recipes || raw || [];
  if (!Array.isArray(recipes)) return [];

  const filtered = applyFilters(recipes, filters, RECIPES_FILTER_CONFIGS);

  return filtered
    .slice(0, 30)
    .map((r: any) => ({
      id: r.id,
      name: r.name || "Unknown",
      rating: r.rating || 0,
    }));
}

/** Transform recipes for cooking time bar chart */
export function transformRecipesForCookingTime(
  raw: any,
  filters?: ChartFilterState
): Array<{ name: string; cookTimeMinutes: number }> {
  const recipes = raw?.recipes || raw || [];
  if (!Array.isArray(recipes)) return [];

  const filtered = applyFilters(recipes, filters, RECIPES_FILTER_CONFIGS);

  return filtered
    .slice(0, 15)
    .map((r: any) => ({
      name: (r.name || "Unknown").slice(0, 20),
      cookTimeMinutes: r.cookTimeMinutes || 0,
    }));
}

/** Transform recipes for cooking time as Nivo line format */
export function transformRecipesForCookingTimeNivoLine(
  raw: any,
  filters?: ChartFilterState
): Array<{ id: string; data: Array<{ x: string; y: number }> }> {
  const recipes = raw?.recipes || raw || [];
  if (!Array.isArray(recipes)) return [];

  const filtered = applyFilters(recipes, filters, RECIPES_FILTER_CONFIGS);

  return [{
    id: "Recipes",
    data: filtered.slice(0, 15).map((r: any) => ({
      x: (r.name || "Unknown").slice(0, 20),
      y: r.cookTimeMinutes || 0,
    })),
  }];
}

// ============================================================================
// SPACEX - Client-Side Transforms
// ============================================================================

/** Transform SpaceX launches for launches per year area chart */
export function transformSpaceXForLaunchesPerYear(
  raw: any,
  _filters?: ChartFilterState
): Array<{ date: Date; count: number }> {
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

// ============================================================================
// TODOS - Client-Side Transforms
// ============================================================================

/** Transform todos for status pie chart (returns name/value for pie charts) */
export function transformTodosForStatus(
  raw: any,
  _filters?: ChartFilterState
): Array<{ name: string; value: number }> {
  const todos = Array.isArray(raw) ? raw : raw?.todos || [];
  if (!Array.isArray(todos)) return [];

  const completed = todos.filter((t: any) => t.completed).length;
  const incomplete = todos.length - completed;

  return [
    { name: "Completed", value: completed },
    { name: "Incomplete", value: incomplete },
  ];
}

// ============================================================================
// POSTS - Client-Side Transforms
// ============================================================================

/** Transform posts for reactions bar chart */
export function transformPostsForReactions(
  raw: any,
  _filters?: ChartFilterState
): Array<{ title: string; reactions: number }> {
  const posts = Array.isArray(raw) ? raw : raw?.posts || [];
  if (!Array.isArray(posts)) return [];

  return posts
    .map((p: any) => ({
      title: (p.title || "Unknown").slice(0, 25),
      reactions: (p.reactions?.likes || 0) + (p.reactions?.dislikes || 0),
    }))
    .sort((a, b) => b.reactions - a.reactions)
    .slice(0, 5);
}

// ============================================================================
// CARTS - Client-Side Transforms
// ============================================================================

/** Transform carts for totals bar chart */
export function transformCartsForTotals(
  raw: any,
  _filters?: ChartFilterState
): Array<{ userId: string; total: number }> {
  const carts = Array.isArray(raw) ? raw : raw?.carts || [];
  if (!Array.isArray(carts)) return [];

  return carts.slice(0, 20).map((c: any) => ({
    userId: `User ${c.userId}`,
    total: Math.round(c.total || 0),
  }));
}

// ============================================================================
// QUOTES - Client-Side Transforms
// ============================================================================

/** Transform quotes for author counts pie chart */
export function transformQuotesForAuthors(
  raw: any,
  _filters?: ChartFilterState
): Array<{ name: string; value: number }> {
  const quotes = Array.isArray(raw) ? raw : raw?.quotes || [];
  if (!Array.isArray(quotes)) return [];

  const authorCounts = quotes.reduce((acc: Record<string, number>, q: any) => {
    const author = q.author || "Unknown";
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(authorCounts)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.slice(0, 17) + "..." : name,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

// ============================================================================
// BREWERIES - Client-Side Transforms
// ============================================================================

/** Transform breweries for state counts bar chart */
export function transformBreweriesForStates(
  raw: any,
  _filters?: ChartFilterState
): Array<{ state: string; count: number }> {
  const breweries = Array.isArray(raw) ? raw : [];
  if (!Array.isArray(breweries)) return [];

  const stateCounts = breweries.reduce((acc: Record<string, number>, b: any) => {
    const state = b.state || "Unknown";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}