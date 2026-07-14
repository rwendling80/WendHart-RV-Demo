import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function HomePage() {
  return (
    <div>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
            {siteConfig.tagline}
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
              href={siteConfig.phoneHref}
              className="rounded-md border-2 border-cream px-6 py-3 text-lg font-bold hover:bg-forest-light"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 grid gap-10 sm:grid-cols-2 items-center">
        <div className="flex aspect-video items-center justify-center rounded-lg bg-charcoal-light/10 border-2 border-dashed border-charcoal-light/40 text-charcoal-light">
          Photo of the lot goes here
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
            <a href={siteConfig.phoneHref} className="mt-1 block text-2xl font-bold underline">
              {siteConfig.phone}
            </a>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-light">
              Visit the Lot
            </h3>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block underline"
            >
              {siteConfig.address}
            </a>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-light">
              Hours
            </h3>
            <ul className="mt-1 space-y-0.5">
              {siteConfig.hours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
