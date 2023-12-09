/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/tailwind-datepicker-react/dist/**/*.js"],
    theme: {
        extend: {
            screens: {
                mobile: "640px",
                tablet: "768px",
                laptop: "1024px",
                xl: "1280px",
                "2xl": "1536px",
            },
            scale: {
                '70': '0.7',
                '65': '0.65',
                '50': '0.50',
            },
            fontFamily: {
                OpenSans: ["Open Sans", "sans-serif"],
                Roboto: ["Roboto", "serif"],
            },
            colors: {
                background: "#ffffff", //trắng cho header
                background_2: "#F8FAFC", //nền này khác trắng
                footer: "#F9F8F6", // xám trắng cho footer
                lightblue: "#29ABE2", // xanh trời nhạt
                bluelogo: "#50BAE6",
                nav: "#D8D8D8", // xám nhạt cho navbar
                navy: "#74859C", // xanh navi
                navyhover: "#7e8fa6",
                darkgray: "#5C5C5C", // xám đen
                error: "#FF0000", // đỏ
                success: "#28a745", // xanh lá
            },
            backgroundImage: {
                utemy: "url('/src/assets/images/utemy_logo_notext.png')",
                elearn: "url('/src/assets/images/free1.jpg')",
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#087930",
                    secondary: "#FFCF90",
                    "base-100": "#fff",
                    "base-content": "#5c5c5c",
                    accent: "#FAFAFA",
                    neutral: "#000",
                },
            },
        ],
    },
};
