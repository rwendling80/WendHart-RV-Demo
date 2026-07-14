import Image from "next/image";
import Link from "next/link";
import { getCurrentDealer, dealerPhoneHref, dealerMapUrl } from "@/lib/dealer";

export default async function HomePage() {
  const dealer = await getCurrentDealer();

  return (
    <div>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
            {dealer.tagline}
          </h1>
          <p className="mt-4 text-lg max-w-xl text-cream/90">
            Family-run, no-pressure RV shopping. Come see what&apos;s on the
            lot or give us a call — we&apos;re happy to talk it through.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/inventory"
              className="rounded-md bg-cream px-6 py-3 text-lg font-bold text-forest-dark hover:bg-white"
            >
              See Our Inventory
            </Link>
            <a
              href={dealerPhoneHref(dealer.phone)}
              className="rounded-md border-2 border-cream px-6 py-3 text-lg font-bold hover:bg-forest-light"
            >
              Call {dealer.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 grid gap-10 sm:grid-cols-2 items-center">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-charcoal-light/10">
          <Image
            src="https://images.pexels.com/photos/17816414/pexels-photo-17816414.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="RVs parked together on the lot"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-forest-dark">
            6 Years. Word of Mouth. That&apos;s It.
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            We&apos;ve never run a big ad campaign. For six years, folks
            have found us because a neighbor, a coworker, or a friend from
            the campground told them to. We look over every unit that comes
            onto the lot, we tell you what&apos;s wrong with it as plainly as
            what&apos;s right, and we stand behind what we sell. That&apos;s
            the whole business model.
          </p>
        </div>
      </section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-3 text-lg">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-light">
              Call Us
            </h3>
            <a href={dealerPhoneHref(dealer.phone)} className="mt-1 block text-2xl font-bold underline">
              {dealer.phone}
            </a>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-light">
              Visit the Lot
            </h3>
            <a
              href={dealerMapUrl(dealer.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block underline"
            >
              {dealer.address}
            </a>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-light">
              Hours
            </h3>
            <ul className="mt-1 space-y-0.5">
              {dealer.hours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-lg border-2 border-dashed border-forest bg-forest/5 p-6 sm:p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-forest-dark mb-2">
              This Whole Site Is a Demo
            </p>
            <p className="text-lg max-w-2xl mx-auto mb-4">
              A dealer enters the VIN, the photos, and the price. The system
              does the rest — the website, the listings, the descriptions,
              all of it.
            </p>
            <Link
              href="/for-dealers"
              className="inline-block rounded-md bg-forest px-6 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
            >
              Want This For Your Lot?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
