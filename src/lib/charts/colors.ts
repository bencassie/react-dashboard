/**
 * Pastel color palette for charts
 * Soft, pleasing colors with enough contrast for data visualization
 */

export const PASTEL_COLORS = [
  "#A8D5BA", // Soft mint green
  "#FFB5C2", // Pastel pink
  "#B5D3E7", // Powder blue
  "#F7D794", // Soft yellow
  "#DDA5E0", // Lavender
  "#A8E6CF", // Mint
  "#FECA9A", // Peach
  "#C7B8EA", // Periwinkle
  "#FFB3BA", // Light coral
  "#BAE1FF", // Baby blue
  "#D4A5A5", // Dusty rose
  "#B5EAD7", // Sea foam
  "#E2C2FF", // Lilac
  "#FFD4A3", // Cream
  "#C2E0FF", // Sky blue
];

export const PASTEL_COLORS_SEMI_TRANSPARENT = PASTEL_COLORS.map(
  color => `${color}CC` // Add 80% opacity
);

export const PASTEL_COLORS_RGBA = [
  "rgba(168, 213, 186, 0.8)", // Soft mint green
  "rgba(255, 181, 194, 0.8)", // Pastel pink
  "rgba(181, 211, 231, 0.8)", // Powder blue
  "rgba(247, 215, 148, 0.8)", // Soft yellow
  "rgba(221, 165, 224, 0.8)", // Lavender
  "rgba(168, 230, 207, 0.8)", // Mint
  "rgba(254, 202, 154, 0.8)", // Peach
  "rgba(199, 184, 234, 0.8)", // Periwinkle
  "rgba(255, 179, 186, 0.8)", // Light coral
  "rgba(186, 225, 255, 0.8)", // Baby blue
  "rgba(212, 165, 165, 0.8)", // Dusty rose
  "rgba(181, 234, 215, 0.8)", // Sea foam
  "rgba(226, 194, 255, 0.8)", // Lilac
  "rgba(255, 212, 163, 0.8)", // Cream
  "rgba(194, 224, 255, 0.8)", // Sky blue
];

export const PASTEL_COLORS_BORDER = [
  "rgba(168, 213, 186, 1)", // Soft mint green
  "rgba(255, 181, 194, 1)", // Pastel pink
  "rgba(181, 211, 231, 1)", // Powder blue
  "rgba(247, 215, 148, 1)", // Soft yellow
  "rgba(221, 165, 224, 1)", // Lavender
  "rgba(168, 230, 207, 1)", // Mint
  "rgba(254, 202, 154, 1)", // Peach
  "rgba(199, 184, 234, 1)", // Periwinkle
  "rgba(255, 179, 186, 1)", // Light coral
  "rgba(186, 225, 255, 1)", // Baby blue
  "rgba(212, 165, 165, 1)", // Dusty rose
  "rgba(181, 234, 215, 1)", // Sea foam
  "rgba(226, 194, 255, 1)", // Lilac
  "rgba(255, 212, 163, 1)", // Cream
  "rgba(194, 224, 255, 1)", // Sky blue
];

/**
 * Get a color from the palette by index
 * Wraps around if index exceeds palette length
 */
export function getPastelColor(index: number): string {
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
}

/**
 * Get an array of colors for a given count
 */
export function getPastelColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getPastelColor(i));
}
