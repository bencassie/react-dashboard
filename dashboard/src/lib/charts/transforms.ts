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