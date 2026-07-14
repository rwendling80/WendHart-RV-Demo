// Defines which spec fields belong to each inventory category and how to
// label/format them. A future cars/boats/powersports edition adds a new
// entry here (and to `unitTypeOptions`) instead of changing the database
// schema or rewriting the spec table / filter UI.

export type SpecField = {
  key: string;
  label: string;
  unit?: string;
  format?: (value: unknown) => string;
};

export const categorySpecFields: Record<string, SpecField[]> = {
  rv: [
    { key: "length_ft", label: "Length", unit: "ft" },
    { key: "weight_lbs", label: "Weight", unit: "lbs" },
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
