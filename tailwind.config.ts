import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#07070c", panel: "#12121c", line: "#23233a", hot: "#ea580c", vio: "#9a3412", mint: "#22e3a5", sun: "#ffc93c" },
    keyframes: {
      rise: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "none" } },
      glow: { "0%,100%": { opacity: ".55" }, "50%": { opacity: "1" } },
      stamp: { "0%": { opacity: "0", transform: "scale(2) rotate(-25deg)" }, "100%": { opacity: "1", transform: "scale(1) rotate(-12deg)" } },
      marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
    },
    animation: { rise: "rise .6s ease-out both", glow: "glow 3s ease-in-out infinite", stamp: "stamp .7s cubic-bezier(.2,1.6,.4,1) both", marquee: "marquee 30s linear infinite" },
  } },
  plugins: [],
};
export default config;
