# WendHart RV Platform — Operations Manual

This is written for the business owner/operator, not a programmer. It explains what the site does and how to run it day-to-day. Nothing here requires touching code.

## What this is

A website platform for used-RV dealers. Right now it runs one demo dealer ("WendHart Demo RV"), but the underlying system supports many independent dealers at once, each with their own domain, their own inventory, their own leads, and their own admin login — completely walled off from each other.

- **Live site:** https://wend-hart-rv-demo.vercel.app
- **Admin login:** https://wend-hart-rv-demo.vercel.app/admin (password: `Hartwend-Lot-47`)

## The public site

- **Home** — dealership name, tagline, trust story, phone/address/hours.
- **Inventory** — every available unit, with filters for price/type/sleeps. A sold unit still shows with a "SOLD" banner for 7 days, then disappears from this page automatically (it stays in the system, just hidden).
- **Unit page** — photos, price, specs, condition notes, and an inquiry form. Every submission lands in the Lead Log automatically.
- **Buying Guide** — a general FAQ page. The text on it right now is placeholder — replace it with your own wording whenever you're ready (ask in a future session and it can be swapped in).

## Running the admin side (the part you'll actually use)

Go to `/admin` and log in with the password above.

### Adding a unit

Click **Add Unit**. The only things you're required to enter are:
1. **VIN**
2. **Price**
3. **At least one photo**

Everything else — type, year, make, model, specs, condition notes, description — is optional. Two shortcuts make this fast:

- **Decode VIN** button: pulls year/make/model automatically from a free government VIN database. It won't always find everything (older units or small trailer manufacturers sometimes have gaps) — whatever it can't find, just leave blank or fill in yourself.
- **Auto-Generate** button (next to the description box): drafts a simple listing description from whatever fields you've filled in. Review it before saving — it's a starting point, not final copy. (This is a placeholder for now; a smarter AI-written version is a planned future upgrade.)

### Editing, marking sold, deleting

From **Admin → Inventory**, every unit has its own **Edit**, **Mark Sold** / **Mark Available**, and **Delete** buttons right in the list — no need to open a unit to do any of these.

### The Lead Log

**Admin → Lead Log** shows every inquiry submitted from the site, newest first — name, phone, message, which unit (or "General inquiry" if not tied to one), and a status dropdown (New / Contacted / Came in / Bought / Dead). Changing the dropdown saves instantly, no save button needed. This page runs entirely passively — you never have to do anything for leads to show up here.

## How to make changes going forward

The live site is connected directly to a GitHub repository. Any time code changes are made (in a future session), they get pushed to GitHub, and the live site automatically rebuilds within a minute or two — no manual redeploy step, ever.

- **Code:** https://github.com/rwendling80/WendHart-RV-Demo
- **Database/photos:** Supabase project at `ivmkyhrswhedfazgiruq.supabase.co`
- **Hosting:** Vercel project connected to the GitHub repo above

## Free-tier limits — when would this ever cost money?

Everything today runs on free tiers:

- **Vercel (hosting):** free "Hobby" plan — 100GB of traffic/month, 1 million function calls/month. A demo or even an early real dealer site would use a tiny fraction of this. **Important:** Vercel's free tier is officially for non-commercial/personal use. Once this is actually sold to and used by a real paying dealer, it needs to move to Vercel's Pro plan ($20/month) — that's a "before you launch commercially" step, not a today problem.
- **Supabase (database + photo storage):** free tier — 500MB database, 1GB file storage, 2GB bandwidth/month. The project also pauses itself after 7 days with zero activity (it wakes back up automatically the next time someone visits, just a few seconds' delay on that first request). Photo storage is the thing most likely to grow over time as more units/photos get added — worth keeping an eye on once there are dozens of dealers with many photos each.

Nothing here bills automatically — you'd have to deliberately upgrade a plan for any cost to kick in.

## How adding a second real dealer would work (future)

The system is already built to support this — a new dealer just needs:
1. A new row added to the `dealers` table (name, contact info, hours, their own admin password).
2. Their real domain pointed at this same Vercel project (a DNS + Vercel dashboard step, done once per dealer).

No code changes needed per new dealer — this is purely a data/configuration step for a future session.

## What's next (Phase 2 / 3 — not built yet)

- **AI chatbot** on the public site that answers questions from inventory data and captures leads the same way the inquiry form does.
- **Auto-posting new units to Instagram, Facebook, and TikTok** — this is the most involved item on the list, since each platform needs its own developer setup and approval process.
- **Financing application form** so buyers can submit for credit to be run.
- All of the above are designed for, not yet built — the data model already has the seams needed for each.
