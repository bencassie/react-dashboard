# Product Dashboard

A comprehensive data visualization dashboard built with Next.js 15 that showcases and compares multiple JavaScript charting libraries by fetching and displaying data from various public APIs.

## Overview

This project serves as both a functional dashboard and a demonstration of integrating multiple charting solutions into a single application. It fetches real-time data from public APIs and visualizes it using six different charting libraries, allowing for side-by-side comparison of their capabilities.

## Features

### Chart Libraries Integrated
- **[Nivo](https://nivo.rocks/)** - Bar, Heatmap, Line, Pie, and Area (Bump) charts
- **[ECharts](https://echarts.apache.org/)** - Pie, Donut, Line, Bar, Scatter, and Radar charts
- **[Recharts](https://recharts.org/)** - Line, Bar, Area, Pie, and Radar charts
- **[Chart.js](https://www.chartjs.org/)** - Bar, Pie, Doughnut, and Radar charts
- **[Plotly.js](https://plotly.com/javascript/)** - Line, Bar, Pie, and Scatter charts
- **[D3.js](https://d3js.org/)** - Area, Line, and Bar charts

### Data Sources
The dashboard uses a hybrid data architecture combining internal API routes and external APIs:

**Internal API Routes** (Next.js API routes under `/api/charts/`):
- **Products** - Price/rating, categories, brand counts, low stock, discounts, price distribution
- **Users** - Gender distribution, age distribution, blood type distribution
- **Recipes** - Ratings, difficulty levels, cooking times
- **Todos** - Completion status
- **Posts** - Reaction counts
- **Carts** - Shopping cart totals
- **Quotes** - Author distribution
- **Heatmap** - Server-generated sample data

**External APIs** (proxied for CORS):
- **[DummyJSON](https://dummyjson.com/)** - Products, users, recipes, todos, posts, carts, quotes
- **[Open-Meteo](https://open-meteo.com/)** - Weather forecasts (London)
- **[OpenBrewery DB](https://www.openbrewerydb.org/)** - Brewery information by state
- **[Open Library](https://openlibrary.org/developers/api)** - Book and subject data
- **[PokéAPI](https://pokeapi.co/)** - Pokemon statistics
- **[SpaceX API](https://github.com/r-spacex/SpaceX-API)** - Launch history

### Core Functionality
- **Interactive Chart Selection** - Toggle individual charts on/off via sidebar
- **URL State Persistence** - Selected charts are saved in URL query parameters
- **Optimized Data Fetching** - TanStack Query with 5-minute caching and parallel requests
- **Responsive Design** - Mobile-friendly grid layout
- **Refresh Functionality** - Manually refresh all chart data
- **CORS Proxy** - Built-in API proxy to handle cross-origin requests
- **Code Splitting** - Dynamic imports for optimal bundle size
- **Type Safety** - Full TypeScript implementation

## Tech Stack

### Core Framework
- **[Next.js](https://nextjs.org/) 15** - React framework with App Router
- **[React](https://react.dev/) 19.2** - UI library
- **[TypeScript](https://www.typescriptlang.org/) 5** - Type safety

### State Management & Data Fetching
- **[Zustand](https://zustand-demo.pmnd.rs/) 5** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query/latest) 5** - Server state management and caching

### Styling
- **[Tailwind CSS](https://tailwindcss.com/) 4** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives (Dialog, Checkbox, Tabs, Slot)
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[class-variance-authority](https://cva.style/docs)** - Component variant handling
- **[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)** - Animation utilities

### Charting Libraries
- **[@nivo/*](https://nivo.rocks/)** - Bar (@nivo/bar), Heatmap (@nivo/heatmap), Line (@nivo/line), Pie (@nivo/pie), Area Bump (@nivo/bump), and Core (@nivo/core)
- **[echarts](https://echarts.apache.org/) & [echarts-for-react](https://github.com/hustcc/echarts-for-react)** - Apache ECharts integration with React wrapper
- **[recharts](https://recharts.org/)** - Composable charting library built on D3
- **[chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)** - Chart.js with React wrapper
- **[plotly.js-dist-min](https://plotly.com/javascript/) & [react-plotly.js](https://plotly.com/javascript/react/)** - Plotly.js with React integration
- **[d3](https://d3js.org/)** - Low-level data visualization library for custom SVG charts

### Development Tools
- **[ESLint](https://eslint.org/) 9** - Code linting
- **[babel-plugin-react-compiler](https://react.dev/learn/react-compiler)** - React compiler plugin
- **[PostCSS](https://postcss.org/)** - CSS transformations

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── charts/             # Internal API routes
│   │   │   │   ├── products/       # Product-related endpoints
│   │   │   │   │   ├── price-rating/route.ts
│   │   │   │   │   ├── categories/route.ts
│   │   │   │   │   ├── brand-counts/route.ts
│   │   │   │   │   ├── low-stock/route.ts
│   │   │   │   │   ├── discounts/route.ts
│   │   │   │   │   └── price-distribution/route.ts
│   │   │   │   ├── users/          # User demographics endpoints
│   │   │   │   │   ├── gender/route.ts
│   │   │   │   │   ├── age-distribution/route.ts
│   │   │   │   │   └── blood-type/route.ts
│   │   │   │   ├── recipes/        # Recipe data endpoints
│   │   │   │   │   ├── ratings/route.ts
│   │   │   │   │   ├── difficulty/route.ts
│   │   │   │   │   └── cooking-time/route.ts
│   │   │   │   ├── todos/          # Todo completion stats
│   │   │   │   │   └── status/route.ts
│   │   │   │   ├── posts/          # Social post metrics
│   │   │   │   │   └── reactions/route.ts
│   │   │   │   ├── carts/          # Shopping cart analytics
│   │   │   │   │   └── totals/route.ts
│   │   │   │   ├── quotes/         # Quote statistics
│   │   │   │   │   └── authors/route.ts
│   │   │   │   ├── heatmap/        # Heatmap sample data
│   │   │   │   │   └── sample/route.ts
│   │   │   │   ├── weather/        # Weather proxy
│   │   │   │   │   └── temperature/route.ts
│   │   │   │   ├── breweries/      # Brewery data proxy
│   │   │   │   │   └── states/route.ts
│   │   │   │   ├── library/        # Library data proxy
│   │   │   │   │   └── subject-works/route.ts
│   │   │   │   ├── pokemon/        # Pokemon stats proxy
│   │   │   │   │   ├── base-xp/route.ts
│   │   │   │   │   └── height-weight/route.ts
│   │   │   │   └── spacex/         # SpaceX data proxy
│   │   │   │       └── launches/route.ts
│   │   │   └── proxy/route.ts      # General CORS proxy
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Main dashboard page
│   ├── components/
│   │   ├── graphs/                  # Chart components (20+ files)
│   │   │   ├── chartwrapper.tsx    # Generic chart wrapper
│   │   │   ├── d3area.tsx          # D3 area chart
│   │   │   ├── d3line.tsx          # D3 line chart
│   │   │   ├── d3bar.tsx           # D3 bar chart
│   │   │   ├── echartsdonut.tsx    # ECharts donut chart
│   │   │   ├── echartsline.tsx     # ECharts line chart
│   │   │   ├── echartspie.tsx      # ECharts pie chart
│   │   │   ├── echartsbar.tsx      # ECharts bar chart
│   │   │   ├── echartsscatter.tsx  # ECharts scatter chart
│   │   │   ├── echartsradar.tsx    # ECharts radar chart
│   │   │   ├── nivobar.tsx         # Nivo bar chart
│   │   │   ├── nivoheatmap.tsx     # Nivo heatmap
│   │   │   ├── nivoline.tsx        # Nivo line chart
│   │   │   ├── nivopie.tsx         # Nivo pie chart
│   │   │   ├── nivoarea.tsx        # Nivo area (bump) chart
│   │   │   ├── plotlyscatter.tsx   # Plotly scatter plot
│   │   │   ├── plotlyline.tsx      # Plotly line chart
│   │   │   ├── plotlybar.tsx       # Plotly bar chart
│   │   │   ├── plotlypie.tsx       # Plotly pie chart
│   │   │   ├── rechartsbar.tsx     # Recharts bar chart
│   │   │   ├── rechartsline.tsx    # Recharts line chart
│   │   │   ├── recharts-line2.tsx  # Recharts line (alt)
│   │   │   ├── rechartsarea.tsx    # Recharts area chart
│   │   │   ├── rechartspie.tsx     # Recharts pie chart
│   │   │   ├── rechartsradar.tsx   # Recharts radar chart
│   │   │   ├── chartjsbar.tsx      # Chart.js bar chart
│   │   │   ├── chartjsdoughnut.tsx # Chart.js doughnut chart
│   │   │   ├── chartjspie.tsx      # Chart.js pie chart
│   │   │   └── chartjsradar.tsx    # Chart.js radar chart
│   │   ├── ui/
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── checkbox.tsx        # Checkbox component
│   │   │   ├── skeleton.tsx        # Loading skeleton
│   │   │   └── tabs.tsx            # Tabs component
│   │   ├── providers.tsx           # React Query provider setup
│   │   └── sidebar.tsx             # Chart selection sidebar
│   └── lib/
│       ├── charts/
│       │   ├── registry.ts         # Chart registry (106 configurations)
│       │   ├── transforms.ts       # Data transformation functions
│       │   └── types.ts            # Chart type definitions
│       ├── store.ts                # Zustand store configuration
│       └── utils.ts                # Utility functions
├── public/                          # Static assets
├── components.json                  # shadcn/ui configuration
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.mjs                # ESLint configuration
├── postcss.config.mjs               # PostCSS configuration
└── package.json                     # Project dependencies

```

## Getting Started

### Prerequisites
- Node.js 20+ recommended
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## How It Works

### Chart Registry System
The dashboard uses a centralized registry pattern (`src/lib/charts/registry.ts`) that defines all available charts. Each chart configuration includes:
- **Display metadata** (name, display name)
- **API configuration** (endpoint, query key, data transformer)
- **Component** (the chart library component to use)
- **Chart options** (library-specific rendering options)

### Data Flow
1. User selects charts from the sidebar
2. Selection is persisted to URL query parameters
3. TanStack Query fetches data from configured APIs in parallel
4. Data transformers convert API responses to chart-specific formats
5. Charts render with transformed data
6. Results are cached for 5 minutes to reduce API calls

### API Proxy
The `/api/proxy` route handles API requests to avoid CORS issues and supports:
- Simple pass-through proxying
- Multi-fetch enrichment (used by PokéAPI to fetch detailed data)

### State Management
- **Zustand store** manages selected charts and render keys
- **URL params** persist selections across page reloads
- **TanStack Query** handles server state and caching

## Deep Dive: How Charts Work

This section provides a comprehensive walkthrough of how data flows through the system, using the **SpaceX Launches** chart as a concrete example.

### Core Concepts

The dashboard follows a **declarative configuration pattern** where each chart is defined by four key pieces:

1. **Registry Entry** - Metadata and configuration (name, API endpoint, query key)
2. **Transform Function** - Converts raw API data to chart-ready format
3. **Chart Component** - Renders the visualization using a charting library
4. **Chart Options** - Library-specific configuration (titles, colors, axes, etc.)

This separation of concerns allows:
- **Decoupling** - Change the chart library without touching data fetching
- **Reusability** - Same transform can feed multiple chart types
- **Type Safety** - TypeScript ensures data contracts are honored
- **Testability** - Each piece can be tested in isolation

### Complete Example: SpaceX Launches Chart

Let's trace how the **SpaceX: Launches per Year** chart works from backend API to rendered visualization.

#### Step 1: Chart Registry Configuration

**File:** `src/lib/charts/registry.ts:238-249`

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
  chartOptions: {
    title: "SpaceX: Launches per Year",
  },
}
```

**What this defines:**
- `name` - Internal identifier used for selection
- `displayName` - User-facing name in the sidebar
- `endpoint` - SpaceX API endpoint to fetch from
- `queryKey` - TanStack Query cache key (enables caching and deduplication)
- `transform` - Function to convert API response to chart data
- `Component` - D3.js area chart component
- `chartOptions` - Configuration passed to the chart component

#### Step 2: API Request

**File:** `src/app/page.tsx:13-31`

When a user selects this chart, the main page component:

1. Calls `useQueries()` with the chart's configuration
2. TanStack Query checks its cache using `["spacex", "launches"]`
3. If not cached (or stale), fetches via the proxy route:
   ```
   GET /api/proxy?url=https%3A%2F%2Fapi.spacexdata.com%2Fv5%2Flaunches
   ```
4. The proxy route (`src/app/api/proxy/route.ts`) forwards the request and returns the response

**Example Raw API Response** (truncated):

```json
[
  {
    "id": "5eb87cd9ffd86e000604b32a",
    "name": "FalconSat",
    "date_utc": "2006-03-24T22:30:00.000Z",
    "date_local": "2006-03-25T10:30:00+12:00",
    "success": false,
    ...
  },
  {
    "id": "5eb87cdaffd86e000604b32b",
    "name": "DemoSat",
    "date_utc": "2007-03-21T01:10:00.000Z",
    "date_local": "2007-03-21T13:10:00+12:00",
    "success": false,
    ...
  },
  {
    "id": "5eb87cdbffd86e000604b32c",
    "name": "Trailblazer",
    "date_utc": "2008-08-03T03:34:00.000Z",
    "success": false,
    ...
  },
  // ... hundreds more launch objects
]
```

#### Step 3: Data Transformation

**File:** `src/lib/charts/transforms.ts:213-226`

The raw API response is passed to `transformSpaceXForLaunchesPerYearArea()`:

```typescript
export function transformSpaceXForLaunchesPerYearArea(raw: any) {
  const launches = Array.isArray(raw) ? raw : [];
  const counts: Record<string, number> = {};

  // Count launches per year
  for (const l of launches) {
    const y = (l.date_utc || l.date_local || "").slice(0, 4);
    if (y) counts[y] = (counts[y] || 0) + 1;
  }

  // Convert to array of {date, count} objects
  return Object.entries(counts)
    .map(([year, count]) => ({
      date: new Date(`${year}-01-01T00:00:00Z`),
      count,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
```

**What this does:**
1. Safely handles non-array responses
2. Extracts the year from each launch's UTC date (first 4 characters)
3. Aggregates launches by year into a `Record<year, count>` object
4. Converts to an array of `{date: Date, count: number}` objects
5. Sorts chronologically by date

**Example Transformed Data:**

```javascript
[
  { date: Date('2006-01-01T00:00:00Z'), count: 1 },
  { date: Date('2007-01-01T00:00:00Z'), count: 1 },
  { date: Date('2008-01-01T00:00:00Z'), count: 2 },
  { date: Date('2009-01-01T00:00:00Z'), count: 3 },
  { date: Date('2010-01-01T00:00:00Z'), count: 2 },
  // ... continues through present year
  { date: Date('2023-01-01T00:00:00Z'), count: 98 },
  { date: Date('2024-01-01T00:00:00Z'), count: 134 },
]
```

#### Step 4: Chart Rendering

**File:** `src/components/graphs/d3area.tsx:8-84`

The D3 Area Chart component receives the transformed data and renders it:

**Key rendering steps:**

1. **Setup** (lines 11-12):
   ```typescript
   const dims = { width: 800, height: 360, margin: { top: 20, right: 20, bottom: 30, left: 40 } };
   const series = useMemo(() => data ?? [], [data]);
   ```

2. **Create Scales** (lines 28-37):
   ```typescript
   // X-axis: Date scale from min to max date
   const x = d3.scaleUtc()
     .domain(d3.extent(series, (d: any) => d.date) as [Date, Date])
     .range([0, innerW]);

   // Y-axis: Linear scale from 0 to max count
   const y = d3.scaleLinear()
     .domain([0, d3.max(series, (d: any) => d.count)!])
     .nice()
     .range([innerH, 0]);
   ```

3. **Define Area Generator** (lines 39-43):
   ```typescript
   const area = d3.area<any>()
     .x((d) => x(d.date))      // X position based on date
     .y0(innerH)                // Bottom of area (baseline)
     .y1((d) => y(d.count));   // Top of area (based on count)
   ```

4. **Render Area + Line** (lines 45-52):
   ```typescript
   // Draw filled area with 20% opacity
   g.append("path").datum(series)
     .attr("d", area as any)
     .attr("fill", "currentColor")
     .attr("opacity", 0.2);

   // Draw line on top
   g.append("path").datum(series)
     .attr("d", line as any)
     .attr("fill", "none")
     .attr("stroke", "currentColor")
     .attr("stroke-width", 2);
   ```

5. **Add Axes** (lines 54-55):
   ```typescript
   g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
   g.append("g").call(d3.axisLeft(y));
   ```

**Visual Output:**

The final rendered chart shows:
- **X-axis**: Years from 2006 to present
- **Y-axis**: Launch count (0 to ~140)
- **Area**: Light shaded region showing growth in launch frequency
- **Line**: Solid line tracing the upper boundary of launches per year
- **Trend**: Exponential growth in SpaceX launches, especially 2020-2024

### Data Flow Summary

```
User Selection
    ↓
Registry Lookup → {endpoint, queryKey, transform, Component, options}
    ↓
TanStack Query → Check cache with queryKey
    ↓
Cache Miss → Fetch via /api/proxy?url={endpoint}
    ↓
SpaceX API → Returns array of launch objects
    ↓
Transform Function → Aggregates by year, formats as {date, count}[]
    ↓
React Component → D3.js renders area chart with scales, area, line, axes
    ↓
Browser DOM → User sees interactive SVG visualization
```

### Why This Architecture?

**Benefits:**
- **Maintainability** - Each chart is ~10 lines of config + transform function
- **Flexibility** - Swap Nivo for Recharts by changing one line
- **Performance** - TanStack Query handles caching, deduplication, retries
- **DX** - Add new charts without touching the core data fetching logic
- **Type Safety** - Centralized types ensure consistency across 20+ charts

**Trade-offs:**
- More abstraction layers vs. inline data fetching
- Learning curve for the registry pattern
- All charts must conform to the same data flow

This pattern scales elegantly from 1 chart to 100+ while keeping the codebase maintainable and the user experience performant.

## Chart Examples

The dashboard includes **106 chart visualizations** across 6 charting libraries, showcasing:

### Data Categories
- **Product Analytics** - Price/rating comparisons, category distributions, brand counts, stock levels, discounts, price distributions
- **User Demographics** - Gender splits, age distributions, blood type breakdowns
- **Recipe Metrics** - Ratings, difficulty levels, cooking times
- **Social Engagement** - Post reactions, todo completion status, quote authorship
- **E-commerce** - Shopping cart totals
- **External APIs** - Weather temperatures, brewery counts, library works, Pokemon stats, SpaceX launches

### Chart Type Coverage
Each data source is visualized using multiple chart types across different libraries:
- **Line Charts** - Trends and time series (Nivo, Recharts, D3, Plotly, ECharts)
- **Bar Charts** - Categorical comparisons (Nivo, Recharts, D3, Plotly, ECharts, Chart.js)
- **Pie/Doughnut Charts** - Proportional data (Nivo, Recharts, Plotly, ECharts, Chart.js)
- **Area Charts** - Filled trends (Nivo, Recharts, D3)
- **Scatter Charts** - Two-variable correlations (Plotly, ECharts)
- **Radar Charts** - Multi-dimensional metrics (Recharts, ECharts, Chart.js)
- **Heatmaps** - Matrix visualizations (Nivo)

This comprehensive coverage enables side-by-side comparison of how different libraries render the same data.

## Performance Optimizations

- **Dynamic imports** for all chart components (code splitting)
- **TanStack Query caching** (5-min fresh, 15-min cache retention)
- **Parallel data fetching** with `useQueries`
- **Smart refetch policies** (no refetch on window focus/mount/reconnect)
- **Memoized computations** for chart data transformations
- **URL-based state** reduces unnecessary re-renders
- **React Compiler** enabled for automatic optimizations

## Customization

### Adding New Charts

1. Create a chart component in `src/components/graphs/`
2. Add a data transformer in `src/lib/charts/transforms.ts`
3. Register the chart in `src/lib/charts/registry.ts`

Example:
```typescript
{
  name: "My Chart",
  displayName: "My Custom Chart",
  apiConfig: {
    endpoint: "https://api.example.com/data",
    queryKey: ["my-chart"],
    transform: transformMyData,
  },
  Component: MyChartComponent,
  chartOptions: {
    title: "My Chart Title",
    // ... library-specific options
  },
}
```

### Changing Chart Libraries

Each chart in the registry can use any compatible charting library. Simply swap the `Component` and adjust the `chartOptions` accordingly.

## Environment

- **Development port**: 3000
- **API proxy**: `/api/proxy?url={encoded_url}`

## Browser Compatibility

Modern browsers supporting ES2020+:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Known Issues

- Some public APIs may have rate limits
- CORS issues are handled via the proxy route
- Chart re-rendering is optimized with render keys

## License

Private project (not for distribution)

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### Charting Library Documentation
- [Nivo](https://nivo.rocks/)
- [ECharts](https://echarts.apache.org/)
- [Recharts](https://recharts.org/)
- [Chart.js](https://www.chartjs.org/)
- [Plotly](https://plotly.com/javascript/)
- [D3.js](https://d3js.org/)

## Deployment

The easiest way to deploy is using **[Vercel](https://vercel.com/)**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/dashboard)

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
