/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom pastel colors if needed
                pastel: {
                    blue: '#E3F2FD',
                    green: '#E8F5E9',
                    red: '#FFEBEE',
                    yellow: '#FFFDE7',
                    purple: '#F3E5F5',
                }
            },
        },
    },
    plugins: [],
}
