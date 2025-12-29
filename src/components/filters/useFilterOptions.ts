import { useMemo } from "react";
import type { FilterConfig } from "@/lib/charts/filter-types";
import { getFieldValue } from "@/lib/charts/transforms";

/**
 * Hook to resolve "auto" options and bounds from raw data
 */
export function useFilterOptions(
  filters: FilterConfig[],
  rawData: any[] | undefined
): FilterConfig[] {
  return useMemo(() => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return filters;
    }

    return filters.map((filter) => {
      // Handle "auto" options for select filters
      if (
        (filter.type === "single-select" || filter.type === "multi-select") &&
        filter.options === "auto"
      ) {
        const uniqueValues = new Set<string>();
        rawData.forEach((item) => {
          const value = getFieldValue(item, filter.field);
          if (value !== undefined && value !== null && value !== "") {
            uniqueValues.add(String(value));
          }
        });
        return {
          ...filter,
          options: Array.from(uniqueValues).sort(),
        };
      }

      // Handle "auto" bounds for range filters
      if (filter.type === "range" && filter.bounds === "auto") {
        let min = Infinity;
        let max = -Infinity;
        rawData.forEach((item) => {
          const value = Number(getFieldValue(item, filter.field));
          if (!isNaN(value)) {
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
        });

        const resolvedMin = min === Infinity ? 0 : Math.floor(min);
        const resolvedMax = max === -Infinity ? 100 : Math.ceil(max);

        return {
          ...filter,
          bounds: { min: resolvedMin, max: resolvedMax },
          defaultValue: { min: resolvedMin, max: resolvedMax },
        };
      }

      return filter;
    });
  }, [filters, rawData]);
}
