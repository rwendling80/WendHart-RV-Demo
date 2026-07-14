import Link from "next/link";
import { getCurrentDealer, dealerPhoneHref } from "@/lib/dealer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/financing", label: "Apply for Financing" },
  { href: "/about", label: "Buying Guide" },
];

export async function SiteHeader() {
  const dealer = await getCurrentDealer();

  return (
    <header className="bg-charcoal text-cream">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight">
            {dealer.name}
          </Link>
          <Link
            href="/for-dealers"
            className="rounded bg-forest-light px-2 py-0.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-forest-dark"
          >
            Demo — Want This?
          </Link>
        </div>

        <nav className="flex items-center gap-5 text-base font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-forest-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={dealerPhoneHref(dealer.phone)}
          className="rounded-md bg-forest px-4 py-2 text-base font-bold hover:bg-forest-light"
        >
          Call {dealer.phone}
        </a>
      </div>
    </header>
  );
}
