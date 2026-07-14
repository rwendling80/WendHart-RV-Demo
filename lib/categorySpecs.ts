// Defines which spec fields belong to each inventory category and how to
// label/format them. A future cars/boats/powersports edition adds a new
// entry here (and to `unitTypeOptions`) instead of changing the database
// schema or rewriting the spec table / filter UI.

export type SpecField = {
  key: string;
  label: string;
  unit?: string;
  format?: (value: unknown) => string;
  // If set, this field only shows for units whose rv_type is in this list
  // (e.g. mileage only makes sense for motorized units). Omit to show for
  // every rv_type in the category.
  showForTypes?: string[];
};

function formatNumber(value: unknown): string {
  const num = Number(value);
  return Number.isFinite(num) ? num.toLocaleString("en-US") : String(value);
}

export const categorySpecFields: Record<string, SpecField[]> = {
  rv: [
    {
      key: "mileage",
      label: "Mileage",
      unit: "mi",
      showForTypes: ["motorhome"],
      format: (v) => `${formatNumber(v)} mi`,
    },
    { key: "length_ft", label: "Length", unit: "ft" },
    {
      key: "weight_lbs",
      label: "Weight",
      unit: "lbs",
      format: (v) => `${formatNumber(v)} lbs`,
    },
    { key: "sleeps", label: "Sleeps" },
    { key: "slides", label: "Slides" },
    {
      key: "generator",
      label: "Generator",
      format: (v) => (v ? "Yes" : "No"),
    },
    { key: "fresh_tank_gal", label: "Fresh tank", unit: "gal" },
    { key: "gray_tank_gal", label: "Gray tank", unit: "gal" },
    { key: "black_tank_gal", label: "Black tank", unit: "gal" },
  ],
};

export const unitTypeOptions: Record<string, { value: string; label: string }[]> = {
  rv: [
    { value: "travel_trailer", label: "Travel Trailer" },
    { value: "fifth_wheel", label: "Fifth Wheel" },
    { value: "motorhome", label: "Motorhome" },
    { value: "toy_hauler", label: "Toy Hauler" },
  ],
};
