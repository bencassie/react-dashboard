import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Fetch multiple Pokemon with detailed stats
    const pokemonIds = [1, 4, 7, 25, 6]; // Bulbasaur, Charmander, Squirtle, Pikachu, Charizard

    const enriched = await Promise.all(
      pokemonIds.map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
      })
    );

    const transformed = enriched
      .filter(Boolean)
      .map((p: any) => ({
        name: p.name,
        height: p.height,
        weight: p.weight,
        baseExp: p.base_experience,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching pokemon stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
