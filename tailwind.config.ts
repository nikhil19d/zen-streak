
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-zen": "var(--gradient-zen)",
        "grasient-success": "var(--gradient-success)"
      }
    },
  },
  plugins: [],
};

export default config;
