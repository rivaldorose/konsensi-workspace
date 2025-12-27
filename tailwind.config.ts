import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#b4ff7a',
          dark: '#8bc34a',
          50: '#F5FFF0',
          500: '#b4ff7a',
          900: '#669944',
        },
        secondary: {
          DEFAULT: '#1A3D32',
          light: '#2D5F4F',
          500: '#1A3D32',
          900: '#09130F',
        },
        background: {
          light: '#f7f8f5',
          dark: '#18230f',
        },
        dark: {
          nav: '#131d0c',
        },
        nav: {
          bg: '#18230f',
        },
        surface: {
          light: '#ffffff',
          dark: '#222f18',
        },
        text: {
          main: '#131d0c',
          subtle: '#5c6b53',
        },
        border: {
          color: '#ecf4e6',
          dark: '#3a4d2e',
        },
        card: {
          light: '#FFFFFF',
        },
        grey: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          500: '#6B7280',
          900: '#111827',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
            borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
        DEFAULT: '0.25rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
