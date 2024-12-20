import type { Config } from "tailwindcss";

<<<<<<< HEAD
export default {
=======
const config: Config = {
>>>>>>> c227043d7798fe6345edcb8594de0eb3f081b6cc
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
<<<<<<< HEAD
} satisfies Config;
=======
};
export default config;
>>>>>>> c227043d7798fe6345edcb8594de0eb3f081b6cc
