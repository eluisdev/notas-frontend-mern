/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient": "linear-gradient(41deg,#440dfd,#1092f7,#00b9ff)",
      },
      backgroundSize: {
        "180": "180% 180%"
      },
      animation: {
        "gradient-animation": "gradient-animation 5s ease infinite"
      },
      keyframes: {
        "gradient-animation": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

