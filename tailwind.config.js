/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      rotate: {
        '360': '360deg',
      },
      keyframes: {
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
      },
      animation: {
        slideInFromLeft: 'slideInFromLeft 1s ease-out forwards',
        slideOutToLeft: 'slideOutToLeft 1s ease-out forwards',
      },
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "8.75rem",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-rounded': {
          'scrollbar-color': '#888 #f1f1f1',
        },
        '.scrollbar-thumb': {
          'scrollbar-color': '#888',
          'border-radius': '10px',
        },
        '.scrollbar-thumb:hover': {
          'scrollbar-color': '#555',
        },
        '.scrollbar-track': {
          'scrollbar-color': '#f1f1f1',
        },
        '.scrollbar-track:hover': {
          'scrollbar-color': '#f1f1f1',
        },
      }, ['responsive'])
    },

  ],
};
