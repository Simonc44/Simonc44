"use client";

import dynamic from "next/dynamic";

/**
 * Client-only wrapper for CustomCursor.
 * Must be a Client Component because `next/dynamic` with `ssr: false`
 * is not allowed inside Server Components in Next.js 15.
 */
const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export function ClientCustomCursor() {
  return <CustomCursor />;
}
