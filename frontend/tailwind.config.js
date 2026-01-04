/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      colors: {
        background: "#F9F9F7",
        foreground: "#1A1A1A",
        card: "#FFFFFF",
        "card-foreground": "#1A1A1A",
        popover: "#FFFFFF",
        "popover-foreground": "#1A1A1A",
        primary: "#002FA7",
        "primary-foreground": "#FFFFFF",
        secondary: "#E8E6DF",
        "secondary-foreground": "#1A1A1A",
        muted: "#F2F0E9",
        "muted-foreground": "#1A1A1A",
        accent: "#FDFF00",
        "accent-foreground": "#000000",
        destructive: "#D93025",
        "destructive-foreground": "#FFFFFF",
        border: "#E6E4DC",
        input: "#E6E4DC",
        ring: "#002FA7",
        paper: "#F9F9F7",
        ink: "#1A1A1A",
        klein: "#002FA7",
        highlighter: "#FDFF00",
      },
      fontFamily: {
        fraunces: ["'Fraunces'", "serif"],
        manrope: ["'Manrope'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-right": "slide-in-from-right 0.5s ease-out",
        "slide-up": "slide-in-from-bottom 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};