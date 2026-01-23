import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme"; // Import defaultTheme

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
        'inter': ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
