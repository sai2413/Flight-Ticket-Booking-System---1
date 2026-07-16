/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#eef1f6',
          100: '#d6ddea',
          400: '#3a4f74',
          600: '#1c2d4d',
          700: '#152238',
          800: '#0f1a2c',
          900: '#0b1420',
        },
        teal: {
          50: '#e6fbfa',
          100: '#c1f4f1',
          400: '#2bc4bd',
          500: '#0fa3a3',
          600: '#0c8687',
        },
        amber: {
          400: '#f5b64d',
          500: '#f2a93b',
          600: '#d98f22',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'radar-grid':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
