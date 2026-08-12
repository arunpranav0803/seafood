import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f4fbfc',
          100: '#e2f4f7',
          200: '#bfe5ee',
          300: '#97d5e3',
          400: '#67b9ce',
          500: '#3d99b3',
          600: '#2f7b92',
          700: '#285f74',
          800: '#234f61',
          900: '#1f4352'
        },
        coral: {
          50: '#fff4f2',
          100: '#ffe5df',
          200: '#ffc7b8',
          300: '#ff9b82',
          400: '#ff765f',
          500: '#f55a41',
          600: '#d74a37',
          700: '#b43d2f',
          800: '#913128',
          900: '#772924'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(21, 54, 75, 0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
