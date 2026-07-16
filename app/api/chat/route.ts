import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealer, getCurrentDealerId } from "@/lib/dealer";
import { buildSystemPrompt, buildInventoryContext } from "@/lib/chatbot/systemPrompt";
import { callChatbot } from "@/lib/chatbot/anthropic";
import type { ChatMessage } from "@/lib/chatbot/anthropic";
import { sendHotAlertEmail } from "@/lib/notify";
import type { AdminUnit } from "@/lib/units";

type StoredMessage = { role: "user" | "assistant"; content: string; at: string };

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!sessionId || !message) {
    return NextResponse.json(
      { error: "sessionId and message are required" },
      { status: 400 }
    );
  }

  const dealer = await getCurrentDealer();
  const dealerId = await getCurrentDealerId();

  const [unitsRes, conversationRes, notifyRes] = await Promise.all([
    supabaseAdmin
      .from("units")
      .select("*, unit_photos(*)")
      .eq("dealer_id", dealerId)
      .eq("status", "available"),
    supabaseAdmin
      .from("chat_conversations")
      .select("*")
      .eq("dealer_id", dealerId)
      .eq("session_id", sessionId)
      .maybeSingle(),
    supabaseAdmin
      .from("dealers")
      .select("notification_email")
      .eq("id", dealerId)
      .single(),
  ]);

  if (unitsRes.error) throw unitsRes.error;
  if (conversationRes.error) throw conversationRes.error;

  const units = unitsRes.data as unknown as AdminUnit[];
  const conversation = conversationRes.data;
  const notificationEmail = notifyRes.data?.notification_email as string | null;

  const systemPrompt =
    buildSystemPrompt(dealer) + buildInventoryContext(units);

  const priorMessages: StoredMessage[] = (conversation?.messages as StoredMessage[]) ?? [];
  const historyForModel: ChatMessage[] = priorMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const { reply, leadUpdate } = await callChatbot(systemPrompt, [
    ...historyForModel,
    { role: "user", content: message },
  ]);

  const now = new Date().toISOString();
  const updatedMessages: StoredMessage[] = [
    ...priorMessages,
    { role: "user", content: message, at: now },
    { role: "assistant", content: reply, at: now },
  ];

  const name = leadUpdate?.name ?? conversation?.name ?? null;
  const phone = leadUpdate?.phone ?? conversation?.phone ?? null;
  const unitIds = leadUpdate?.unit_ids ?? conversation?.unit_ids ?? [];
  const intentLevel = leadUpdate?.intent_level ?? conversation?.intent_level ?? "BROWSE";
  const summary = leadUpdate?.summary ?? conversation?.summary ?? null;

  let leadId: string | null = conversation?.lead_id ?? null;
  if (!leadId) {
    const { data: newLead, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert({
        dealer_id: dealerId,
        source: "chatbot",
        name,
        phone,
        message: summary,
        intent_level: intentLevel,
        unit_id: unitIds[0] ?? null,
      })
      .select("id")
      .single();
    if (leadError) throw leadError;
    leadId = newLead.id;
  } else {
    const { error: leadUpdateError } = await supabaseAdmin
      .from("leads")
      .update({
        name,
        phone,
        message: summary,
        intent_level: intentLevel,
        unit_id: unitIds[0] ?? null,
      })
      .eq("id", leadId);
    if (leadUpdateError) throw leadUpdateError;
  }

  let hotAlertSentAt: string | null = conversation?.hot_alert_sent_at ?? null;
  if (leadUpdate?.hot_alert && !hotAlertSentAt && notificationEmail) {
    const discussedUnit = units.find((u) => u.id === unitIds[0]);
    const unitLabel = discussedUnit
      ? [discussedUnit.year, discussedUnit.make, discussedUnit.model]
          .filter(Boolean)
          .join(" ")
      : null;

    await sendHotAlertEmail(notificationEmail, dealer.name, {
      buyerName: name,
      buyerPhone: phone,
      unitLabel,
      summary,
    });
    hotAlertSentAt = now;
  }

  const conversationRow = {
    dealer_id: dealerId,
    session_id: sessionId,
    messages: updatedMessages,
    name,
    phone,
    unit_ids: unitIds,
    intent_level: intentLevel,
    summary,
    lead_id: leadId,
    hot_alert_sent_at: hotAlertSentAt,
    updated_at: now,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("chat_conversations")
    .upsert(conversationRow, { onConflict: "dealer_id,session_id" });
  if (upsertError) throw upsertError;

  return NextResponse.json({ reply });
}
