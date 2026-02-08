import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        "deep-space": "#0a0a0a"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"]
      },
      borderRadius: {
        "4xl": "4rem"
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" }
        }
      },
      animation: {
        heartbeat: "heartbeat 1.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
