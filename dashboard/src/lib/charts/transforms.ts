/**
 * Transform functions for converting raw API responses into chart-ready data
 */

/**
 * Transform products data for bar chart (price vs rating)
 */
export function transformProductsForBarChart(raw: any) {
  const products = raw?.products || [];
  return products.slice(0, 10).map((p: any) => ({
    id: p.title.slice(0, 20),
    price: p.price,
    rating: p.rating,
  }));
}

/**
 * Transform products data for pie chart (category distribution)
 */
export function transformProductsForPieChart(raw: any) {
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
 * Generate sample heatmap data (this one doesn't use API data)
 */
export function transformForHeatmap(_raw?: any) {
  return Array.from({ length: 7 }, (_, i) => ({
    id: `Day ${i + 1}`,
    data: Array.from({ length: 12 }, (_, h) => ({
      x: `${h * 2}:00`,
      y: Math.floor(Math.random() * 100),
    })),
  }));
}

/*
 *
 */
/**
 * Transform products data for brand count bar chart
 */
export function transformProductsForBrandBar(raw: any) {
  const products = raw?.products || [];
  const brandCount = products.reduce((acc: Record<string, number>, p: any) => {
    const brand = p.brand || "Unknown";
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(brandCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([brand, count]) => ({
      brand,
      count,
    }));
}

/**
 * Transform users data for gender pie chart
 */
export function transformUsersForGenderPie(raw: any) {
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
 * Transform todos data for completion bar chart
 */
export function transformTodosForBar(raw: any) {
  const todos = raw?.todos || [];
  const completed = todos.filter((t: any) => t.completed).length;
  const incomplete = todos.length - completed;
  return [
    { status: "Completed", count: completed },
    { status: "Incomplete", count: incomplete },
  ];
}

/**
 * Transform posts data for reactions bar chart (top 5)
 */
export function transformPostsForBar(raw: any) {
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
 * Transform carts data for total line chart
 */
export function transformCartsForLine(raw: any) {
  const carts = raw?.carts || [];
  return carts.map((c: any) => ({
    id: c.id,
    total: c.total || 0,
  }));
}

/** Open-Meteo: next 24 hours hourly temps for London (can switch lat/lon) */
export function transformOpenMeteoForLine(raw: any) {
  const hours = raw?.hourly?.time ?? [];
  const temps = raw?.hourly?.temperature_2m ?? [];
  return hours.slice(0, 24).map((t: string, i: number) => ({
    time: t.slice(11, 16),
    temp: temps[i],
  }));
}

/** Open Brewery DB: count breweries per state (top 10) */
export function transformOpenBreweryForBar(raw: any) {
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

/** Open Library: collapse works by subject into {name,value} with guards */
export function transformOpenLibrarySubjects(raw: any) {
  const works = Array.isArray(raw?.works) ? raw.works : [];
  const buckets: Record<string, number> = {};

  for (const w of works) {
    // Open Library sometimes uses `subject` and sometimes `subjects`
    const subjects: string[] = Array.isArray(w?.subject)
      ? w.subject
      : Array.isArray(w?.subjects)
      ? w.subjects
      : [];
    // keep first subject to avoid over-weighting multi-labeled rows
    const s = subjects[0];
    if (typeof s === "string" && s.trim()) {
      buckets[s] = (buckets[s] || 0) + 1;
    }
  }

  return Object.entries(buckets)
    .map(([name, count]) => ({ name, value: Number(count) }))
    .filter((r) => Number.isFinite(r.value) && r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

/** PokéAPI: first N pokemon with base_experience & id */
export function transformPokeApiForScatter(raw: any) {
  const results = raw?.results ?? [];
  const enriched = raw?.enriched ?? [];
  // When using the multi-step fetch (see registry), we stuff detail list into `enriched`.
  const rows = (enriched.length ? enriched : results).filter(Boolean);
  return rows.map((p: any) => ({
    id: p.id,
    name: p.name,
    base_experience: p.base_experience ?? 0,
  }));
}

/** SpaceX: count launches by year */
export function transformSpaceXLaunches(raw: any) {
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
