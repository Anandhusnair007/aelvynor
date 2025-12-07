/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Zinc 950
        foreground: '#fafafa', // Zinc 50
        // Enterprise SaaS Primary Colors (Indigo)
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          50: '#EEF2FF',
          100: '#EEF2FF',
          500: '#6366F1', // Indigo 500
          600: '#4F46E5', // Indigo 600
          900: '#312E81', // Indigo 900
          foreground: '#ffffff',
        },
        // Accent Colors
        success: {
          DEFAULT: '#10B981', // Green 500
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#F59E0B', // Yellow 500
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#EF4444', // Red 500
          foreground: '#ffffff',
        },
        action: {
          DEFAULT: '#3B82F6', // Blue 500
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#27272a', // Zinc 800
          foreground: '#fafafa',
        },
        accent: {
          DEFAULT: '#6366F1', // Indigo 500
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#18181b', // Zinc 900
          foreground: '#fafafa',
        },
        sidebar: {
          DEFAULT: '#312E81', // Indigo 900
          foreground: '#ffffff',
        },
        'render-purple': '#4c1d95', // Deep purple
        'render-blue': '#1e3a8a', // Deep blue
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'input': '8px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to bottom right, #09090b, #1e1b4b, #09090b)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'count-up': 'countUp 1s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      transitionDuration: {
        '200': '200ms',
        '150': '150ms',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
