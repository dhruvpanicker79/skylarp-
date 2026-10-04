/**
 * Skylark design tokens.
 *
 * Plain CommonJS on purpose: Next's PostCSS pipeline does not reliably load a
 * TypeScript Tailwind config, and when it fails it silently falls back to the
 * stock theme — so custom colours and fonts disappear with a confusing
 * "class does not exist" error. A .js config removes that failure mode.
 *
 * Blue carries the brand, orange is an accent used for hierarchy and never as
 * a wash, and body copy sits on warm off-white rather than pure white so long
 * passages stay readable against dark grounds.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#050A1F", // deepest ground, behind the flight scene
          800: "#0A1130", // panel ground
          700: "#101A42",
          600: "#172354",
          500: "#1F2E6B",
        },
        skylark: {
          700: "#0E1C5E",
          600: "#152A8A", // brand blue
          500: "#2A42B8",
          400: "#4C66DD",
        },
        ember: {
          600: "#D94E1F", // deep orange, from the logo's lower wing
          500: "#FF7A00", // accent orange
          400: "#FF9633",
          300: "#FFB866",
        },
        ivory: {
          50: "#FAF9F6",
          100: "#F2F0EA", // primary reading colour
          200: "#D9D6CC",
          300: "#A8A496",
        },
        slate: {
          400: "#8A93A6",
          500: "#646D80",
        },
        ink: "#111318",
      },
      fontFamily: {
        sans: ["var(--font-text)", "system-ui", "sans-serif"],
        head: ["var(--font-display)", "var(--font-text)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Archivo is a normal-width grotesk, so display sizes take negative
        // tracking. Only the hero is set in caps; section headings run in
        // sentence case, which reads far less shouty.
        display: ["clamp(2.9rem, 7.2vw, 7rem)", { lineHeight: "0.92", letterSpacing: "-0.035em", fontWeight: "800" }],
        title: ["clamp(2rem, 4vw, 3.6rem)", { lineHeight: "0.98", letterSpacing: "-0.028em", fontWeight: "700" }],
        heading: ["clamp(1.35rem, 2.3vw, 1.95rem)", { lineHeight: "1.1", letterSpacing: "-0.018em", fontWeight: "600" }],
        sub: ["1.0625rem", { lineHeight: "1.5", fontWeight: "500" }],
        body: ["1.0625rem", { lineHeight: "1.68" }],
        caption: ["0.9rem", { lineHeight: "1.58" }],
        meta: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.15em", fontWeight: "500" }],
      },
      maxWidth: { measure: "62ch" },
      transitionTimingFunction: {
        // Motion should read as mass moving, not as UI easing.
        flight: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
