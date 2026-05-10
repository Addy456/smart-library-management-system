/**
 * Smart Library — Design System Tailwind extension
 *
 * Merge this into your existing tailwind.config.js `theme.extend`.
 * Keeps your current `primary`/`accent`/`surface` definitions compatible;
 * see README_DESIGN_SYSTEM.md for a full replacement example.
 */

/** @type {import('tailwindcss').Config['theme']['extend']} */
export const designSystemExtend = {
  colors: {
    // Brand
    primary: {
      50:  "#F5F3FF",
      100: "#EDE9FE",
      200: "#DDD6FE",
      300: "#C4B5FD",
      400: "#A78BFA",
      500: "#8B5CF6",  // ← brand primary
      600: "#7C3AED",
      700: "#6D28D9",
      800: "#5B21B6",
      900: "#4C1D95",
      DEFAULT: "#8B5CF6",
    },
    secondary: {
      50:  "#F0FDF4",
      100: "#DCFCE7",
      200: "#BBF7D0",
      300: "#86EFAC",
      400: "#4ADE80",
      500: "#22C55E",  // ← secondary green
      600: "#16A34A",
      700: "#15803D",
      800: "#166534",
      900: "#14532D",
      DEFAULT: "#22C55E",
    },
    accent: {
      50:  "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",  // ← accent orange
      600: "#D97706",
      700: "#B45309",
      800: "#92400E",
      900: "#78350F",
      DEFAULT: "#F59E0B",
    },
    danger: {
      50:  "#FEF2F2",
      100: "#FEE2E2",
      200: "#FECACA",
      300: "#FCA5A5",
      400: "#F87171",
      500: "#EF4444",
      600: "#DC2626",
      700: "#B91C1C",
      DEFAULT: "#EF4444",
    },
    // App surfaces
    background: "#F8FAFC",     // ← requested page bg (soft slate)
    surface: {
      DEFAULT: "#FFFFFF",      // card / panel in light mode
      100: "#F8FAFC",
      200: "#FFFFFF",          // light-mode card
      // Dark-mode surfaces kept for token compatibility (not applied in UI).
      900: "#0F172A",
      800: "#1E293B",
    },
  },

  fontFamily: {
    heading: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
    body:    ["Inter", "system-ui", "sans-serif"],
  },

  fontSize: {
    // Display scale (headings)
    "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
    "display":    ["3rem",    { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
    "h1":         ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
    "h2":         ["1.875rem",{ lineHeight: "1.25", fontWeight: "700" }],
    "h3":         ["1.5rem",  { lineHeight: "1.3", fontWeight: "600" }],
    "h4":         ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
  },

  borderRadius: {
    // System targets: 16–24 px
    xl:   "1rem",     // 16px
    "2xl":"1.25rem",  // 20px
    "3xl":"1.5rem",   // 24px — card default
    "4xl":"2rem",     // 32px — feature surfaces
  },

  spacing: {
    // 4-pt spacing augments (Tailwind defaults already cover the rest)
    "18": "4.5rem",
    "22": "5.5rem",
  },

  boxShadow: {
    // Soft-but-present shadows — enough lift to feel premium, no neon.
    card:     "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 20px rgba(15, 23, 42, 0.07)",
    elevated: "0 4px 10px rgba(15, 23, 42, 0.05), 0 18px 40px rgba(15, 23, 42, 0.10)",
    modal:    "0 24px 60px rgba(15, 23, 42, 0.18)",
    hero:     "0 20px 48px -12px rgba(124, 58, 237, 0.45)",
    // "Glow" names kept for backward-compat but resolved to soft tinted shadows.
    "glow-primary": "0 10px 24px rgba(139, 92, 246, 0.22)",
    "glow-accent":  "0 10px 24px rgba(245, 158, 11, 0.22)",
  },

  transitionTimingFunction: {
    "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

/**
 * Example full config (drop-in):
 *
 *   import { designSystemExtend } from "./src/components/ui/tailwind.preset";
 *
 *   export default {
 *     content: ["./index.html", "./src/**\/*.{js,jsx,ts,tsx}"],
 *     darkMode: "class",
 *     theme: { extend: designSystemExtend },
 *     plugins: [],
 *   };
 */
