"use client";
import { memo, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import type { SingleSelectFilterConfig } from "@/lib/charts/filter-types";

type Props = {
  config: SingleSelectFilterConfig;
  value: string | null;
  onChange: (value: string | null) => void;
};

export const FilterSingleSelect = memo(function FilterSingleSelect({
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

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-xs"
        onClick={() => setOpen(!open)}
      >
        {config.label}
        {value && (
          <>
            <span className="ml-1 text-muted-foreground">: {value}</span>
            <X
              className="h-3 w-3 ml-1 hover:text-destructive"
              onClick={handleClear}
            />
          </>
        )}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 min-w-[140px] max-h-60 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2 py-1">No options</p>
          ) : (
            options.map((option) => (
              <button
                key={option}
                className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted ${
                  value === option ? "bg-muted font-medium" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
});
