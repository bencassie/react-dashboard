/**
 * Transform functions for converting raw API responses into chart-ready data
 * Naming convention: transform[DataSource]For[Purpose]
 */

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