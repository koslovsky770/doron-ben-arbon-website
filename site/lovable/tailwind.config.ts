import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          light: "hsl(var(--brand-light))",
          dark: "hsl(var(--brand-dark))",
        },
        ink: {
          1: "hsl(var(--ink-1))",
          2: "hsl(var(--ink-2))",
          4: "hsl(var(--ink-4))",
          6: "hsl(var(--ink-6))",
          7: "hsl(var(--ink-7))",
          10: "hsl(var(--ink-10))",
          11: "hsl(var(--ink-11))",
          12: "hsl(var(--ink-12))",
          13: "hsl(var(--ink-13))",
        },
      },
      fontFamily: {
        // Polin is the brand face; Assistant/Heebo only cover a missing glyph
        display: ["Polin", "Assistant", "Heebo", "system-ui", "sans-serif"],
        sans: ["Polin", "Assistant", "Heebo", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Figma: H2 92 / H4 59 / card title 24 — all line-height 1
        d1: ["clamp(2.5rem, 6.39vw, 5.75rem)", { lineHeight: "1" }],
        d2: ["clamp(1.875rem, 4.1vw, 3.6875rem)", { lineHeight: "1.05" }],
        d3: ["clamp(1.25rem, 1.67vw, 1.5rem)", { lineHeight: "1.2" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "spin-slow": "spin-slow 90s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
