import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aurelle: {
          ivory: "#FDFBF7",
          sand: "#F8F5EE",
          cream: "#F1EBE1",
          border: "#E7DFD3",
          ink: "#1A1817",
          charcoal: "#2B2826",
          muted: "#716C66",
          burgundy: "#722F37",
          wine: "#561D24",
          gold: "#C5A880",
          "gold-light": "#E2D3BE",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
