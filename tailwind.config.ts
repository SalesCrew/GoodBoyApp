import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        card: '#FFFFFF',
        border: '#F0F0F0',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        accent: '#E5E7EB',
        success: '#10B981',
        delete: '#EF4444',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
}
export default config
