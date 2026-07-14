import { getCurrentDealer, dealerPhoneHref } from "@/lib/dealer";

export async function SiteFooter() {
  const dealer = await getCurrentDealer();

  return (
    <footer className="bg-charcoal text-cream/80 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm space-y-2">
        <p>
          {dealer.address} &nbsp;·&nbsp;{" "}
          <a href={dealerPhoneHref(dealer.phone)} className="underline">
            {dealer.phone}
          </a>
        </p>
        <p className="font-semibold text-cream">
          {dealer.name} — product demonstration site, not a real dealership.
        </p>
      </div>
    </footer>
  );
}
