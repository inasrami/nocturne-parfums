/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A09",
        charcoal: "#151413",
        ivory: "#F5F2EB",
        gold: {
          DEFAULT: "#C9A96B",
          light: "#D9C49C",
          muted: "#8F7A4E",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};