"use client";

import { useRef, useState } from "react";
import { categorySpecFields, unitTypeOptions } from "@/lib/categorySpecs";
import type { AdminUnit } from "@/lib/units";
import { deletePhoto } from "@/app/admin/units/actions";
import { decodeVin } from "@/lib/vinDecode";
import { generateDescription } from "@/lib/generateDescription";

const bigInputClass =
  "rounded border-2 border-charcoal/20 px-4 py-3 text-lg";
const bigLabelClass = "flex flex-col gap-1 text-base font-bold text-charcoal";

export function UnitForm({
  action,
  unit,
}: {
  action: (formData: FormData) => void;
  unit?: AdminUnit;
}) {
  const fields = categorySpecFields.rv;
  const isNew = !unit;
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

  async function handleVinBlur() {
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
    const specValue = (key: string) =>
      formRef.current?.querySelector<HTMLInputElement>(`[name="spec_${key}"]`)
        ?.value;

    const sentence = generateDescription({
      year: yearRef.current?.value,
      make: makeRef.current?.value,
      model: modelRef.current?.value,
      rvType: typeRef.current?.value,
      sleeps: specValue("sleeps"),
      lengthFt: specValue("length_ft"),
      mileage: specValue("mileage"),
      hasGenerator: formRef.current?.querySelector<HTMLInputElement>(
        '[name="spec_generator"]'
      )?.checked,
    });

    if (descriptionRef.current) {
      descriptionRef.current.value = sentence;
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-6 max-w-2xl">
      <div>
        <label className={bigLabelClass}>
          {photos.length > 0 ? "Add More Photos" : "Photos *"}
          <div className="rounded-lg border-4 border-dashed border-forest/30 bg-forest/5 p-6 text-center">
            <input
              type="file"
              name="photos"
              multiple
              accept="image/*"
              required={photos.length === 0}
              className="w-full text-base file:mr-4 file:rounded-md file:border-0 file:bg-forest file:px-5 file:py-3 file:text-base file:font-bold file:text-cream"
            />
            <p className="mt-2 text-sm font-normal text-charcoal-light">
              Tap to choose, or drag photos here from your phone or computer.
            </p>
          </div>
        </label>

        {photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
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
                  className="absolute -top-2 -right-2 rounded-full bg-rust text-white h-7 w-7 text-base font-bold"
                  aria-label="Delete photo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className={bigLabelClass}>
        VIN *
        <input
          ref={vinRef}
          type="text"
          name="vin"
          required
          defaultValue={unit?.vin ?? ""}
          onBlur={handleVinBlur}
          className={bigInputClass}
        />
        {vinStatus === "loading" && (
          <span className="text-sm font-normal text-charcoal-light">
            Decoding VIN...
          </span>
        )}
        {vinStatus === "done" && (
          <span className="text-sm font-normal text-forest-dark">
            Filled in year/make/model from the VIN. Double check before saving.
          </span>
        )}
        {vinStatus === "error" && (
          <span className="text-sm font-normal text-rust">
            Couldn&apos;t decode that VIN — fill in the details manually below.
          </span>
        )}
      </label>

      <label className={bigLabelClass}>
        Asking Price *
        <input
          type="number"
          name="price"
          step="1"
          defaultValue={unit ? unit.price_cents / 100 : ""}
          required
          className={bigInputClass}
        />
      </label>

      <label className={bigLabelClass}>
        Your Bottom Dollar {isNew && "*"}
        <input
          type="number"
          name="floor_price"
          step="1"
          defaultValue={
            unit?.floor_price_cents != null ? unit.floor_price_cents / 100 : ""
          }
          required={isNew}
          className={bigInputClass}
        />
        <span className="text-sm font-normal text-charcoal-light">
          Never shown to buyers — the lowest price you&apos;d actually accept.
        </span>
      </label>

      <details className="rounded-lg border-2 border-charcoal/10 p-4">
        <summary className="cursor-pointer text-base font-bold text-charcoal-light">
          Optional details (type, specs, condition notes, description)
        </summary>

        <div className="mt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <fieldset className="rounded-lg border-2 border-charcoal/10 p-4">
            <legend className="px-2 text-sm font-bold uppercase tracking-wider text-charcoal-light">
              Specifications
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
            Condition Notes
            <textarea
              name="condition_notes"
              rows={4}
              defaultValue={unit?.condition_notes ?? ""}
              className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            <div className="flex items-center justify-between">
              Listing Description
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
            <span className="text-xs font-normal text-charcoal-light">
              Left blank, we&apos;ll write one for you automatically when you save.
            </span>
          </label>
        </div>
      </details>

      <button
        type="submit"
        className="w-full rounded-md bg-forest px-6 py-4 text-xl font-bold text-cream hover:bg-forest-dark"
      >
        Save Unit
      </button>
    </form>
  );
}
