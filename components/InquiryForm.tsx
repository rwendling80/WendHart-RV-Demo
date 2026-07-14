import { submitInquiry } from "@/app/inventory/[id]/actions";

export function InquiryForm({
  unitId,
  status,
}: {
  unitId: string;
  status?: string;
}) {
  if (status === "sent") {
    return (
      <div className="rounded-lg border-2 border-forest bg-forest/5 p-6">
        <h3 className="text-xl font-bold text-forest-dark">
          Thanks — we got it!
        </h3>
        <p className="mt-2 text-lg">
          Someone from our team will call or text you back soon. If it&apos;s
          urgent, just give us a call directly.
        </p>
      </div>
    );
  }

  return (
    <form
      action={submitInquiry.bind(null, unitId)}
      className="rounded-lg border-2 border-charcoal/10 bg-white p-6 space-y-4"
    >
      <h3 className="text-xl font-bold text-charcoal">
        Ask About This Unit / Come See It
      </h3>
      {status === "error" && (
        <p className="rounded bg-rust/10 px-3 py-2 text-rust font-semibold">
          Something went wrong — please try again, or just call us.
        </p>
      )}
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Name
        <input
          type="text"
          name="name"
          required
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Phone
        <input
          type="tel"
          name="phone"
          required
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Message (optional)
        <textarea
          name="message"
          rows={3}
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-md bg-forest px-6 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
      >
        Send Inquiry
      </button>
    </form>
  );
}
