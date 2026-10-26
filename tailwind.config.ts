import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50: "#faf9f7",
          100: "#f4f1ec",
          200: "#e8e0d3",
          300: "#d4c4ae",
          400: "#bda388",
          500: "#a6836a",
          600: "#8f6a54",
          700: "#765647",
          800: "#61473d",
          900: "#513d37",
          950: "#2c1f1c",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "68ch",
            color: "#1a1a1a",
            a: {
              color: "#8f6a54",
              textDecoration: "underline",
              "&:hover": { color: "#765647" },
            },
            h2: { fontFamily: "var(--font-playfair), Georgia, serif" },
            h3: { fontFamily: "var(--font-playfair), Georgia, serif" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
