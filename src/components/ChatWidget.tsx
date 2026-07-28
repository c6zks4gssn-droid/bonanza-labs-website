"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState<{ name: string; email: string } | null>(null);
  const [leadStep, setLeadStep] = useState<"name" | "email" | "done">("name");
  const [leadInput, setLeadInput] = useState("");
  // Honeypot field — bots fill this in, real users never see it
  const [honeypot, setHoneypot] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleLeadSubmit = () => {
    if (leadStep === "name") {
      if (leadInput.trim().length < 2) return;
      // Honeypot check — if filled, silently pretend success but don't process
      if (honeypot) {
        setLeadStep("done");
        setMessages([{ role: "assistant", content: "Bedankt! We nemen zo contact met je op." }]);
        return;
      }
      setLead({ name: leadInput, email: "" });
      setLeadInput("");
      setLeadStep("email");
    } else if (leadStep === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(leadInput)) return;
      // Honeypot check at email step too
      if (honeypot) {
        setLeadStep("done");
        setMessages([{ role: "assistant", content: "Bedankt! We nemen zo contact met je op." }]);
        return;
      }
      setLead({ name: lead?.name || "", email: leadInput });
      setLeadInput("");
      setLeadStep("done");
      setMessages([{
        role: "assistant",
        content: `Hallo ${lead?.name}! 👋 Ik ben de AI-assistent van Bonanza Labs. Waar kan ik je mee helpen? Je kunt vragen stellen over TradeFlow, ServeFlow of Bonanza Voice.`,
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error("Chat API error");
      }

      const data = await res.json();
      const assistantContent = data.choices?.[0]?.message?.content || "Sorry, ik kon dat niet verwerken.";

      setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, er ging iets mis. Probeer het opnieuw of mail ons: hello@bonanzalabs.com",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-lg shadow-blue-500/30 hover:bg-[#1D4ED8] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat met ons"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#2563EB] px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Bonanza Labs</p>
                  <p className="text-xs text-white/80">AI assistent • online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lead capture or chat */}
            {leadStep !== "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
                <Sparkles className="h-10 w-10 text-[#2563EB] mb-4" />
                <h3 className="text-lg font-semibold text-[#1A1A1A] text-center mb-2">
                  {leadStep === "name" ? "Hoe heet je?" : "Wat is je email?"}
                </h3>
                <p className="text-sm text-[#6B7280] text-center mb-6">
                  {leadStep === "name"
                    ? "Zodat we je persoonlijk kunnen helpen."
                    : "Voor het geval we later contact willen opnemen."}
                </p>
                <div className="flex w-full gap-2">
                  <input
                    type={leadStep === "email" ? "email" : "text"}
                    value={leadInput}
                    onChange={(e) => setLeadInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLeadSubmit()}
                    placeholder={leadStep === "name" ? "Je naam" : "je@email.nl"}
                    className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#2563EB]"
                    autoFocus
                  />
                  {/* Honeypot — visually hidden, bots fill it in */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <button
                    onClick={handleLeadSubmit}
                    className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-[#9CA3AF] text-center mt-4">
                  We verwerken je gegevens conform de AVG/GDPR.
                </p>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAF7]">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-[#2563EB] text-white rounded-br-sm"
                            : "bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick replies */}
                {messages.length <= 1 && (
                  <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#FAFAF7] border-t border-[#E5E7EB]">
                    {["Wat kost TradeFlow?", "Hoe werkt ServeFlow?", "Vertel over Bonanza Voice", "Boek een gesprek"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex items-center gap-2 border-t border-[#E5E7EB] bg-white px-4 py-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Typ je vraag..."
                    className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#2563EB]"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="rounded-xl bg-[#2563EB] p-2.5 text-white hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
