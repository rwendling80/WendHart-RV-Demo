"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-md bg-forest px-6 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
    >
      Print
    </button>
  );
}
