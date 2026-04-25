import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        vermelho: {
          DEFAULT: "hsl(var(--vermelho))",
          soft: "hsl(var(--vermelho-soft))",
        },
        amarelo: {
          DEFAULT: "hsl(var(--amarelo))",
          soft: "hsl(var(--amarelo-soft))",
        },
        cream: "hsl(var(--cream))",
        charcoal: "hsl(var(--charcoal))",
        beige: {
          light: "hsl(var(--beige-light))",
          DEFAULT: "hsl(var(--beige))",
          medium: "hsl(var(--beige-medium))",
          warm: "hsl(var(--beige-warm))",
          dark: "hsl(var(--beige-dark))",
        },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "cloud-drift": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(20px)" },
        },
        "bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "twinkle": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.4) rotate(20deg)", opacity: "0.6" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-15px) translateX(8px)" },
        },
        "greet": {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-10px) rotate(3deg)" },
        },
        "peek-in": {
          "0%": { transform: "translateY(40px) rotate(-8deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
        },
        "kids-bounce": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "30%": { transform: "scale(1.12) rotate(-2deg)" },
          "60%": { transform: "scale(0.95) rotate(1deg)" },
          "80%": { transform: "scale(1.05) rotate(-1deg)" },
        },
        "kids-wobble": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-4deg)" },
          "75%": { transform: "rotate(4deg)" },
        },
        "kids-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.3)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "kids-float-note": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0.7" },
          "50%": { transform: "translateY(-30px) rotate(15deg)", opacity: "1" },
          "100%": { transform: "translateY(-60px) rotate(-10deg)", opacity: "0" },
        },
        "kids-sparkle-drift": {
          "0%": { transform: "translateY(0) translateX(0) scale(0.8)", opacity: "0.5" },
          "50%": { transform: "translateY(-20px) translateX(10px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translateY(-40px) translateX(-5px) scale(0.6)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "cloud-slow": "cloud-drift 14s ease-in-out infinite",
        "cloud-medium": "cloud-drift 10s ease-in-out infinite",
        "cloud-fast": "cloud-drift 7s ease-in-out infinite",
        "bob-slow": "bob 4.5s ease-in-out infinite",
        "bob-medium": "bob 3.8s ease-in-out infinite",
        "bob-fast": "bob 3s ease-in-out infinite",
        "twinkle-1": "twinkle 2.4s ease-in-out infinite",
        "twinkle-2": "twinkle 3.1s ease-in-out infinite 0.5s",
        "twinkle-3": "twinkle 2.7s ease-in-out infinite 1s",
        "float-1": "float-y 5s ease-in-out infinite",
        "float-2": "float-y 6.5s ease-in-out infinite 0.7s",
        "float-3": "float-y 7s ease-in-out infinite 1.3s",
        "greet": "greet 2.6s ease-in-out infinite",
        "peek-in": "peek-in 0.8s ease-out forwards",
        "kids-bounce": "kids-bounce 0.5s ease-in-out",
        "kids-wobble": "kids-wobble 0.6s ease-in-out infinite",
        "kids-pop": "kids-pop 0.4s ease-out forwards",
        "kids-float-note-1": "kids-float-note 4s ease-in-out infinite",
        "kids-float-note-2": "kids-float-note 5s ease-in-out infinite 1s",
        "kids-float-note-3": "kids-float-note 6s ease-in-out infinite 2s",
        "kids-sparkle-1": "kids-sparkle-drift 3.5s ease-in-out infinite",
        "kids-sparkle-2": "kids-sparkle-drift 4.5s ease-in-out infinite 0.8s",
        "kids-sparkle-3": "kids-sparkle-drift 5s ease-in-out infinite 1.6s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
