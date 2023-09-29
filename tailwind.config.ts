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
        background: '#f5f6f8',
        light: '#f5f5f5',
        mid: '#DBD6D6',
        dark: '#1b1b1b',
        description_light: '#bdbdbd',
        description: '#8a8a8a',

        amber_100: '#f5d986',
        amber_200: '#f5b486',
        amber_300: '#eca988',
        amber_400: '#e49e71',
        amber_500: '#d88459',
        amber_600: '#c16c42',
        amber_700: '#a7562b',
        contrast_50: '#86aaf5',
      },
    },
  },
  plugins: [],
}
export default config
