import { ComponentType } from "react";

export type GraphModule = {
  name: string;
  Component: ComponentType<{ 
    data?: any; 
    isLoading?: boolean; 
    error?: Error;
    renderKey?: number;
  }>;
};