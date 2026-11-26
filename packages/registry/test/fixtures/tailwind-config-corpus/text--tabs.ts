import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: "#ff0000",
			},
		},
	},
	plugins: [],
}

export default config
