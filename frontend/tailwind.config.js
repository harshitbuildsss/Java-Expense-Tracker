/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0A0A0A', // page background
          raised: '#131313',  // card background
          hover: '#1A1A1A',
          border: '#232323',
        },
        accent: {
          DEFAULT: '#B6F13B', // lime accent
          dim: '#8FCB1F',
          soft: 'rgba(182,241,59,0.12)',
        },
        income: '#4ADE80',
        expense: '#F4534A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset',
      },
    },
  },
  plugins: [],
}
