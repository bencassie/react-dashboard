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

This is a Next.js 15 (App Router) dashboard that demonstrates 6 charting libraries by fetching data from public APIs and visualizing it. The architecture follows a **declarative chart registry pattern** that decouples data fetching, transformation, and rendering, with support for interactive filtering.

### Core Pattern: Chart Registry System

The centerpiece is `src/lib/charts/registry.ts`, which contains an array of `ChartConfig` objects. Each config defines:

- **Metadata**: `name` (internal ID) and `displayName` (UI label)
- **API Configuration**: `endpoint`, `queryKey` (for TanStack Query caching), `transform` function, and optional `dataSourceId` (for sharing raw data between charts)
- **Rendering**: `Component` (chart library component) and `chartOptions` (library-specific config)
- **Filtering**: Optional `filterConfig` defining interactive filters (single-select, multi-select, range, text)

**Example registry entry**:
```typescript
{
  name: "Bar Nivo Brand Counts",
  displayName: "Bar - Nivo - Brand Counts",
  apiConfig: {
    endpoint: "/api/charts/products/all",
    queryKey: ["products", "all"],
    transform: transformProductsForBrandCountsFiltered,
    dataSourceId: "products-all",  // Share data with other product charts
  },
  Component: NivoBarChart,
  chartOptions: { title: "Brand Product Counts" },
  filterConfig: productsFilterConfig,  // Enable interactive filtering
}
```

This separation allows swapping chart libraries (Nivo → Recharts) without changing data fetching logic.

### Data Flow

1. **User Selection**: User toggles charts in chart selector → `src/lib/store.ts` (Zustand) updates selection → URL params sync
2. **Fetching**: `src/app/page.tsx` calls `useQueries()` with chart configs → TanStack Query checks cache → fetches via proxy if needed
3. **API Routing**:
   - Internal routes (`/api/charts/**/*`) return raw data (client-side transforms handle aggregation)
   - External APIs go through `/api/proxy/route.ts` to handle CORS
   - Charts with same `dataSourceId` share cached raw data
4. **Filtering**: User interacts with filter controls → Zustand updates filter state → transform receives filters
5. **Transformation**: Raw API response + filters → `transform()` function (in `src/lib/charts/transforms.ts`) → chart-ready data
6. **Rendering**: Transformed data + options → chart component (in `src/components/graphs/`) → rendered visualization

### State Management

- **Zustand** (`src/lib/store.ts`): Selected charts, render keys (for forcing remounts), and filter state per chart
- **URL Params**: Chart selection persisted to query string (`?charts=foo,bar`)
- **TanStack Query**: Server state with 5-min fresh time, 15-min cache retention, no refetch on mount/focus/reconnect
- **Filter State**: Per-chart filter values stored in Zustand, applied during client-side transformation

### Performance Optimizations

- **Dynamic imports**: All chart components loaded via `dynamic()` with `ssr: false` (code splitting)
- **React Compiler**: Enabled via `reactCompiler: true` in `next.config.ts`
- **Stable references**: Transform functions memoized to prevent chart re-renders
- **Parallel fetching**: `useQueries()` fetches all selected charts simultaneously
- **Render keys**: Charts only remount when toggled (not on every data refetch)
- **Data source sharing**: Charts with same `dataSourceId` share cached raw data (reduces duplicate fetches)
- **Client-side transforms**: Filtering happens client-side for instant feedback without re-fetching

## Adding New Charts

Follow this 3-step process:

1. **Create chart component** in `src/components/graphs/[library][charttype].tsx`
   - Accept `ChartComponentProps` (data, isLoading, error, renderKey, options, activeFilters, onFilterChange)
   - Handle loading/error states
   - Render using chosen library (Nivo, ECharts, Recharts, Chart.js, Plotly, D3)

2. **Add transform function** in `src/lib/charts/transforms.ts`
   - Convert raw API response to chart-specific format
   - Name it `transform[DataSource]For[Purpose]` (e.g., `transformProductsForBrandCountsFiltered`)
   - Accept optional `filters` parameter for client-side filtering
   - Handle edge cases (missing data, non-array responses)

3. **Register in registry** (`src/lib/charts/registry.ts`)
   - Import component dynamically: `const MyChart = dynamic(() => import("@/components/graphs/mychart"), { ssr: false })`
   - Add config object to `chartRegistry` array
   - Use existing API endpoint or create new route in `src/app/api/charts/`

**Optional**: Create new API route in `src/app/api/charts/[category]/[metric]/route.ts` if data needs server-side transformation or if external API requires special handling.

## Key Files

- **`src/lib/charts/registry.ts`**: Chart definitions (72 configs)
- **`src/lib/charts/types.ts`**: TypeScript types for chart system
- **`src/lib/charts/transforms.ts`**: Data transformation functions (with filter support)
- **`src/lib/charts/filter-types.ts`**: Filter type definitions (single-select, multi-select, range, text)
- **`src/lib/store.ts`**: Zustand store (selected charts, render keys, filter state)
- **`src/app/page.tsx`**: Main dashboard page with data fetching logic
- **`src/app/api/proxy/route.ts`**: CORS proxy for external APIs
- **`src/components/graphs/`**: Chart components (44 files, one per chart type)
- **`src/components/filters/`**: Filter UI components (FilterContainer, FilterRange, FilterSingleSelect, FilterMultiSelect, FilterText)
- **`src/components/chart-selector.tsx`**: Chart selection UI with grouping by data set
- **`src/components/providers.tsx`**: TanStack Query provider setup

## API Routes Pattern

Internal routes (`src/app/api/charts/**/*.ts`) follow this pattern:
- Export `runtime = "nodejs"` for server logging
- Fetch from external API with `cache: "no-store"`
- Return raw data (aggregation moved to client-side transforms for filter support)
- Return JSON response with error handling

Most routes now return raw data via `/all` endpoints (e.g., `/api/charts/products/all`) to enable client-side filtering. See `src/app/api/charts/products/all/route.ts` for reference.

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
6. **Client-side filtering** - Transforms receive filter state; apply filters before aggregation
7. **Data source sharing** - Use `dataSourceId` to share raw data between charts with same source
8. **DisplayName format** - Use "{Type} - {Vendor} - {Data Set}" for consistent grouping in selector
