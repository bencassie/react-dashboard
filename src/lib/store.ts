import { create } from "zustand";
import type { AllFilterState, ChartFilterState, FilterValue } from "./charts/filter-types";

type Store = {
  // Chart selection state
  selectedGraphs: string[];
  renderKeys: Record<string, number>;
  toggleGraph: (name: string) => void;
  setSelectedGraphs: (names: string[]) => void;

  // Filter state
  chartFilters: AllFilterState;
  setFilter: (chartName: string, filterId: string, value: FilterValue) => void;
  setFilters: (chartName: string, filters: ChartFilterState) => void;
  resetFilters: (chartName: string) => void;
  resetAllFilters: () => void;
};

export const useStore = create<Store>()((set, get) => ({
  // Chart selection state
  selectedGraphs: [],
  renderKeys: {},
  chartFilters: {},

  toggleGraph: (name) => {
    const { selectedGraphs, renderKeys } = get();
    const isSelected = selectedGraphs.includes(name);

    if (isSelected) {
      // Removing: just filter out
      set({ selectedGraphs: selectedGraphs.filter((g) => g !== name) });
    } else {
      // Adding: increment render key and add to selection
      const newKeys = { ...renderKeys };
      newKeys[name] = (newKeys[name] || 0) + 1;
      set({
        selectedGraphs: [...selectedGraphs, name],
        renderKeys: newKeys,
      });
    }
  },

  setSelectedGraphs: (names) => {
    const { renderKeys } = get();
    const newKeys = { ...renderKeys };
    // Increment render key for newly selected charts
    names.forEach((name) => {
      newKeys[name] = (newKeys[name] || 0) + 1;
    });
    set({
      selectedGraphs: names,
      renderKeys: newKeys,
    });
  },

  // Filter actions
  setFilter: (chartName, filterId, value) => {
    const { chartFilters } = get();
    set({
      chartFilters: {
        ...chartFilters,
        [chartName]: {
          ...chartFilters[chartName],
          [filterId]: value,
        },
      },
    });
  },

  setFilters: (chartName, filters) => {
    const { chartFilters } = get();
    set({
      chartFilters: {
        ...chartFilters,
        [chartName]: filters,
      },
    });
  },

  resetFilters: (chartName) => {
    const { chartFilters } = get();
    const newFilters = { ...chartFilters };
    delete newFilters[chartName];
    set({ chartFilters: newFilters });
  },

  resetAllFilters: () => {
    set({ chartFilters: {} });
  },
}));

// Selector hooks for performance
export const useChartFilters = (chartName: string) =>
  useStore((state) => state.chartFilters[chartName] ?? {});

export const useSetFilter = () => useStore((state) => state.setFilter);

export const useResetFilters = () => useStore((state) => state.resetFilters);