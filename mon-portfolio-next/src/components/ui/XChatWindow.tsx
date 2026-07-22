"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Command, CornerDownLeft } from "lucide-react";

const TERMINAL_TEXT = "simon@elite-studio:~$ ./initiate_contact.sh\n> Initializing secure connection...\n> Ready. How can I help you today?";

export function XChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  useEffect(() => {
    if (!isOpen) return;
    setTypedText("");
    setIsTyping(true);
    setStatus("idle");

    let i = 0;
    const interval = setInterval(() => {
      setTypedText(TERMINAL_TEXT.slice(0, i));
      i++;
      if (i > TERMINAL_TEXT.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30); // Vitesse de frappe

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => onClose(), 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[100] w-full max-w-sm overflow-hidden rounded-2xl glass-obsidian border border-white/10 shadow-island"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2">
              <Command className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">terminal_session</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Terminal Body */}
          <div className="p-5">
            <div className="mb-6 min-h-[4rem] font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {typedText}
              {isTyping && <span className="cursor-blink inline-block h-4 w-2 bg-foreground align-middle" />}
            </div>

            {!isTyping && status !== "success" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="relative"
              >
                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <span className="font-mono text-primary">{'>'}</span>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    disabled={status === "sending"}
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    {status === "sending" ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                    ) : (
                      <CornerDownLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 font-mono text-sm text-emerald-400"
              >
                &gt; Transmission successful. I will reach out soon.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
