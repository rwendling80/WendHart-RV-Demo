export type VinDecodeResult = {
  year?: number;
  make?: string;
  model?: string;
  rvType?: string;
};

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Free, no-key NHTSA vPIC API. Decodes the manufacturer-encoded info baked
// into the VIN itself (year/make/model/body class) — it does not look up
// a specific vehicle record, so results vary in completeness by manufacturer.
export async function decodeVin(vin: string): Promise<VinDecodeResult | null> {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(
      vin
    )}?format=json`
  );
  if (!res.ok) return null;

  const data = await res.json();
  const result = data?.Results?.[0];
  if (!result) return null;

  const year = Number(result.ModelYear);
  const bodyClass = String(result.BodyClass ?? "").toLowerCase();

  let rvType: string | undefined;
  if (bodyClass.includes("motor home") || bodyClass.includes("motorhome")) {
    rvType = "motorhome";
  }

  return {
    year: Number.isFinite(year) && year > 0 ? year : undefined,
    make: result.Make ? titleCase(result.Make) : undefined,
    model: result.Model || undefined,
    rvType,
  };
}
