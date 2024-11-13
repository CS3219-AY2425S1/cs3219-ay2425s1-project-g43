/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "1220px",
      lg: "1500px",
    },
    extend: {},
  },
  plugins: [],
};
