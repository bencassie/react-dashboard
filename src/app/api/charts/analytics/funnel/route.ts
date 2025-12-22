import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Simulate e-commerce conversion funnel
    const funnel = [
      { name: "Homepage Visits", value: 10000 },
      { name: "Product Views", value: 5000 },
      { name: "Add to Cart", value: 2000 },
      { name: "Checkout Started", value: 800 },
      { name: "Order Completed", value: 500 },
    ];

    return NextResponse.json(funnel);
  } catch (error) {
    console.error("Error generating funnel data:", error);
    return NextResponse.json({ error: "Failed to generate funnel data" }, { status: 500 });
  }
}
