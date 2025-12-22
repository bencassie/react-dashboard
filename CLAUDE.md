# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a Next.js 15 (App Router) dashboard that demonstrates 6+ charting libraries by fetching data from public APIs and visualizing it. The architecture follows a **declarative chart registry pattern** that decouples data fetching, transformation, and rendering.

### Core Pattern: Chart Registry System

The centerpiece is `src/lib/charts/registry.ts`, which contains an array of `ChartConfig` objects. Each config defines:

- **Metadata**: `name` (internal ID) and `displayName` (UI label)
- **API Configuration**: `endpoint`, `queryKey` (for TanStack Query caching), and `transform` function
- **Rendering**: `Component` (chart library component) and `chartOptions` (library-specific config)

**Example registry entry**:
```typescript
{
  name: "SpaceX Launches",
  displayName: "Launches per Year",
  apiConfig: {
    endpoint: "https://api.spacexdata.com/v5/launches",
    queryKey: ["spacex", "launches"],
    transform: transformSpaceXForLaunchesPerYearArea,
  },
  Component: D3AreaChart,
  chartOptions: { title: "SpaceX: Launches per Year" },
}
```

This separation allows swapping chart libraries (Nivo → Recharts) without changing data fetching logic.

### Data Flow

1. **User Selection**: User toggles charts in sidebar → `src/lib/store.ts` (Zustand) updates selection → URL params sync
2. **Fetching**: `src/app/page.tsx` calls `useQueries()` with chart configs → TanStack Query checks cache → fetches via proxy if needed
3. **API Routing**:
   - Internal routes (`/api/charts/**/*`) fetch from external APIs and pre-transform data
   - External APIs go through `/api/proxy/route.ts` to handle CORS
   - Special case: PokéAPI uses multi-fetch enrichment (fetches list, then details for each item)
4. **Transformation**: Raw API response → `transform()` function (in `src/lib/charts/transforms.ts`) → chart-ready data
5. **Rendering**: Transformed data + options → chart component (in `src/components/graphs/`) → rendered visualization

### State Management

- **Zustand** (`src/lib/store.ts`): Selected charts list + render keys (for forcing remounts)
- **URL Params**: Chart selection persisted to query string (`?charts=foo,bar`)
- **TanStack Query**: Server state with 5-min fresh time, 15-min cache retention, no refetch on mount/focus/reconnect

### Performance Optimizations

- **Dynamic imports**: All chart components loaded via `dynamic()` with `ssr: false` (code splitting)
- **React Compiler**: Enabled via `reactCompiler: true` in `next.config.ts`
- **Stable references**: Transform functions memoized to prevent chart re-renders
- **Parallel fetching**: `useQueries()` fetches all selected charts simultaneously
- **Render keys**: Charts only remount when toggled (not on every data refetch)

## Adding New Charts

Follow this 3-step process:

1. **Create chart component** in `src/components/graphs/[library][charttype].tsx`
   - Accept `ChartComponentProps` (data, isLoading, error, renderKey, options)
   - Handle loading/error states
   - Render using chosen library (Nivo, ECharts, Recharts, Chart.js, Plotly, D3)

2. **Add transform function** in `src/lib/charts/transforms.ts`
   - Convert raw API response to chart-specific format
   - Name it `transform[DataSource]For[Purpose]` (e.g., `transformSpaceXForLaunchesPerYearArea`)
   - Handle edge cases (missing data, non-array responses)

3. **Register in registry** (`src/lib/charts/registry.ts`)
   - Import component dynamically: `const MyChart = dynamic(() => import("@/components/graphs/mychart"), { ssr: false })`
   - Add config object to `chartRegistry` array
   - Use existing API endpoint or create new route in `src/app/api/charts/`

**Optional**: Create new API route in `src/app/api/charts/[category]/[metric]/route.ts` if data needs server-side transformation or if external API requires special handling.

## Key Files

- **`src/lib/charts/registry.ts`**: Chart definitions (106 configs)
- **`src/lib/charts/types.ts`**: TypeScript types for chart system
- **`src/lib/charts/transforms.ts`**: Data transformation functions
- **`src/lib/store.ts`**: Zustand store (selected charts, render keys)
- **`src/app/page.tsx`**: Main dashboard page with data fetching logic
- **`src/app/api/proxy/route.ts`**: CORS proxy for external APIs
- **`src/components/graphs/`**: Chart components (20+ files, one per chart type)
- **`src/components/providers.tsx`**: TanStack Query provider setup

## API Routes Pattern

Internal routes (`src/app/api/charts/**/*.ts`) follow this pattern:
- Export `runtime = "nodejs"` for server logging
- Fetch from external API with `cache: "no-store"`
- Transform data server-side (aggregate, filter, format)
- Return JSON response with error handling

See `src/app/api/charts/products/price-rating/route.ts` for reference.

## Dependencies Notes

- **Nivo**: Requires React version overrides in `package.json` (see `overrides` section)
- **React 19.2**: Latest canary version for React Compiler support
- **Tailwind CSS 4**: Uses new `@tailwindcss/postcss` plugin architecture
- **Next.js 15**: App Router with Turbopack enabled

## Important Patterns

1. **Chart components must handle loading/error states** - Don't assume data is always present
2. **Transform functions must be pure** - No side effects, consistent output for same input
3. **Always use dynamic imports for charts** - Required for code splitting and avoiding SSR issues
4. **Render keys force remounts** - Increment when chart needs full reset (e.g., after toggle)
5. **Use proxy for external APIs** - Direct fetch fails due to CORS; route through `/api/proxy`
