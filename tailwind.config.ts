import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme presets will use these base colors
        'vintage-cream': '#f5f1e8',
        'vintage-brown': '#8b7355',
        'ocean-blue': '#e8f4f8',
        'ocean-dark': '#2c5f7d',
        'forest-green': '#e8f5e9',
        'forest-dark': '#2d5f2e',
        'sunset-pink': '#fff0f5',
        'sunset-dark': '#d4526e',
      },
    },
  },
  plugins: [],
}
export default config
