"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { markSold, markAvailable, deleteUnit } from "@/app/admin/units/actions";

const UNDO_WINDOW_MS = 6000;

export function UnitRowActions({
  unitId,
  status,
  title,
  priceLabel,
}: {
  unitId: string;
  status: "available" | "sold";
  title: string;
  priceLabel: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [showUndo, setShowUndo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The undo window has to elapse with no server call in flight, or
  // Next.js's automatic refresh after the action can remount this
  // component and dismiss the banner before anyone sees it. So the actual
  // database write is delayed until the window closes -- an Undo tap
  // during the window never touches the server at all.
  function handleMarkSold() {
    setCurrentStatus("sold");
    setShowUndo(true);
    timerRef.current = setTimeout(() => {
      setShowUndo(false);
      markSold(unitId);
    }, UNDO_WINDOW_MS);
  }

  function handleUndo() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStatus("available");
    setShowUndo(false);
  }

  function handleMarkAvailable() {
    setCurrentStatus("available");
    markAvailable(unitId);
  }

  function handleDelete() {
    deleteUnit(unitId);
  }

  return (
    <>
      <div className="flex-1 min-w-[200px]">
        <p className="text-lg font-bold text-charcoal">{title}</p>
        <p className="text-base text-charcoal-light">
          {priceLabel} ·{" "}
          <span
            className={currentStatus === "sold" ? "text-rust font-bold" : ""}
          >
            {currentStatus === "sold" ? "SOLD" : "Available"}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-stretch sm:items-end gap-2">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/units/${unitId}/edit`}
            className="rounded border-2 border-charcoal/20 px-4 py-2.5 text-base font-semibold hover:bg-charcoal/5"
          >
            Edit
          </Link>
          {currentStatus === "available" ? (
            <button
              type="button"
              onClick={handleMarkSold}
              className="rounded border-2 border-rust px-4 py-2.5 text-base font-semibold text-rust hover:bg-rust/10"
            >
              Mark Sold
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMarkAvailable}
              className="rounded border-2 border-forest px-4 py-2.5 text-base font-semibold text-forest hover:bg-forest/10"
            >
              Mark Available
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="rounded border-2 border-charcoal/20 px-4 py-2.5 text-base font-semibold hover:bg-charcoal/5"
          >
            Delete
          </button>
        </div>
        {showUndo && (
          <div className="flex items-center gap-3 rounded bg-charcoal px-4 py-2 text-base text-cream">
            Marked Sold
            <button
              type="button"
              onClick={handleUndo}
              className="font-bold underline"
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
