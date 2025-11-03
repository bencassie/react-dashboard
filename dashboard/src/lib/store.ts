import { create } from "zustand";

type Store = {
  selectedGraphs: string[];
  renderKeys: Record<string, number>;
  toggleGraph: (name: string) => void;
};

export const useStore = create<Store>()((set, get) => ({
  selectedGraphs: [],
  renderKeys: {},
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
}));