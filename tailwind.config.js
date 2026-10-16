/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#080B14",
          secondary: "#101525",
          card: "#141B2D",
          hover: "#1C253E",
        },
        border: {
          DEFAULT: "#1E293B",
          subtle: "#172033",
          glow: "#3B82F6",
        },
        brand: {
          purple: {
            DEFAULT: "#6B21A8",
            light: "#8B5CF6",
            dark: "#581C87",
            glow: "rgba(107, 33, 168, 0.4)",
          },
          blue: {
            DEFAULT: "#3B82F6",
            light: "#60A5FA",
            dark: "#1D4ED8",
            glow: "rgba(59, 130, 246, 0.4)",
          },
          cyan: {
            DEFAULT: "#06B6D4",
            light: "#22D3EE",
            dark: "#0891B2",
            glow: "rgba(6, 182, 212, 0.4)",
          },
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#06B6D4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(59, 130, 246, 0.25)",
        "glow-purple": "0 0 25px -5px rgba(107, 33, 168, 0.35)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.3)",
      },
    },
  },
  plugins: [],
};
