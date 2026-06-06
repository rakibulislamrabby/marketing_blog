tailwind.config = {
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff5f8", 100: "#ffe8f0", 200: "#ffd1e3", 300: "#ffb3d1",
          400: "#ff8fb8", 500: "#f472b6", 600: "#db2777",
        },
        plum: {
          50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe",
          400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce",
        },
        ink: {
          900: "#1a1528", 800: "#2d2640", 700: "#3d3555", 600: "#4a4063",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
};
