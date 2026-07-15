import Image from "next/image";
import Link from "next/link";
import { getCurrentDealer, dealerPhoneHref, dealerMapUrl } from "@/lib/dealer";

export default async function HomePage() {
  const dealer = await getCurrentDealer();

  return (
    <div>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">
            This Will Be Your Website. Your Name. Your Brand. Your Inventory.
          </h1>
          <p className="mt-4 text-lg max-w-2xl text-cream/90">
            Everything on this site is a live demo of what we build for
            independent dealers — designed to fit your dealership, and run by
            an AI salesperson that works around the clock. Look around, click
            on units, try the chat. Then imagine it with your name on it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/inventory"
              className="rounded-md bg-cream px-6 py-3 text-lg font-bold text-forest-dark hover:bg-white"
            >
              See The Demo Inventory
            </Link>
            <a
              href={dealerPhoneHref(dealer.phone)}
              className="rounded-md border-2 border-cream px-6 py-3 text-lg font-bold hover:bg-forest-light"
            >
              Talk to Reid
            </a>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <p className="text-xl sm:text-2xl font-bold leading-snug">
            WendHart exists to give independent dealers their time back, with
            an AI salesperson that works 24/7 to bring in more leads and
            close more deals.
          </p>
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
            This Is a Demo. Yours Would Look Even Better.
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            Everything you see on this site is a working demonstration of
            what we build for independent dealers. Your version comes with
            your name, your branding, your photos, and your inventory. And
            it comes with something no other dealer website has: a real AI
            salesperson, not a fact bot. It knows every unit on your lot,
            answers buyers the way you would, handles the common questions
            and objections, and books appointments while you&apos;re busy
            running your business. You upload the photos, the VIN, and your
            price. The system does everything else.
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
              Meet the Founder
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-dark text-center mb-6">
              Want This For Your Lot?
            </h2>

            <div className="rounded-lg bg-white p-5 text-lg leading-relaxed">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-2">
                <div className="relative h-32 w-32 flex-none rounded-full overflow-hidden border-4 border-forest/20">
                  <Image
                    src="/founder/reid-wendling.jpg"
                    alt="Reid Wendling, founder of WendHart"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal">
                    About Me
                  </h3>
                  <p className="mt-2">
                    My name is Reid Wendling. I started in the car business in
                    2019 selling Toyotas, moved to Hyundai about a year and a
                    half later and sold new cars for three and a half years,
                    then spent two years selling RVs. After that I worked as a
                    warranty agent with independent car and RV dealerships
                    across the Gulf Coast, and that is where I saw the same
                    problem on every lot I walked.
                  </p>
                </div>
              </div>
              <p>
                Owners do not have time for the background work. The
                listings, the website, the same twenty questions from every
                buyer, the follow up calls that never happen because you
                are busy getting deals done.
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
