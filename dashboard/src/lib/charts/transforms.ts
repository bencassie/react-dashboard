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
  const categoryCount = products.reduce((acc: Record<string, number>, p: any) => {
    const cat = p.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

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

/**
 * Example: Transform for a different API endpoint
 * Uncomment and modify when you add a new data source
 */
// export function transformSalesData(raw: any) {
//   return raw?.sales?.map((sale: any) => ({
//     region: sale.region,
//     amount: sale.total,
//     date: new Date(sale.timestamp),
//   })) || [];
// }



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