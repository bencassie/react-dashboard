"use client";
import { memo, useMemo } from "react";
import type {
  FilterConfig,
  ChartFilterState,
  FilterValue,
  RangeValue,
} from "@/lib/charts/filter-types";
import { FilterSingleSelect } from "./FilterSingleSelect";
import { FilterMultiSelect } from "./FilterMultiSelect";
import { FilterRange } from "./FilterRange";
import { FilterText } from "./FilterText";
import { useFilterOptions } from "./useFilterOptions";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type FilterContainerProps = {
  filters: FilterConfig[];
  values: ChartFilterState;
  rawData: any[] | undefined;
  onChange: (filterId: string, value: FilterValue) => void;
  onReset: () => void;
  layout?: "inline" | "panel";
};

export const FilterContainer = memo(function FilterContainer({
  filters,
  values,
  rawData,
  onChange,
  onReset,
  layout = "inline",
}: FilterContainerProps) {
  // Derive auto options from data
  const resolvedFilters = useFilterOptions(filters, rawData);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.some((f) => {
      const value = values[f.id];
      if (value === undefined || value === null) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "string" && value === "") return false;

      // For range, check if different from bounds
      if (f.type === "range") {
        const bounds = f.bounds === "auto" ? { min: 0, max: 100 } : f.bounds;
        const rangeValue = value as RangeValue;
        return rangeValue.min > bounds.min || rangeValue.max < bounds.max;
      }

      return true;
    });
  }, [filters, values]);

  if (resolvedFilters.length === 0) {
    return null;
  }

  const containerClass =
    layout === "inline"
      ? "flex flex-wrap gap-2 items-center py-2"
      : "flex flex-col gap-3 p-3 bg-muted/30 rounded-md";

  return (
    <div className={containerClass}>
      {resolvedFilters.map((filter) => {
        const value = values[filter.id] ?? filter.defaultValue;

        switch (filter.type) {
          case "single-select":
            return (
              <FilterSingleSelect
                key={filter.id}
                config={filter}
                value={value as string | null}
                onChange={(v) => onChange(filter.id, v)}
              />
            );
          case "multi-select":
            return (
              <FilterMultiSelect
                key={filter.id}
                config={filter}
                value={value as string[]}
                onChange={(v) => onChange(filter.id, v)}
              />
            );
          case "range":
            return (
              <FilterRange
                key={filter.id}
                config={filter}
                value={value as RangeValue}
                onChange={(v) => onChange(filter.id, v)}
              />
            );
          case "text":
            return (
              <FilterText
                key={filter.id}
                config={filter}
                value={value as string}
                onChange={(v) => onChange(filter.id, v)}
              />
            );
          default:
            return null;
        }
      })}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
});
