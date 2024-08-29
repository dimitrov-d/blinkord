import type { Config } from "tailwindcss";

const config = {
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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "builderz-green": "#14f195",
        "builderz-blue": "#00ffd5",
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        mesh: "radial-gradient(at 47.0% 96.0%, #151b40 0px, transparent 50%),radial-gradient(at 61.0% 15.0%, #09162b 0px, transparent 50%),radial-gradient(at 8.0% 16.0%, #0f1930 0px, transparent 50%),radial-gradient(at 85.0% 28.0%, #110c3d 0px, transparent 50%),radial-gradient(at 81.0% 66.0%, #060d1f 0px, transparent 50%)",
        "light-mesh":
          "radial-gradient(at 47.0% 96.0%, #a8abbd 0px, transparent 50%),radial-gradient(at 61.0% 15.0%, #d5dde8 0px, transparent 50%),radial-gradient(at 8.0% 16.0%, #c3ccde 0px, transparent 50%),radial-gradient(at 85.0% 28.0%, #b2abeb 0px, transparent 50%),radial-gradient(at 81.0% 66.0%, #ccd2e0 0px, transparent 50%)",
      },
      backgroundColor: {
        mesh: "#0a0924",
        "light-mesh": "#e6e6f0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("daisyui"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;

export default config;
