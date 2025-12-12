// /src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js'; // .js
import { protect } from '../middlewares/authMiddleware.js'; // .js
import { adminOnly } from '../middlewares/adminMiddleware.js'; // .js

const router = Router();

// Rutas públicas
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rutas protegidas (requieren token)
router.get('/profile', protect, UserController.getProfile);

// --- ¡NUEVA RUTA! ---
// Permite al usuario logueado actualizar su propio perfil
router.put('/profile', protect, UserController.updateProfile);

// Rutas de administrador (requieren token + rol admin)
router.get('/', protect, adminOnly, UserController.getAllUsers);

export default router;
