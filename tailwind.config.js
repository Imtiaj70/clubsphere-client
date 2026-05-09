/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#4ECDC4",
        accent: "#FF6B6B",
        dark: "#1A1A2E",
        light: "#F8F9FA",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        clubsphere: {
          primary: "#6C63FF",
          secondary: "#4ECDC4",
          accent: "#FF6B6B",
          neutral: "#1A1A2E",
          "base-100": "#ffffff",
          "base-200": "#F8F9FA",
          "base-300": "#E9ECEF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      "light",
    ],
    defaultTheme: "clubsphere",
  },
};
