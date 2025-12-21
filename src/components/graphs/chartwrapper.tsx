import { useState, useEffect, ComponentType } from "react";
import type { ChartComponentProps } from "@/lib/charts/types";

/**
 * Wrapper that:
 *  - Debounces initial "loading" so quick requests don't show skeletons.
 *  - Preserves a tiny delay on toggle via renderKey for a smoother remount.
 *  - Passes a *gated* isLoading to the chart, so charts control their own UI.
 */
type ChartWrapperProps = ChartComponentProps & {
  Component: ComponentType<ChartComponentProps>;
  debounceMs?: number; // default 150ms
  toggleDelayMs?: number; // default 50ms
};

export function ChartWrapper({
  Component,
  renderKey,
  isLoading,
  debounceMs = 150,
  toggleDelayMs = 50,
  ...props
}: ChartWrapperProps) {
  const [passedDebounce, setPassedDebounce] = useState(false);
  const [toggleReady, setToggleReady] = useState(false);

  // Debounce initial load
  useEffect(() => {
    if (!isLoading) {
      setPassedDebounce(true);
      return;
    }
    setPassedDebounce(false);
    const t = setTimeout(() => setPassedDebounce(true), debounceMs);
    return () => clearTimeout(t);
  }, [isLoading, debounceMs]);

  // Small delay on toggle (renderKey > 0)
  const shouldDelay = renderKey && renderKey > 0;
  useEffect(() => {
    if (shouldDelay) {
      setToggleReady(false);
      const t = setTimeout(() => setToggleReady(true), toggleDelayMs);
      return () => clearTimeout(t);
    } else {
      setToggleReady(true);
    }
  }, [shouldDelay, toggleDelayMs]);

  // Only show loading when:
  // - we are past the debounce (to prevent flash on fast loads), OR
  // - we are in the toggle-delay window (to preserve your intended UX)
  const showLoading = (!toggleReady) || (isLoading && passedDebounce);

  return (
    <Component
      {...props}
      isLoading={showLoading}
      renderKey={renderKey}
    />
  );
}
