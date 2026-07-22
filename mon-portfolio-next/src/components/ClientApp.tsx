"use client";

import { useState } from "react";
import { CompactNavbar } from "@/components/ui/CompactNavbar";
import { XChatWindow } from "@/components/ui/XChatWindow";

/**
 * ClientApp manages the shared state between the Navbar and the Chat Window,
 * keeping the root page as a pure Server Component.
 */
export function ClientApp() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <CompactNavbar onOpenChat={() => setIsChatOpen(true)} />
      <XChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
