import Link from "next/link";
import { logout } from "./login/actions";
import { getCurrentDealer, getCurrentDealerId } from "@/lib/dealer";
import { supabaseAdmin } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const dealer = await getCurrentDealer();
  const dealerId = await getCurrentDealerId();

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [availableUnits, newLeads, financingApps] = await Promise.all([
    supabaseAdmin
      .from("units")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerId)
      .eq("status", "available"),
    supabaseAdmin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerId)
      .gte("created_at", sevenDaysAgo),
    supabaseAdmin
      .from("financing_applications")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerId),
  ]);

  const counts = [
    { label: "Units Available", value: availableUnits.count ?? 0 },
    { label: "New Leads This Week", value: newLeads.count ?? 0 },
    { label: "Financing Applications", value: financingApps.count ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-charcoal-light">
            {dealer.name}
          </p>
          <h1 className="text-3xl font-extrabold text-forest-dark">
            Admin Home
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="rounded-md border-2 border-charcoal/20 px-4 py-2.5 text-base font-semibold hover:bg-charcoal/5"
          >
            Chatbot Settings
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border-2 border-charcoal/20 px-4 py-2.5 text-base font-semibold hover:bg-charcoal/5"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {counts.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border-2 border-charcoal/10 bg-white p-3 sm:p-4 text-center"
          >
            <p className="text-2xl sm:text-3xl font-extrabold text-forest-dark">
              {c.value}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-charcoal-light leading-tight">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        <Link
          href="/admin/units/new"
          className="rounded-lg border-2 border-forest bg-forest text-cream p-6 hover:bg-forest-dark"
        >
          <h2 className="text-2xl font-bold">+ Add a Unit</h2>
          <p className="mt-1 text-lg text-cream/90">
            Photos, VIN, price, and your bottom dollar — that&apos;s it.
          </p>
        </Link>
        <Link
          href="/admin/units"
          className="rounded-lg border-2 border-charcoal/10 bg-white p-6 hover:border-forest"
        >
          <h2 className="text-2xl font-bold text-charcoal">My Inventory</h2>
          <p className="mt-1 text-lg text-charcoal-light">
            Edit units, mark sold, or remove listings.
          </p>
        </Link>
        <Link
          href="/admin/leads"
          className="rounded-lg border-2 border-charcoal/10 bg-white p-6 hover:border-forest"
        >
          <h2 className="text-2xl font-bold text-charcoal">
            Leads &amp; Applications
          </h2>
          <p className="mt-1 text-lg text-charcoal-light">
            Who&apos;s asked about your units, and every financing application.
          </p>
        </Link>
      </div>
    </div>
  );
}
