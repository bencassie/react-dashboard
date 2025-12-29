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

  // Local state for smooth slider dragging (only commits on release)
  const [localMin, setLocalMin] = useState(value.min);
  const [localMax, setLocalMax] = useState(value.max);
  const [isDragging, setIsDragging] = useState(false);

  // Sync local state when external value changes (e.g., reset)
  useEffect(() => {
    if (!isDragging) {
      setLocalMin(value.min);
      setLocalMax(value.max);
    }
  }, [value.min, value.max, isDragging]);

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

  // Update local state while dragging (fast, no chart re-render)
  const handleMinInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      setLocalMin(Math.min(newMin, localMax));
    },
    [localMax]
  );

  const handleMaxInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      setLocalMax(Math.max(newMax, localMin));
    },
    [localMin]
  );

  // Commit value to parent only on mouse/pointer up (triggers chart re-render)
  const handleMinCommit = useCallback(() => {
    setIsDragging(false);
    const newMin = Math.min(localMin, localMax);
    if (newMin !== value.min) {
      onChange({ ...value, min: newMin });
    }
  }, [localMin, localMax, value, onChange]);

  const handleMaxCommit = useCallback(() => {
    setIsDragging(false);
    const newMax = Math.max(localMax, localMin);
    if (newMax !== value.max) {
      onChange({ ...value, max: newMax });
    }
  }, [localMin, localMax, value, onChange]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalMin(bounds.min);
      setLocalMax(bounds.max);
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
                Min: {formatValue(localMin)}
              </label>
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={step}
                value={localMin}
                onChange={handleMinInput}
                onMouseDown={handleDragStart}
                onMouseUp={handleMinCommit}
                onTouchStart={handleDragStart}
                onTouchEnd={handleMinCommit}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Max: {formatValue(localMax)}
              </label>
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={step}
                value={localMax}
                onChange={handleMaxInput}
                onMouseDown={handleDragStart}
                onMouseUp={handleMaxCommit}
                onTouchStart={handleDragStart}
                onTouchEnd={handleMaxCommit}
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
