/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: ["forest", "emerald", "cmyk"]
  },
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

