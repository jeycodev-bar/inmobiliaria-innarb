/** @type {import('tailwindcss').Config} */
export default {
    // Archivos que Tailwind debe escanear
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // Incluye todos los archivos de React
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                }
            },
            fontFamily: {
                rubik: ["Rubik Vinyl", "system-ui", "sans-serif"],
                goldman: ["Goldman", "sans-serif", "mono"],
                prevol: ["Protest Revolution", "sans-serif"],
                londri: ["Londrina Shadow", "sans-serif"],
                genox: ["Genos", "sans-serif"],
                michroma: ["Michroma", "sans-serif"],
            },
            backgroundImage: {
                'radial-cyabl': 'radial-gradient(circle, #003e4fff, #0f172a)',
                'radial-turk': 'radial-gradient(circle, #87007cff, #0f172a)',
                'radial-golden': 'radial-gradient(circle, #fbcd00e1, #0f172a)',
                'radial-sunset': 'radial-gradient(circle, #ff7e5f, #feb47b)',
                'radial-greenight': 'radial-gradient(circle, #d3d3d3ff, #0191a4ff)',
                'radial-silver': 'radial-gradient(circle, #adecffff, #bebcbcff)',
                
                // 'radial-silver': 'radial-gradient(circle, #ffefadff, #bebcbcff)',

                //'vertical-slate': 'linear-gradient(to bottom, #004666ff, #001937ff)',
                //bg-[linear-gradient(to_top,_#cbd5e1_0%,_#cbd5e1_25%,_#0f172a_60%)]
                //bg-[linear-gradient(to bottom, #cbd5e1 0%, #cbd5e1 25%, #0f172a 60%)]

                //linear-gradient(to_bottom, #003734ff , #0f172a),
                //linear-gradient(to_top, #132933ff 0%, #004666ff 25%, #0f172a 60% 

                //👇con imágenes
                'hero-blob': "url('/images/blob-scene-haikei.svg')",
                'hero-iluminary': "url('/images/polygon-luminary.svg')",
                'hero-login': "url('/images/login-photo.png')",
            },
        },
    },
    plugins: [],
};