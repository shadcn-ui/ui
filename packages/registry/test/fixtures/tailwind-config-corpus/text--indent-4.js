module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: "#ff0000",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
    ],
}
