/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // include all React files
  ],
  theme: {
    extend: {
      colors: {
        purple1: "#7765DA",
        purple2: "#5767D0",
        purple3: "#4F0DCE",
        light: "#F2F2F2",
        dark: "#373737",
        muted: "#6E6E6E",
      },
      borderRadius: {
        custom: "12px",
        full: "36px",
      },
      maxWidth: {
        custom: "900px",
      },
    },
  },
  plugins: [],
};
