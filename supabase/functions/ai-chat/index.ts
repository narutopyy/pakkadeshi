import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatRequest {
  message: string;
  sessionId: string;
  language?: "en" | "hi";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { message, sessionId, language = "en" } = await req.json() as ChatRequest;

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch AI settings
    const { data: aiSettings } = await supabase
      .from("ai_chatbot_settings")
      .select("*")
      .single();

    if (!aiSettings?.is_enabled) {
      return new Response(
        JSON.stringify({
          response: language === "hi"
            ? "चैटबॉट वर्तमान में उपलब्ध नहीं है। कृपया WhatsApp पर संपर्क करें।"
            : "Chatbot is currently unavailable. Please contact us on WhatsApp.",
          isEnabled: false
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch knowledge base
    const { data: knowledgeBase } = await supabase
      .from("ai_knowledge_base")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    // Fetch products for context
    const { data: products } = await supabase
      .from("products")
      .select("name, name_hi, short_description, short_description_hi, base_price")
      .eq("is_published", true);

    // Fetch WhatsApp settings
    const { data: whatsappSettings } = await supabase
      .from("whatsapp_settings")
      .select("phone_number")
      .single();

    // Build knowledge context
    const knowledgeContext = knowledgeBase?.map(kb =>
      language === "hi" && kb.content_hi ? kb.content_hi : kb.content
    ).join("\n\n") || "";

    const productContext = products?.map(p =>
      language === "hi" && p.name_hi
        ? `${p.name_hi}: ${p.short_description_hi || p.short_description} - ₹${p.base_price}`
        : `${p.name}: ${p.short_description} - ₹${p.base_price}`
    ).join("\n") || "";

    // Build tone-specific instructions
    const toneInstructions = {
      desi: language === "hi"
        ? "अपने उत्तरों में गर्म, मित्रवत और पारंपरिक भारतीय स्वर का उपयोग करें। 'नमस्ते', 'जी' जैसे शब्दों का उपयोग करें।"
        : "Use a warm, friendly, and traditional Indian tone. Use words like 'Namaste', 'ji' to add a personal touch.",
      neutral: "Respond in a professional and helpful manner.",
      formal: "Use formal, professional language in all responses.",
    };

    const systemPrompt = `${aiSettings.system_prompt}

TONE: ${toneInstructions[aiSettings.tone as keyof typeof toneInstructions] || toneInstructions.desi}

KNOWLEDGE BASE:
${knowledgeContext}

PRODUCTS:
${productContext}

WHATSAPP: ${whatsappSettings?.phone_number || "+919876543210"}

IMPORTANT RULES:
1. Only answer questions based on the knowledge base provided above.
2. If you don't have information, politely say: "${language === "hi" ? aiSettings.fallback_message_hi : aiSettings.fallback_message}"
3. Always encourage users to contact on WhatsApp for orders and detailed inquiries.
4. Never provide medical advice. If asked about health benefits, mention general benefits but recommend consulting a doctor.
5. Keep responses concise but helpful.
6. Respond in ${language === "hi" ? "Hindi" : "English"}.
7. For pricing, always mention current product prices from the list above.`;

    // Call Google Gemini API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: aiSettings.max_tokens || 500,
            temperature: Number(aiSettings.temperature) || 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
            response: language === "hi"
              ? "कृपया थोड़ी देर बाद पुनः प्रयास करें।"
              : "Please try again in a moment."
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          error: "AI service unavailable.",
          response: language === "hi"
            ? "सेवा अस्थायी रूप से अनुपलब्ध है। कृपया WhatsApp पर संपर्क करें।"
            : "Service temporarily unavailable. Please contact us on WhatsApp."
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const aiResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      (language === "hi" ? aiSettings.fallback_message_hi : aiSettings.fallback_message);

    const responseTime = Date.now() - startTime;
    const tokensUsed = aiData.usageMetadata?.totalTokenCount || 0;

    // Log chat for analytics
    await supabase.from("chat_logs").insert({
      session_id: sessionId,
      user_message: message,
      ai_response: aiResponse,
      language,
      response_time_ms: responseTime,
      tokens_used: tokensUsed,
    });

    return new Response(
      JSON.stringify({
        response: aiResponse,
        whatsappNumber: whatsappSettings?.phone_number,
        whatsappCta: aiSettings.whatsapp_cta_enabled,
        whatsappCtaText: language === "hi" ? aiSettings.whatsapp_cta_text_hi : aiSettings.whatsapp_cta_text,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        response: "Sorry, something went wrong. Please contact us on WhatsApp."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
