import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSettings {
  greeting_message: string | null;
  greeting_message_hi: string | null;
  is_enabled: boolean | null;
  whatsapp_cta_text: string | null;
  whatsapp_cta_text_hi: string | null;
}

const AIChatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/917275402632");
  const [ctaText, setCtaText] = useState("Order on WhatsApp");
  const [isEnabled, setIsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const [chatRes, waRes] = await Promise.all([
        supabase.rpc('get_public_chat_settings'),
        supabase.rpc('get_public_whatsapp_settings'),
      ]);

      const chatSettings = chatRes.data?.[0] as ChatSettings | undefined;
      const whatsappSettings = waRes.data?.[0];

      if (chatSettings) {
        setIsEnabled(chatSettings.is_enabled ?? true);
        const greeting = language === 'hi'
          ? (chatSettings.greeting_message_hi || chatSettings.greeting_message)
          : chatSettings.greeting_message;
        if (greeting) {
          setMessages([{ role: "assistant", content: greeting }]);
        }
        const cta = language === 'hi'
          ? (chatSettings.whatsapp_cta_text_hi || chatSettings.whatsapp_cta_text)
          : chatSettings.whatsapp_cta_text;
        if (cta) setCtaText(cta);
      } else {
        setMessages([{
          role: "assistant",
          content: language === 'hi'
            ? "नमस्ते! 🙏 मैं पक्का देसी सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?"
            : "Namaste! 🙏 I am the Pakka Deshi assistant. How can I help you today?"
        }]);
      }

      if (whatsappSettings) {
        const phone = whatsappSettings.phone_number;
        const defaultMsg = language === 'hi'
          ? (whatsappSettings.default_message_hi || whatsappSettings.default_message)
          : whatsappSettings.default_message;
        setWhatsappLink(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(defaultMsg || '')}`);
      }
    };

    fetchSettings();
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: userMessage,
          sessionId,
          language
        }
      });

      if (error) throw error;

      const aiResponse = data?.response || (language === 'hi' 
        ? "मुझे जवाब देने में समस्या हो रही है। कृपया WhatsApp पर संपर्क करें।"
        : "I'm having trouble responding. Please contact us on WhatsApp.");
      
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);

      if (data?.whatsappNumber) {
        const msg = data.whatsappCtaMessage || '';
        setWhatsappLink(`https://wa.me/${data.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: language === 'hi'
          ? "माफ़ कीजिए, कुछ गलत हो गया। कृपया WhatsApp पर हमसे संपर्क करें।"
          : "Sorry, something went wrong. Please contact us on WhatsApp."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground shadow-gold flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse-glow ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-48px)] max-w-[380px] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ transformOrigin: "bottom right" }}
      >
        {/* Header */}
        <div className="bg-secondary text-secondary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Pakka Deshi AI</h3>
              <p className="text-xs text-secondary-foreground/70">
                {language === 'hi' ? 'सरसों तेल के बारे में पूछें!' : 'Ask me about mustard oil!'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-secondary-foreground/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-background">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp CTA */}
        <div className="px-4 py-2 bg-muted/50 border-t border-border">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm" className="w-full">
              <MessageCircle className="w-4 h-4" />
              {ctaText}
            </Button>
          </a>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask about our mustard oil...'}
              className="flex-1 px-4 py-2.5 rounded-full bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mustard-dark transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
