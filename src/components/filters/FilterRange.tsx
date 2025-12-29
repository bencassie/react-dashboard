"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import type { RangeFilterConfig, RangeValue } from "@/lib/charts/filter-types";

type Props = {
  config: RangeFilterConfig;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
};

export const FilterRange = memo(function FilterRange({
  config,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const bounds =
    config.bounds === "auto"
      ? { min: 0, max: 100 }
      : config.bounds;

  const step = config.step ?? 1;
  const formatValue = config.formatValue ?? ((v: number) => String(v));

  // Check if filter is active (different from default/bounds)
  const isActive = value.min > bounds.min || value.max < bounds.max;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      onChange({ ...value, min: Math.min(newMin, value.max) });
    },
    [value, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      onChange({ ...value, max: Math.max(newMax, value.min) });
    },
    [value, onChange]
  );

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange({ min: bounds.min, max: bounds.max });
    },
    [bounds, onChange]
  );

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-xs"
        onClick={() => setOpen(!open)}
      >
        {config.label}
        {isActive && (
          <>
            <span className="ml-1 text-muted-foreground">
              : {formatValue(value.min)} - {formatValue(value.max)}
            </span>
            <X
              className="h-3 w-3 ml-1 hover:text-destructive"
              onClick={handleReset}
            />
          </>
        )}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-64 rounded-md border bg-popover p-3 shadow-md">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">
                Min: {formatValue(value.min)}
              </label>
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={step}
                value={value.min}
                onChange={handleMinChange}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Max: {formatValue(value.max)}
              </label>
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={step}
                value={value.max}
                onChange={handleMaxChange}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatValue(bounds.min)}</span>
              <span>{formatValue(bounds.max)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
