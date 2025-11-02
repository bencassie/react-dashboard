import { useState, useEffect, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChartComponentProps } from "@/lib/charts/types";

const ChartLoadingFallback = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 w-48 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-96 w-full" />
    </CardContent>
  </Card>
);

/**
 * Wrapper that adds a brief skeleton delay when charts are toggled
 * (but not on initial page load)
 */
type ChartWrapperProps = ChartComponentProps & {
  Component: ComponentType<ChartComponentProps>;
};

export function ChartWrapper({
  Component,
  renderKey,
  ...props
}: ChartWrapperProps) {
  const [isReady, setIsReady] = useState(false);

  // Skip delay on initial render (renderKey 0 or undefined)
  const shouldDelay = renderKey && renderKey > 0;

  useEffect(() => {
    if (shouldDelay) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      // No delay for initial render
      setIsReady(true);
    }
  }, [shouldDelay]);

  if (shouldDelay && !isReady) {
    return <ChartLoadingFallback />;
  }

  return <Component {...props} />;
}