/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff5f8",
          100: "#ffe8f0",
          200: "#ffd1e3",
          300: "#ffb3d1",
          400: "#ff8fb8",
          500: "#f472b6",
          600: "#db2777",
        },
        plum: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        ink: {
          900: "#1a1528",
          800: "#2d2640",
          700: "#3d3555",
          600: "#4a4063",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(244,114,182,0.25), transparent), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(168,85,247,0.2), transparent), linear-gradient(180deg, #fff5f8 0%, #faf5ff 50%, #ffffff 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,245,248,0.7) 100%)",
        "cta-gradient": "linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #9333ea 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(168, 85, 247, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        card: "0 4px 24px rgba(26, 21, 40, 0.06)",
        "card-hover": "0 12px 40px rgba(168, 85, 247, 0.15)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
