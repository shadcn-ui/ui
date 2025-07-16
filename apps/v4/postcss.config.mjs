const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Ensure proper processing for monorepo structure
      config: "./tailwind.config.cjs",
    },
  },
}
export default config
