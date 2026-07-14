import Link from "next/link";
import { logout } from "./login/actions";
import { getCurrentDealer } from "@/lib/dealer";

export default async function AdminDashboardPage() {
  const dealer = await getCurrentDealer();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-charcoal-light">
            {dealer.name}
          </p>
          <h1 className="text-3xl font-extrabold text-forest-dark">
            Admin Dashboard
          </h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border-2 border-charcoal/20 px-4 py-2 font-semibold hover:bg-charcoal/5"
          >
            Log Out
          </button>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/units"
          className="rounded-lg border-2 border-charcoal/10 bg-white p-6 hover:border-forest"
        >
          <h2 className="text-xl font-bold text-charcoal">Inventory</h2>
          <p className="mt-2 text-lg text-charcoal-light">
            Add, edit, mark sold, or delete units.
          </p>
        </Link>
        <Link
          href="/admin/leads"
          className="rounded-lg border-2 border-charcoal/10 bg-white p-6 hover:border-forest"
        >
          <h2 className="text-xl font-bold text-charcoal">Lead Log</h2>
          <p className="mt-2 text-lg text-charcoal-light">
            See every inquiry and update its status.
          </p>
        </Link>
      </div>
    </div>
  );
}
