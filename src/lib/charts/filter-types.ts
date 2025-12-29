// ============================================================================
// FILTER VALUE TYPES
// ============================================================================

/** Single value selection */
export type SingleSelectValue = string | null;

/** Multiple value selection */
export type MultiSelectValue = string[];

/** Numeric range with min/max bounds */
export type RangeValue = {
  min: number;
  max: number;
};

/** Text search value */
export type TextFilterValue = string;

/** Union of all possible filter values */
export type FilterValue =
  | SingleSelectValue
  | MultiSelectValue
  | RangeValue
  | TextFilterValue;

// ============================================================================
// FILTER CONFIGURATION TYPES
// ============================================================================

/** Base filter configuration shared by all types */
interface BaseFilterConfig {
  /** Unique identifier for this filter */
  id: string;
  /** Display label in UI */
  label: string;
  /** Field path in raw data to filter on (supports dot notation: "user.address.city") */
  field: string;
  /** Optional description for tooltip */
  description?: string;
}

/** Dropdown single-select filter */
export interface SingleSelectFilterConfig extends BaseFilterConfig {
  type: "single-select";
  defaultValue: SingleSelectValue;
  /** Static options, or "auto" to derive from data */
  options: string[] | "auto";
}

/** Multi-select checkbox filter */
export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: "multi-select";
  defaultValue: MultiSelectValue;
  /** Static options, or "auto" to derive from data */
  options: string[] | "auto";
  /** Max options to show before collapsing */
  maxVisible?: number;
}

/** Numeric range slider filter */
export interface RangeFilterConfig extends BaseFilterConfig {
  type: "range";
  defaultValue: RangeValue;
  /** Fixed bounds, or "auto" to derive from data */
  bounds: { min: number; max: number } | "auto";
  /** Step size for slider */
  step?: number;
  /** Format function for display (e.g., currency) */
  formatValue?: (value: number) => string;
}

/** Text search filter */
export interface TextFilterConfig extends BaseFilterConfig {
  type: "text";
  defaultValue: TextFilterValue;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounceMs?: number;
}

/** Union of all filter config types */
export type FilterConfig =
  | SingleSelectFilterConfig
  | MultiSelectFilterConfig
  | RangeFilterConfig
  | TextFilterConfig;

// ============================================================================
// FILTER STATE TYPES
// ============================================================================

/** Current filter values for a single chart */
export type ChartFilterState = Record<string, FilterValue>;

/** All chart filter states, keyed by chart name */
export type AllFilterState = Record<string, ChartFilterState>;

// ============================================================================
// CHART FILTER CONFIGURATION
// ============================================================================

/** Filter configuration for a chart */
export type ChartFilterConfig = {
  /** Array of filter definitions */
  filters: FilterConfig[];
  /**
   * Whether to show filter UI collapsed by default
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Layout: "inline" shows filters in chart header,
   * "panel" shows in expandable side panel
   * @default "inline"
   */
  layout?: "inline" | "panel";
};
