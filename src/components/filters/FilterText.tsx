"use client";
import { memo, useState, useCallback, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

import type { TextFilterConfig } from "@/lib/charts/filter-types";

type Props = {
  config: TextFilterConfig;
  value: string;
  onChange: (value: string) => void;
};

export const FilterText = memo(function FilterText({
  config,
  value,
  onChange,
}: Props) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const debounceMs = config.debounceMs ?? 300;

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      // Debounce the onChange callback
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [onChange]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-2 h-3 w-3 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={config.placeholder || `Search ${config.label}...`}
        className="h-8 w-40 pl-7 pr-7 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
});
