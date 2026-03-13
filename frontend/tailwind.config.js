/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8a7cf5',
        secondary: '#65498d',
        surface: {
          main: '#ffffff',
          muted: '#f8f9fc',
          dark: '#1a1a2e',
        },
        text: {
          primary: '#2d2d44',
          muted: '#3d3d5c',
          inverse: '#f0f0f7',
        },
        border: {
          default: '#e2e8f0',
          focus: '#8a7cf5',
          error: '#f87171',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': '48px',
        'h2': '32px',
        'h3': '24px',
        'body': '16px',
        'caption': '12px',
      },
      fontWeight: {
        'bold': '700',
        'semibold': '600',
        'medium': '500',
        'regular': '400',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '6px',
      },
      boxShadow: {
        'card': '0 10px 25px rgba(0, 0, 0, 0.05)',
        'focus': '0 0 0 3px rgba(138, 124, 245, 0.2)',
      }
    },
  },
  plugins: [],
}
