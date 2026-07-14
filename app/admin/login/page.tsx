import { login } from "./actions";
import { getCurrentDealer } from "@/lib/dealer";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const dealer = await getCurrentDealer();

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-charcoal-light mb-1">
        {dealer.name}
      </p>
      <h1 className="text-3xl font-extrabold text-forest-dark mb-6">
        Admin Login
      </h1>
      <form action={login} className="space-y-4 rounded-lg border-2 border-charcoal/10 bg-white p-6">
        {error && (
          <p className="rounded bg-rust/10 px-3 py-2 text-rust font-semibold">
            Wrong password — try again.
          </p>
        )}
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Password
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-forest px-6 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
