import Link from "next/link";
import { getCurrentDealer, getCurrentDealerId } from "@/lib/dealer";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updateChatbotSettings } from "./actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const dealer = await getCurrentDealer();
  const dealerId = await getCurrentDealerId();

  const { data: notifyRow } = await supabaseAdmin
    .from("dealers")
    .select("notification_email")
    .eq("id", dealerId)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-forest-dark">
          Chatbot Settings
        </h1>
        <Link
          href="/admin"
          className="text-sm font-semibold text-charcoal-light hover:text-forest"
        >
          &larr; Back home
        </Link>
      </div>

      <p className="text-charcoal-light mb-6">
        These answers shape how your AI assistant talks about your lot — what
        it can promise, who it says it works for, and where to send hot
        leads.
      </p>

      {saved && (
        <p className="mb-6 rounded bg-forest/10 px-4 py-3 font-semibold text-forest-dark">
          Saved.
        </p>
      )}

      <form
        action={updateChatbotSettings}
        className="space-y-5 rounded-lg border-2 border-charcoal/10 bg-white p-6"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Owner / salesperson name
          <input
            type="text"
            name="owner_name"
            defaultValue={dealer.owner_name ?? ""}
            placeholder={dealer.name}
            className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Years in business
            <input
              type="number"
              name="years_in_business"
              min={0}
              defaultValue={dealer.years_in_business ?? ""}
              className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Vehicle type
            <input
              type="text"
              name="vehicle_type"
              defaultValue={dealer.vehicle_type}
              className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Hold / deposit policy
          <textarea
            name="hold_policy"
            rows={2}
            defaultValue={dealer.hold_policy ?? ""}
            placeholder="I can't hold units, but I can get you in fast — what's today or tomorrow look like?"
            className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Trade-in policy
          <textarea
            name="trade_policy"
            rows={2}
            defaultValue={dealer.trade_policy ?? ""}
            placeholder="We consider trades case by case — bring the details and we'll take a look."
            className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Delivery policy
          <textarea
            name="delivery_policy"
            rows={2}
            defaultValue={dealer.delivery_policy ?? ""}
            placeholder="We don't offer delivery right now — pickup is here at the lot."
            className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
        </label>

        <fieldset className="flex flex-col gap-2 text-sm font-semibold">
          <legend className="mb-1">How units are sold</legend>
          <label className="flex items-center gap-2 font-normal">
            <input
              type="radio"
              name="warranty_type"
              value="as_is"
              defaultChecked={dealer.warranty_type !== "warranty"}
            />
            As-is, no warranty
          </label>
          <label className="flex items-center gap-2 font-normal">
            <input
              type="radio"
              name="warranty_type"
              value="warranty"
              defaultChecked={dealer.warranty_type === "warranty"}
            />
            Some warranty coverage
          </label>
          <input
            type="text"
            name="warranty_details"
            defaultValue={dealer.warranty_details ?? ""}
            placeholder="e.g. 30-day powertrain warranty included"
            className="mt-1 rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
        </fieldset>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Discovery questions worth asking every buyer
          <textarea
            name="discovery_notes"
            rows={3}
            defaultValue={dealer.discovery_notes ?? ""}
            placeholder="Weekend camping or full-timing? Tow vehicle? Must-have floorplan features?"
            className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Hot-lead alert email
          <input
            type="email"
            name="notification_email"
            defaultValue={notifyRow?.notification_email ?? ""}
            placeholder="you@yourdealership.com"
            className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-normal"
          />
          <span className="text-xs font-normal text-charcoal-light">
            The moment a chat conversation looks like a real buyer, you get an
            email here.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-forest px-6 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
