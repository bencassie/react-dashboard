"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";
import type { MultiSelectFilterConfig } from "@/lib/charts/filter-types";

type Props = {
  config: MultiSelectFilterConfig;
  value: string[];
  onChange: (value: string[]) => void;
};

export const FilterMultiSelect = memo(function FilterMultiSelect({
  config,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const options = Array.isArray(config.options) ? config.options : [];

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

  const handleToggle = useCallback(
    (option: string) => {
      const newValue = value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option];
      onChange(newValue);
    },
    [value, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange([]);
    },
    [onChange]
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
        {value.length > 0 && (
          <>
            <Badge variant="secondary" className="ml-1 px-1 text-xs">
              {value.length}
            </Badge>
            <X
              className="h-3 w-3 ml-1 hover:text-destructive"
              onClick={handleClear}
            />
          </>
        )}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 min-w-[180px] max-h-60 overflow-y-auto rounded-md border bg-popover p-2 shadow-md">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2 py-1">No options</p>
          ) : (
            options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={value.includes(option)}
                  onCheckedChange={() => handleToggle(option)}
                />
                <span className="truncate">{option}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
});
