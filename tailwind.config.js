/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
      },
      colors: {
        "mrts-orange": "#F57F37",
        primary: "#F57F37",
        secondary: "#A77B71",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

/*
#F57F37
#A77B71
#7E4438
#35231F
*/
