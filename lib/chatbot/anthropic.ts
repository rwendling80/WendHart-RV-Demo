const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const LEAD_UPDATE_MARKER = "<<LEAD_UPDATE>>";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type LeadUpdate = {
  name?: string | null;
  phone?: string | null;
  unit_ids?: string[];
  intent_level?: "HOT" | "WARM" | "BROWSE";
  summary?: string;
  hot_alert?: boolean;
};

export type ChatbotResult = {
  reply: string;
  leadUpdate: LeadUpdate | null;
};

// Splits the model's raw text on the LEAD_UPDATE_MARKER (see the
// instructions appended in lib/chatbot/systemPrompt.ts). Falls back to
// treating the whole thing as the reply if the marker or JSON is malformed
// -- a parsing hiccup should never surface as a broken chat.
function parseModelOutput(raw: string): ChatbotResult {
  const markerIndex = raw.indexOf(LEAD_UPDATE_MARKER);
  if (markerIndex === -1) {
    return { reply: raw.trim(), leadUpdate: null };
  }

  const reply = raw.slice(0, markerIndex).trim();
  const jsonPart = raw.slice(markerIndex + LEAD_UPDATE_MARKER.length).trim();

  try {
    const leadUpdate = JSON.parse(jsonPart) as LeadUpdate;
    return { reply, leadUpdate };
  } catch {
    return { reply, leadUpdate: null };
  }
}

export async function callChatbot(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<ChatbotResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const rawText = (data.content ?? [])
    .filter((block: { type: string }) => block.type === "text")
    .map((block: { text: string }) => block.text)
    .join("");

  return parseModelOutput(rawText);
}
