import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Fetch carts and products in parallel
    const [cartsRes, productsRes] = await Promise.all([
      fetch("https://dummyjson.com/carts?limit=20", { cache: "no-store" }),
      fetch("https://dummyjson.com/products?limit=100", { cache: "no-store" }),
    ]);

    if (!cartsRes.ok || !productsRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    const cartsData = await cartsRes.json();
    const productsData = await productsRes.json();

    const carts = cartsData?.carts || [];
    const products = productsData?.products || [];

    // Create product lookup map
    const productMap = new Map(
      products.map((p: any) => [p.id, { category: p.category, title: p.title }])
    );

    // Build flow: User → Category → Product
    interface FlowLink {
      source: string;
      target: string;
      value: number;
    }

    const userToCategory = new Map<string, Map<string, number>>();
    const categoryToProduct = new Map<string, Map<string, number>>();

    carts.forEach((cart: any) => {
      const userId = `User ${cart.userId}`;

      cart.products?.forEach((item: any) => {
        const productInfo = productMap.get(item.id);
        if (!productInfo) return;

        const category = productInfo.category || "Unknown";
        const productName = productInfo.title?.slice(0, 25) || "Unknown";
        const quantity = item.quantity || 1;

        // User → Category
        if (!userToCategory.has(userId)) {
          userToCategory.set(userId, new Map());
        }
        const catMap = userToCategory.get(userId)!;
        catMap.set(category, (catMap.get(category) || 0) + quantity);

        // Category → Product (limit to top 2 products per category)
        if (!categoryToProduct.has(category)) {
          categoryToProduct.set(category, new Map());
        }
        const prodMap = categoryToProduct.get(category)!;
        if (prodMap.size < 2) {
          prodMap.set(productName, (prodMap.get(productName) || 0) + quantity);
        }
      });
    });

    const links: FlowLink[] = [];

    // Add User → Category links
    userToCategory.forEach((catMap, user) => {
      catMap.forEach((value, category) => {
        links.push({ source: user, target: category, value });
      });
    });

    // Add Category → Product links
    categoryToProduct.forEach((prodMap, category) => {
      prodMap.forEach((value, product) => {
        links.push({ source: category, target: product, value });
      });
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching cart flow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
