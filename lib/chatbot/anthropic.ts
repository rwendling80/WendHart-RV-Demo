import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const LEAD_UPDATE_MARKER = "<<LEAD_UPDATE>>";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");
    client = new Anthropic({ apiKey });
  }
  return client;
}

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
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const rawText = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return parseModelOutput(rawText);
}
