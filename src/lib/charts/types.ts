import { ComponentType } from "react";
import type { ChartFilterConfig, ChartFilterState, FilterValue } from "./filter-types";

/**
 * Configuration for a chart's API call
 */
export type ChartApiConfig = {
  /** Unique endpoint for this chart's data */
  endpoint: string;
  /** React Query key for caching */
  queryKey: string[];
  /**
   * Transform raw API response into chart-ready data
   * Optional filters parameter for client-side filtering
   */
  transform: (raw: any, filters?: ChartFilterState) => any;
  /** Optional: Additional fetch options */
  fetchOptions?: RequestInit;
  /**
   * Data source identifier for sharing raw data between charts.
   * Charts with same dataSourceId share cached raw data.
   */
  dataSourceId?: string;
};

/**
 * Complete configuration for a chart module
 */
export type ChartConfig = {
  /** Unique identifier for the chart */
  name: string;
  /** Display name shown in UI */
  displayName: string;
  /** API configuration for this chart */
  apiConfig: ChartApiConfig;
  /** The chart component to render */
  Component: ComponentType<ChartComponentProps>;
  /** Optional: Chart-specific rendering options */
  chartOptions?: Record<string, any>;
  /** Optional: Filter configuration for interactive filtering */
  filterConfig?: ChartFilterConfig;
};

/**
 * Props that all chart components receive
 */
export type ChartComponentProps = {
  /** Transformed data ready for rendering */
  data: any;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Render key for remounting */
  renderKey?: number;
  /** Chart configuration (title, labels, etc.) */
  options?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  /** Current filter state for display purposes */
  activeFilters?: ChartFilterState;
  /** Callback when filter changes (for embedded filter UI) */
  onFilterChange?: (filterId: string, value: FilterValue) => void;
};