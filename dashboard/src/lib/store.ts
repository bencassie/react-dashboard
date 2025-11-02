import { create } from "zustand";

type Store = {
  selectedGraphs: string[];
  renderKeys: Record<string, number>;
  toggleGraph: (name: string) => void;
};

export const useStore = create<Store>()((set, get) => ({
  selectedGraphs: [],
  renderKeys: {},
  toggleGraph: (name) =>
    set((state) => {
      const isSelected = state.selectedGraphs.includes(name);
      if (isSelected) {
        return {
          selectedGraphs: state.selectedGraphs.filter((g) => g !== name),
        };
      } else {
        const newKeys = { ...state.renderKeys };
        newKeys[name] = (newKeys[name] || 0) + 1;
        return {
          selectedGraphs: [...state.selectedGraphs, name],
          renderKeys: newKeys,
        };
      }
    }),
}));