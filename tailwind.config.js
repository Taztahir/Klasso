/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                cream: 'var(--cream)',
                brandPurple: 'var(--brand-purple)',
                brandYellow: 'var(--brand-yellow)',
                brandGreen: 'var(--brand-green)',
                brandPink: 'var(--brand-pink)',
                brandBlack: 'var(--brand-black)',
                brandBg: 'var(--bg)',
                brandSurface: 'var(--surface)',
            },
            animation: {
                wiggle: 'highlight-wiggle 4s ease-in-out infinite',
                float: 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 1.5s',
                'float-reverse': 'float 6s ease-in-out infinite reverse',
                'float-delayed-reverse': 'float 6s ease-in-out infinite 1.5s reverse',
            },
            keyframes: {
                'highlight-wiggle': {
                    '0%, 100%': { transform: 'rotate(-1.5deg)' },
                    '50%': { transform: 'rotate(1deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
