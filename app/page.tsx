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
        <div className="mx-auto max-w-4xl px-4 py-14">
          <div className="rounded-lg border-2 border-dashed border-forest bg-forest/5 p-6 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wider text-forest-dark mb-2 text-center">
              This Whole Site Is a Demo
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-dark text-center mb-6">
              Want This For Your Lot?
            </h2>

            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                This entire website is a demo. Everything you see here — the
                inventory, the listings, the photos, the descriptions — runs
                on a system where the dealer enters three things: the VIN,
                the photos, and the price. The system does the rest.
              </p>

              <div className="rounded-lg bg-white p-5">
                <h3 className="text-lg font-bold text-charcoal mb-2">
                  About Me
                </h3>
                <p className="mb-3">
                  My name is Reid Wendling. I started in the car business in
                  2019 selling Toyotas, moved to Hyundai about a year and a
                  half later and sold new cars for three and a half years,
                  then spent two years selling RVs. After that I worked as a
                  warranty agent with independent car and RV dealerships
                  across the Gulf Coast, and that is where I saw the same
                  problem on every lot I walked.
                </p>
                <p>
                  Owners do not have time for the background work. The
                  listings, the website, the same twenty questions from every
                  buyer, the follow up calls that never happen because you
                  are busy getting deals done.
                </p>
              </div>

              <p>
                <span className="font-bold">What WendHart is:</span> an AI
                sales agent that does your background work. It builds your
                website, keeps your inventory updated, writes your listings,
                answers your buyers day and night with your answers and your
                rules, books the appointments, and funnels every lead back to
                you in one simple list. You buy units and shake hands. It
                handles the rest.
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-forest text-cream p-6 text-center">
              <p className="text-lg mb-3">
                Want this for your lot? Call or text me directly.
              </p>
              <a
                href="tel:+16154806563"
                className="inline-block rounded-md bg-cream px-6 py-3 text-lg font-bold text-forest-dark hover:bg-white"
              >
                (615) 480-6563
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
