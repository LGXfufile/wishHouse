/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        sage: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bae6ba',
          300: '#88d488',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        'chinese': ['Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        'english': ['Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'lotus': "url('/images/lotus-bg.svg')",
        'mountain': "url('/images/mountain-bg.svg')",
        'lantern': "url('/images/lantern-bg.svg')",
      }
    },
  },
  plugins: [],
} 