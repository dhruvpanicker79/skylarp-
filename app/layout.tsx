import type { Metadata, Viewport } from "next";
import { EB_Garamond, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";

/**
 * Type system.
 *
 * Three faces doing three jobs — headline, text, data — rather than one
 * neutral grotesk doing everything, which is what makes a site read as
 * generic.
 *
 * EB Garamond carries both headlines and body — an old-style serif with real
 * calligraphic contrast. It gives the site an editorial, printed-journal
 * character rather than a software one.
 *
 * Roboto Mono stays for numbers, units and field labels. Garamond's old-style
 * figures sit at different heights by design, which is lovely in a sentence and
 * wrong in a specification table where digits must align in columns.
 */

const display = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const text = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://djsskylark.com"),
  title: {
    default: "DJS Skylark — Aero Design Team",
    template: "%s — DJS Skylark",
  },
  description:
    "DJS Skylark is the Aero Design team of Dwarkadas J. Sanghvi College of Engineering, Mumbai. We design, build, test and fly radio-controlled aircraft for SAE Aero Design, competing in the Regular, Micro and Advanced classes.",
  openGraph: {
    type: "website",
    siteName: "DJS Skylark",
    title: "DJS Skylark — Aero Design Team",
    description:
      "Three classes, one team. Design, build, test and fly — the aircraft, the engineering and the people behind them.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050A1F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${mono.variable}`}
    >
      <body>
        {/* Keyboard users should be able to get past the flight sequence. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ember-500 focus:px-4 focus:py-2 focus:text-navy-900"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
