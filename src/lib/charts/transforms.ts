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
 * Transform DummyJSON products for price vs rating bar chart
 */
export function transformProductsForPriceRatingBar(raw: any) {
  const products = raw?.products || [];
  return products.slice(0, 10).map((p: any) => ({
    id: p.title.slice(0, 20),
    price: p.price,
    rating: p.rating,
  }));
}

/**
 * Transform DummyJSON products for category distribution pie chart
 */
export function transformProductsForCategoryPie(raw: any) {
  const products = raw?.products || [];
  const categoryCount = products.reduce(
    (acc: Record<string, number>, p: any) => {
      const cat = p.category;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));
}

/**
 * Generate sample heatmap data (client-side generated, no API)
 */
export function generateSampleHeatmapData(_raw?: any) {
  return Array.from({ length: 7 }, (_, i) => ({
    id: `Day ${i + 1}`,
    data: Array.from({ length: 12 }, (_, h) => ({
      x: `${h * 2}:00`,
      y: Math.floor(Math.random() * 100),
    })),
  }));
}

/**
 * Transform DummyJSON products for brand count bar chart
 */
export function transformProductsForBrandCountsBar(raw: any) {
  const products = raw?.products || [];
  const brandCount = products.reduce((acc: Record<string, number>, p: any) => {
    const brand = p.brand || "Unknown";
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(brandCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([brand, count]) => ({
      brand,
      count,
    }));
}

/**
 * Transform DummyJSON users for gender distribution pie chart
 */
export function transformUsersForGenderDistributionPie(raw: any) {
  const users = raw?.users || [];
  const genderCount = users.reduce((acc: Record<string, number>, u: any) => {
    const gender = u.gender;
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(genderCount).map(([name, value]) => ({
    name,
    value,
  }));
}

/**
 * Transform DummyJSON todos for completion status bar chart
 */
export function transformTodosForCompletionStatusBar(raw: any) {
  const todos = raw?.todos || [];
  const completed = todos.filter((t: any) => t.completed).length;
  const incomplete = todos.length - completed;
  return [
    { status: "Completed", count: completed },
    { status: "Incomplete", count: incomplete },
  ];
}

/**
 * Transform DummyJSON posts for top reactions bar chart
 */
export function transformPostsForTopReactionsBar(raw: any) {
  const posts = raw?.posts || [];
  return posts
    .sort((a: any, b: any) => {
      const aTotal = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0);
      const bTotal = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0);
      return bTotal - aTotal;
    })
    .slice(0, 5)
    .map((p: any) => ({
      title: p.title.slice(0, 20),
      reactions: (p.reactions?.likes || 0) + (p.reactions?.dislikes || 0),
    }));
}

/**
 * Transform DummyJSON carts for total value line chart
 */
export function transformCartsForTotalValueLine(raw: any) {
  const carts = raw?.carts || [];
  return carts.map((c: any) => ({
    id: c.id,
    total: c.total || 0,
  }));
}

/**
 * Transform Open-Meteo API for hourly temperature line chart
 */
export function transformOpenMeteoForHourlyTemperatureLine(raw: any) {
  const hours = raw?.hourly?.time ?? [];
  const temps = raw?.hourly?.temperature_2m ?? [];
  return hours.slice(0, 24).map((t: string, i: number) => ({
    time: t.slice(11, 16),
    temp: temps[i],
  }));
}

/**
 * Transform Open Brewery DB for breweries by state bar chart
 */
export function transformOpenBreweryForStateCountsBar(raw: any) {
  const list = Array.isArray(raw) ? raw : [];
  const counts: Record<string, number> = {};
  for (const b of list) {
    const state = b.state_province || b.state || "Unknown";
    counts[state] = (counts[state] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
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
 * Transform PokéAPI for base experience scatter plot
 */
export function transformPokeApiForBaseExperienceScatter(raw: any) {
  const results = raw?.results ?? [];
  const enriched = raw?.enriched ?? [];
  const rows = (enriched.length ? enriched : results).filter(Boolean);
  return rows.map((p: any) => ({
    id: p.id,
    name: p.name,
    base_experience: p.base_experience ?? 0,
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
 * Transform DummyJSON recipes for ratings scatter plot
 */
export function transformRecipesForRatingScatter(raw: any) {
  const recipes = raw?.recipes || [];
  return recipes.slice(0, 30).map((r: any) => ({
    id: r.id,
    name: r.name,
    rating: r.rating || 0,
  }));
}

/**
 * Transform DummyJSON quotes for category distribution pie chart
 */
export function transformQuotesForCategoryPie(raw: any) {
  const quotes = raw?.quotes || [];
  const categoryCount = quotes.reduce((acc: Record<string, number>, q: any) => {
    const author = q.author || "Unknown";
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 8)
    .map(([name, value]) => ({
      name: name.slice(0, 15),
      value,
    }));
}

/**
 * Transform DummyJSON products for discount percentage line chart
 */
export function transformProductsForDiscountLine(raw: any) {
  const products = raw?.products || [];
  return products
    .slice(0, 20)
    .map((p: any) => ({
      id: p.id,
      discount: p.discountPercentage || 0,
    }));
}

/**
 * Transform DummyJSON users for blood type distribution donut chart
 */
export function transformUsersForBloodTypeDonut(raw: any) {
  const users = raw?.users || [];
  const bloodTypeCount = users.reduce((acc: Record<string, number>, u: any) => {
    const bloodType = u.bloodGroup || "Unknown";
    acc[bloodType] = (acc[bloodType] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(bloodTypeCount).map(([name, value]) => ({
    name,
    value,
  }));
}

/**
 * Transform DummyJSON recipes for difficulty level bar chart
 */
export function transformRecipesForDifficultyBar(raw: any) {
  const recipes = raw?.recipes || [];
  const difficultyCount = recipes.reduce((acc: Record<string, number>, r: any) => {
    const difficulty = r.difficulty || "Unknown";
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(difficultyCount).map(([difficulty, count]) => ({
    difficulty,
    count,
  }));
}

/**
 * Transform DummyJSON products for price distribution area chart
 */
export function transformProductsForPriceDistributionArea(raw: any) {
  const products = raw?.products || [];
  const priceRanges: Record<string, number> = {
    "0-50": 0,
    "51-100": 0,
    "101-500": 0,
    "501-1000": 0,
    "1001+": 0,
  };

  products.forEach((p: any) => {
    const price = p.price;
    if (price <= 50) priceRanges["0-50"]++;
    else if (price <= 100) priceRanges["51-100"]++;
    else if (price <= 500) priceRanges["101-500"]++;
    else if (price <= 1000) priceRanges["501-1000"]++;
    else priceRanges["1001+"]++;
  });

  const order = ["0-50", "51-100", "101-500", "501-1000", "1001+"];
  return order.map((range, index) => ({
    date: new Date(2024, index, 1),
    count: priceRanges[range],
  }));
}

/**
 * Transform PokéAPI for height vs weight scatter plot
 */
export function transformPokeApiForHeightWeightScatter(raw: any) {
  const results = raw?.results ?? [];
  const enriched = raw?.enriched ?? [];
  const rows = (enriched.length ? enriched : results).filter(Boolean);
  return rows.map((p: any) => ({
    id: p.id,
    name: p.name,
    height: p.height ?? 0,
    weight: p.weight ?? 0,
  }));
}

/**
 * Transform DummyJSON recipes for cooking time line chart
 */
export function transformRecipesForCookingTimeLine(raw: any) {
  const recipes = raw?.recipes || [];
  return recipes
    .slice(0, 15)
    .map((r: any) => ({
      id: r.id,
      time: r.cookTimeMinutes || 0,
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