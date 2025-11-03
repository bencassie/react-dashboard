import { ComponentType } from "react";

/**
 * Configuration for a chart's API call
 */
export type ChartApiConfig = {
  /** Unique endpoint for this chart's data */
  endpoint: string;
  /** React Query key for caching */
  queryKey: string[];
  /** Transform raw API response into chart-ready data */
  transform: (raw: any) => any;
  /** Optional: Additional fetch options */
  fetchOptions?: RequestInit;
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
};