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
        ink: '#0C0E14',
        'ink-2': '#141721',
        fog: '#E7E9E6',
        'fog-2': '#DCDFDB',
        signal: '#FF5A1F',
        slate: '#6E7480',
        // legacy dashboard aliases
        bg: '#0C0E14',
        surface: '#141721',
        'surface-2': '#1B1F2A',
        cream: '#E7E9E6',
        muted: '#6E7480',
        accent: '#FF5A1F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Narrow', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
