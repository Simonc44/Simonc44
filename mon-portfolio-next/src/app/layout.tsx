import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { IntlProvider } from "@/providers/intl-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Simon Chusseau — Architecte de solutions numériques",
  description:
    "Portfolio de Simon Chusseau — architecte de solutions numériques. TypeScript, Rust, Python, Three.js, IA. Indie maker & créateur de CygnisAI, Mandat, OmniMCP.",
  authors: [{ name: "Simon Chusseau" }],
  keywords: [
    "portfolio",
    "simon chusseau",
    "three.js",
    "react-three-fiber",
    "indie maker",
    "cygnis ai",
    "mandat",
    "omnimcp",
    "typescript",
    "rust",
    "creative developer",
  ],
  openGraph: {
    title: "Simon Chusseau — Architecte de solutions numériques",
    description:
      "TypeScript · Rust · Python · Three.js · IA — du prototype à la production.",
    url: "https://simon-chusseau.vercel.app",
    siteName: "Simon Chusseau",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030303",
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
          <SmoothScrollProvider>
            <ScrollProgress />
            {children}
          </SmoothScrollProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
