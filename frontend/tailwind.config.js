/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        surface: 'var(--surface)',
        card: 'var(--card)',
        accent: {
          primary: '#7C3AED',
          secondary: '#4F46E5',
        },
        feedback: {
          success: '#22C55E',
          danger: '#EF4444',
          warning: '#F59E0B',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        border: 'var(--border)',
      },
      borderRadius: {
        'premium': '18px',
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'premium-glow': '0 0 25px rgba(124, 90, 237, 0.25)',
      },
      backdropBlur: {
        'premium': '15px',
      }
    },
  },
  plugins: [],
}
