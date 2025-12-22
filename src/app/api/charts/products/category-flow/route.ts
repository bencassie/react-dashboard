import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=100", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const products = data?.products || [];

    // Build flow data: Category → Brand → Product
    // Track flows with their values (using price as flow weight)
    interface FlowLink {
      source: string;
      target: string;
      value: number;
    }

    const categoryToBrand = new Map<string, Map<string, number>>();
    const brandToProduct = new Map<string, Map<string, number>>();

    products.forEach((p: any) => {
      const category = p.category || "Unknown";
      const brand = p.brand || "Unknown";
      const product = p.title?.slice(0, 30) || "Unknown Product";
      const price = p.price || 0;

      // Category → Brand
      if (!categoryToBrand.has(category)) {
        categoryToBrand.set(category, new Map());
      }
      const brandMap = categoryToBrand.get(category)!;
      brandMap.set(brand, (brandMap.get(brand) || 0) + price);

      // Brand → Product (limit to top products per brand)
      if (!brandToProduct.has(brand)) {
        brandToProduct.set(brand, new Map());
      }
      const productMap = brandToProduct.get(brand)!;
      // Only add if not already 3 products for this brand
      if (productMap.size < 3) {
        productMap.set(product, price);
      }
    });

    // Convert to Sankey links format
    const links: FlowLink[] = [];

    // Add Category → Brand links
    categoryToBrand.forEach((brandMap, category) => {
      brandMap.forEach((value, brand) => {
        links.push({
          source: category,
          target: brand,
          value: Math.round(value),
        });
      });
    });

    // Add Brand → Product links
    brandToProduct.forEach((productMap, brand) => {
      productMap.forEach((value, product) => {
        links.push({
          source: brand,
          target: product,
          value: Math.round(value),
        });
      });
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching product category flow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
