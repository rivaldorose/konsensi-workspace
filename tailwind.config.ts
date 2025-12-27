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
          DEFAULT: '#B2FF78',
          50: '#F5FFF0',
          500: '#B2FF78',
          900: '#669944',
        },
        secondary: {
          DEFAULT: '#2D5F4F',
          500: '#2D5F4F',
          900: '#09130F',
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
        montserrat: ['Montserrat', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

