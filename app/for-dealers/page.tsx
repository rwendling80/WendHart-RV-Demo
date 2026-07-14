export default function ForDealersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="inline-block rounded bg-forest-light px-3 py-1 text-sm font-bold uppercase tracking-wider text-charcoal mb-4">
        About This Demo
      </p>
      <h1 className="text-4xl font-extrabold text-forest-dark mb-6">
        Want This For Your Lot?
      </h1>

      <div className="space-y-5 text-lg leading-relaxed">
        <p>
          This entire website is a demo. Everything you see here — the
          inventory, the listings, the photos, the descriptions — runs on a
          system where the dealer enters three things: the VIN, the photos,
          and the price. The system does the rest.
        </p>

        <div className="rounded-lg border-2 border-charcoal/10 bg-white p-6">
          <h2 className="text-xl font-bold text-charcoal mb-3">
            About Me
          </h2>
          <p className="mb-3">
            My name is Reid Wendling. I started in the car business in 2019
            selling Toyotas, moved to Hyundai about a year and a half later
            and sold new cars for three and a half years, then spent two
            years selling RVs. After that I worked as a warranty agent with
            independent car and RV dealerships across the Gulf Coast, and
            that is where I saw the same problem on every lot I walked.
          </p>
          <p>
            Owners do not have time for the background work. The listings,
            the website, the same twenty questions from every buyer, the
            follow up calls that never happen because you are busy getting
            deals done.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-charcoal mb-3">
            What WendHart Is
          </h2>
          <p>
            An AI sales agent that does your background work. It builds your
            website, keeps your inventory updated, writes your listings,
            answers your buyers day and night with your answers and your
            rules, books the appointments, and funnels every lead back to
            you in one simple list. You buy units and shake hands. It
            handles the rest.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-lg bg-forest text-cream p-6 text-center">
        <h2 className="text-2xl font-extrabold mb-2">
          Want This For Your Lot?
        </h2>
        <p className="text-lg mb-5">Call or text me directly.</p>
        <a
          href="tel:+16154806563"
          className="inline-block rounded-md bg-cream px-6 py-3 text-lg font-bold text-forest-dark hover:bg-white"
        >
          (615) 480-6563
        </a>
      </div>
    </div>
  );
}
