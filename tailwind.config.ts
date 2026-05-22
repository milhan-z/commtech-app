import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F4EE",
        foreground: "#202020",
        card: "#FFFFFF",
        muted: "#77736B",
        border: "#E5E0D7",
        accent: "#FFC857",
        danger: "#FF3B30",
        success: "#34C759",
        ink: "#202020"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"]
      },
      boxShadow: {
        organic: "0 18px 45px rgba(32, 32, 32, 0.08)",
        nav: "0 16px 50px rgba(32, 32, 32, 0.16)"
      },
      borderRadius: {
        organic: "2rem",
        blob: "42% 58% 48% 52% / 46% 42% 58% 54%"
      }
    }
  },
  plugins: [animate]
};

export default config;
