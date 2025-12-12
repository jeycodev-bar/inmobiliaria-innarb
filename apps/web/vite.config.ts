import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    // Configuración del servidor de desarrollo
    server: {
        port: 3000, // Opcional: define el puerto del frontend (por defecto 5173)
        proxy: {
            // Redirige las peticiones de /api al backend
            '/api': {
                target: 'http://localhost:5000', // El puerto de tu API
                changeOrigin: true, // Necesario para la redirección
                secure: false, // No aplica para http
            },
            // Redirige las peticiones de /uploads al backend
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});