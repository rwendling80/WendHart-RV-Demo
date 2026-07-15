import { unitTypeOptions } from "@/lib/categorySpecs";

export type DescriptionInput = {
  year?: string | number | null;
  make?: string | null;
  model?: string | null;
  rvType?: string | null;
  sleeps?: string | number | null;
  lengthFt?: string | number | null;
  mileage?: string | number | null;
  hasGenerator?: boolean;
};

// Template-based stub description generator. This is the seam a real
// AI-written version (Phase 2) would replace -- same inputs, smarter prose.
export function generateDescription(input: DescriptionInput): string {
  const typeLabel = unitTypeOptions.rv.find(
    (o) => o.value === input.rvType
  )?.label;

  const namePart =
    [input.year, input.make, input.model].filter(Boolean).join(" ") ||
    "This unit";
  let sentence = `This ${namePart}`;

  if (input.sleeps && input.lengthFt) {
    sentence += ` sleeps ${input.sleeps} across ${input.lengthFt} feet`;
  } else if (input.sleeps) {
    sentence += ` sleeps ${input.sleeps}`;
  } else if (input.lengthFt) {
    sentence += ` spans ${input.lengthFt} feet`;
  } else if (typeLabel) {
    sentence += ` is a ${typeLabel.toLowerCase()}`;
  }

  if (input.hasGenerator) sentence += " and comes with an onboard generator";
  if (input.mileage)
    sentence += `, showing ${Number(input.mileage).toLocaleString("en-US")} miles`;

  sentence +=
    ". Contact us for the full details and to schedule a time to see it in person.";

  return sentence;
}
