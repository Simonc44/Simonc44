import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { IntlProvider } from "@/providers/intl-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "S.C — Architecte de solutions numériques",
  description:
    "Portfolio interactif d'un architecte de solutions numériques. C++, Three.js, Generative Art, Indie Hacker.",
  authors: [{ name: "S.C" }],
  keywords: [
    "portfolio",
    "three.js",
    "react-three-fiber",
    "indie maker",
    "ai",
    "creative developer",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} dark`}>
      <body className="bg-background text-foreground font-display antialiased">
        <IntlProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
