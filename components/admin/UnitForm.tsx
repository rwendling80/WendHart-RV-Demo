"use client";

import { useRef, useState } from "react";
import { categorySpecFields, unitTypeOptions } from "@/lib/categorySpecs";
import type { Unit } from "@/lib/units";
import { deletePhoto } from "@/app/admin/units/actions";
import { decodeVin } from "@/lib/vinDecode";

export function UnitForm({
  action,
  unit,
}: {
  action: (formData: FormData) => void;
  unit?: Unit;
}) {
  const fields = categorySpecFields.rv;
  const [photos, setPhotos] = useState(unit?.unit_photos ?? []);
  const [vinStatus, setVinStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");

  const formRef = useRef<HTMLFormElement>(null);
  const vinRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const makeRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  async function handleDecodeVin() {
    const vin = vinRef.current?.value.trim();
    if (!vin) return;
    setVinStatus("loading");
    try {
      const result = await decodeVin(vin);
      if (!result) {
        setVinStatus("error");
        return;
      }
      if (result.year && yearRef.current) yearRef.current.value = String(result.year);
      if (result.make && makeRef.current) makeRef.current.value = result.make;
      if (result.model && modelRef.current) modelRef.current.value = result.model;
      if (result.rvType && typeRef.current) typeRef.current.value = result.rvType;
      setVinStatus("done");
    } catch {
      setVinStatus("error");
    }
  }

  function handleGenerateDescription() {
    const year = yearRef.current?.value;
    const make = makeRef.current?.value;
    const model = modelRef.current?.value;
    const typeLabel = unitTypeOptions.rv.find(
      (o) => o.value === typeRef.current?.value
    )?.label;

    const specValue = (key: string) =>
      formRef.current?.querySelector<HTMLInputElement>(`[name="spec_${key}"]`)
        ?.value;
    const sleeps = specValue("sleeps");
    const length = specValue("length_ft");
    const mileage = specValue("mileage");
    const hasGenerator = formRef.current?.querySelector<HTMLInputElement>(
      '[name="spec_generator"]'
    )?.checked;

    const namePart = [year, make, model].filter(Boolean).join(" ") || "This unit";
    let sentence = `This ${namePart}`;

    if (sleeps && length) {
      sentence += ` sleeps ${sleeps} across ${length} feet`;
    } else if (sleeps) {
      sentence += ` sleeps ${sleeps}`;
    } else if (length) {
      sentence += ` spans ${length} feet`;
    } else if (typeLabel) {
      sentence += ` is a ${typeLabel.toLowerCase()}`;
    }

    if (hasGenerator) sentence += " and comes with an onboard generator";
    if (mileage)
      sentence += `, showing ${Number(mileage).toLocaleString("en-US")} miles`;

    sentence +=
      ". Contact us for the full details and to schedule a time to see it in person.";

    if (descriptionRef.current) {
      descriptionRef.current.value = sentence;
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold sm:col-span-2">
          VIN
          <div className="flex gap-2">
            <input
              ref={vinRef}
              type="text"
              name="vin"
              required
              defaultValue={unit?.vin ?? ""}
              className="flex-1 rounded border-2 border-charcoal/20 px-3 py-2 text-base"
            />
            <button
              type="button"
              onClick={handleDecodeVin}
              disabled={vinStatus === "loading"}
              className="rounded border-2 border-forest px-4 py-2 text-sm font-bold text-forest hover:bg-forest/10 disabled:opacity-50"
            >
              {vinStatus === "loading" ? "Decoding..." : "Decode VIN"}
            </button>
          </div>
          {vinStatus === "done" && (
            <span className="text-sm font-normal text-forest-dark">
              Filled in what we could find. Double check before saving.
            </span>
          )}
          {vinStatus === "error" && (
            <span className="text-sm font-normal text-rust">
              Couldn&apos;t decode that VIN — fill in the fields manually.
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Type
          <select
            ref={typeRef}
            name="rv_type"
            defaultValue={unit?.rv_type ?? ""}
            className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
          >
            <option value="">Select type (optional)</option>
            {unitTypeOptions.rv.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Year
          <input
            ref={yearRef}
            type="number"
            name="year"
            defaultValue={unit?.year ?? ""}
            className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Make
          <input
            ref={makeRef}
            type="text"
            name="make"
            defaultValue={unit?.make ?? ""}
            className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Model
          <input
            ref={modelRef}
            type="text"
            name="model"
            defaultValue={unit?.model ?? ""}
            className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Price (USD)
          <input
            type="number"
            name="price"
            step="1"
            defaultValue={unit ? unit.price_cents / 100 : ""}
            required
            className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
          />
        </label>
      </div>

      <fieldset className="rounded-lg border-2 border-charcoal/10 p-4">
        <legend className="px-2 text-sm font-bold uppercase tracking-wider text-charcoal-light">
          Specifications (optional)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const currentValue = unit?.specs?.[field.key];
            if (field.key === "generator") {
              return (
                <label
                  key={field.key}
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <input
                    type="checkbox"
                    name={`spec_${field.key}`}
                    defaultChecked={Boolean(currentValue)}
                  />
                  {field.label}
                </label>
              );
            }
            return (
              <label
                key={field.key}
                className="flex flex-col gap-1 text-sm font-semibold"
              >
                {field.label}
                {field.unit ? ` (${field.unit})` : ""}
                <input
                  type="number"
                  name={`spec_${field.key}`}
                  defaultValue={
                    typeof currentValue === "number" ? currentValue : ""
                  }
                  className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Condition Notes (optional)
        <textarea
          name="condition_notes"
          rows={4}
          defaultValue={unit?.condition_notes ?? ""}
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        <div className="flex items-center justify-between">
          Listing Description (optional)
          <button
            type="button"
            onClick={handleGenerateDescription}
            className="rounded border-2 border-forest px-3 py-1 text-sm font-bold text-forest hover:bg-forest/10"
          >
            Auto-Generate
          </button>
        </div>
        <textarea
          ref={descriptionRef}
          name="description"
          rows={4}
          defaultValue={unit?.description ?? ""}
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>

      {photos.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">Existing Photos</p>
          <div className="flex flex-wrap gap-3">
            {photos.map((p) => (
              <div key={p.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt=""
                  className="h-24 w-32 rounded object-cover border-2 border-charcoal/10"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!unit) return;
                    await deletePhoto(p.id, unit.id);
                    setPhotos((prev) => prev.filter((x) => x.id !== p.id));
                  }}
                  className="absolute -top-2 -right-2 rounded-full bg-rust text-white h-6 w-6 text-sm font-bold"
                  aria-label="Delete photo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1 text-sm font-semibold">
        {photos.length > 0 ? "Add More Photos" : "Photos"}
        <input
          type="file"
          name="photos"
          multiple
          accept="image/*"
          required={photos.length === 0}
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>

      <button
        type="submit"
        className="rounded-md bg-forest px-6 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
      >
        Save Unit
      </button>
    </form>
  );
}
