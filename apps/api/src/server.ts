// /src/server.ts
import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import pool from './config/db.js';

// Imports para archivos estáticos y ESM
import path from 'path';
import { fileURLToPath } from 'url';

// --- IMPORTAR TODAS LAS RUTAS ---
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // <-- AÑADIR ESTA LÍNEA

// --- Configuración de __dirname para ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..'); // Sube de /dist a /apps/api

const app: Application = express();

// Middlewares
app.use(cors()); // Habilita CORS
app.use(express.json()); // Parsea body's JSON
app.use(express.urlencoded({ extended: true })); // Parsea form-data

// --- SERVIR ARCHIVOS ESTÁTICOS (IMÁGENES) ---
// Sirve la carpeta 'uploads' (que está en /apps/api/uploads)
// en la ruta '/uploads'
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

// --- DEFINICIÓN DE RUTAS DE LA API ---
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes); // <-- AÑADIR ESTA LÍNEA

// Ruta de bienvenida y prueba de BBDD
app.get('/api', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            message: 'API de Inmobiliaria INNARB funcionando (ESM) 🚀',
            db_connection: 'Exitosa',
            db_time: result.rows[0].now,
        });
    } catch (error) {
        console.error('Error al conectar a la BBDD', error);
        res.status(500).json({
            message: 'API funcionando, pero falló la conexión a la BBDD.',
            error: (error as Error).message,
        });
    }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Servidor ESM corriendo en http://localhost:${PORT}`);
});