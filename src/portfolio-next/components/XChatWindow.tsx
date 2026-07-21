"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Minimize2 } from "lucide-react";

const EMAIL = "simon.chusseau@gmail.com";
const GITHUB = "https://github.com/Simonc44";
const LINKEDIN = "https://www.linkedin.com/in/simon-chusseau-91541a378/";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  time: string;
}

/** Deterministic timestamp — SSR-safe (only called client-side). */
function now(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

/** Bot reply logic — keyword-based, returns real contact info only. */
function getBotReply(input: string): string {
  const q = input.toLowerCase();

  if (/mail|email|contact|reach|message/.test(q)) {
    return `📧 Envoie-moi un email directement : **${EMAIL}**\nJe réponds généralement sous 24h.`;
  }
  if (/github|code|repo|open.source|project/.test(q)) {
    return `🛠 Mon GitHub : ${GITHUB}\nTu y trouveras Mandat, CygnisAI, OmniMCP, Procivi et plus encore.`;
  }
  if (/linkedin|profil|cv|résumé/.test(q)) {
    return `💼 Mon LinkedIn : ${LINKEDIN}`;
  }
  if (/disponible|freelance|mission|collab|travail|work|hire/.test(q)) {
    return `✅ Je suis **ouvert aux collaborations freelance et projets intéressants**.\nContacte-moi sur ${EMAIL} avec ton projet.`;
  }
  if (/stack|techno|tech|langage|language/.test(q)) {
    return `⚙️ Stack principal :\nTypeScript / React / Next.js / Node.js\nPython / Rust (cycode)\nFirebase · Vercel · Tailwind CSS · Three.js · LLM tooling (Gemini, Groq)`;
  }
  if (/projet|project|mandat|cygnis|procivi|omnimcp/.test(q)) {
    return `🚀 Mes projets phares :\n• **Mandat** — hub législatif temps réel\n• **CygnisAI** — plateforme IA modulaire\n• **cycode** — assistant IA avancé (Rust)\n• **OmniMCP** — Universal MCP Gateway (Python)\n• **Procivi** — CV IA via Gemini`;
  }
  if (/salut|hello|bonjour|hi|hey/.test(q)) {
    return `👋 Salut ! Je suis Simon — développeur full-stack & indie maker.\nPose-moi une question sur mes projets, ma stack, ou comment me contacter.`;
  }

  return `Je n'ai pas compris ta question 🤔\nEssaie : "email", "GitHub", "disponible", "stack" ou "projets".`;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    from: "bot",
    text: "👋 Bonjour ! Je suis Simon.\nPose-moi une question sur mon travail, ma stack, ou comment me contacter.",
    time: "",
  },
];

/** Renders a chat message bubble. */
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.from === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "rounded-tr-sm bg-gradient-primary text-primary-foreground"
            : "rounded-tl-sm border border-white/[0.07] bg-white/[0.05] text-foreground/90 backdrop-blur-sm"
        }`}
      >
        {msg.text.replace(/\*\*(.*?)\*\*/g, "$1")}
        {msg.time && (
          <p className="mt-1 text-right text-[10px] opacity-50">{msg.time}</p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * XChatWindow — floating contact chat interface.
 *
 * Triggered by a button fixed bottom-right. Animated with Framer Motion
 * AnimatePresence. Bot replies are instant keyword-matching with real info.
 * No external services — fully self-contained.
 */
export function XChatWindow() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when window opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: uid(),
      from: "user",
      text,
      time: now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking (300–700ms)
    const delay = 300 + Math.random() * 400;
    setTimeout(() => {
      const botMsg: Message = {
        id: uid(),
        from: "bot",
        text: getBotReply(text),
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, [input]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir le chat contact"
        aria-expanded={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow transition-all duration-300 hover:brightness-110 animate-pulse-glow"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Minimize2 className="h-5 w-5 text-primary-foreground" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat contact Simon Chusseau"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="fixed bottom-24 right-6 z-50 flex w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(160deg, rgba(15,12,24,0.96) 0%, rgba(8,6,16,0.98) 100%)",
              height: "min(520px, calc(100svh - 10rem))",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary font-display text-sm font-bold text-primary-foreground">
                    SC
                  </div>
                  <span className="absolute -right-0.5 -bottom-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Simon Chusseau</p>
                  <p className="text-[11px] text-emerald-400">Disponible</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le chat"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="scrollbar-none flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <Bubble key={msg.id} msg={msg} />
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-1.5 rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.05] px-4 py-3 backdrop-blur-sm">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div ref={bottomRef} />
            </div>

            {/* Quick-reply pills */}
            <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-2">
              {["Email", "GitHub", "Stack", "Projets", "Disponible ?"].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      setInput("");
                      const userMsg: Message = {
                        id: uid(),
                        from: "user",
                        text: q,
                        time: now(),
                      };
                      setMessages((prev) => [...prev, userMsg]);
                      setIsTyping(true);
                      setTimeout(() => {
                        setMessages((prev) => [
                          ...prev,
                          { id: uid(), from: "bot", text: getBotReply(q), time: now() },
                        ]);
                        setIsTyping(false);
                      }, 350 + Math.random() * 350);
                    }, 50);
                  }}
                  className="flex-shrink-0 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] px-4 py-3">
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Pose une question…"
                  aria-label="Message"
                  className="scrollbar-none flex-1 resize-none rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  style={{ maxHeight: "120px" }}
                  onInput={(e) => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  aria-label="Envoyer"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
                ↵ Envoyer · ⇧↵ Retour à la ligne
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
