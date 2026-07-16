const RESEND_API_URL = "https://api.resend.com/emails";

export type HotAlertInput = {
  buyerName: string | null;
  buyerPhone: string | null;
  unitLabel: string | null;
  summary: string | null;
};

// Uses Resend's raw REST API via fetch (no SDK) to match this project's
// "boring/free/reliable" pattern elsewhere. Requires RESEND_API_KEY; falls
// back to a console warning (not a thrown error) if it's missing, so a
// dealer who hasn't set up alerts yet doesn't get a broken chatbot -- they
// just don't get the email until they add the key.
export async function sendHotAlertEmail(
  to: string,
  dealerName: string,
  input: HotAlertInput
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping HOT-ALERT email.");
    return;
  }

  const subject = `Hot lead: ${input.buyerName || "New buyer"}${
    input.unitLabel ? ` — ${input.unitLabel}` : ""
  }`;
  const lines = [
    `A conversation on ${dealerName}'s chatbot just went HOT.`,
    "",
    `Buyer: ${input.buyerName || "Not given yet"}`,
    `Phone: ${input.buyerPhone || "Not given yet"}`,
    input.unitLabel ? `Unit: ${input.unitLabel}` : null,
    input.summary ? `Summary: ${input.summary}` : null,
  ].filter((line): line is string => line != null);

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Resend API error ${res.status}: ${text}`);
  }
}
