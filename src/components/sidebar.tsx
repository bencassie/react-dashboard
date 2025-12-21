"use client";
import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CardTitle } from "@/components/ui/card";

type SidebarProps = {
  charts: Array<{ name: string; displayName: string }>;
  selectedGraphs: string[];
  onToggle: (name: string) => void;
};

const CheckboxRow = memo(({ 
  name, 
  displayName, 
  checked, 
  onToggle 
}: { 
  name: string; 
  displayName: string; 
  checked: boolean; 
  onToggle: (name: string) => void;
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={name}
      checked={checked}
      onCheckedChange={() => onToggle(name)}
    />
    <label htmlFor={name} className="text-sm font-medium cursor-pointer">
      {displayName}
    </label>
  </div>
));

CheckboxRow.displayName = "CheckboxRow";

export const Sidebar = memo(({ charts, selectedGraphs, onToggle }: SidebarProps) => {
  return (
    <div className="w-64 border-r bg-muted/40 p-4 flex flex-col gap-2">
      <CardTitle className="text-lg font-bold">Graphs</CardTitle>
      {charts.map((chart) => (
        <CheckboxRow
          key={chart.name}
          name={chart.name}
          displayName={chart.displayName}
          checked={selectedGraphs.includes(chart.name)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
});

Sidebar.displayName = "Sidebar";