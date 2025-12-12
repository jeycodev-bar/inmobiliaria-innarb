// /src/routes/adminRoutes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/AdminController.js'; // .js
import { protect } from '../middlewares/authMiddleware.js'; // .js
import { adminOnly } from '../middlewares/adminMiddleware.js'; // .js

const router = Router();

// --- ¡IMPORTANTE! ---
// Aplicamos ambos middlewares a TODAS las rutas definidas en este archivo.
// Primero verifica que el token sea válido (protect).
// Segundo verifica que el rol sea 'administrador' (adminOnly).
router.use(protect, adminOnly);

// GET /api/admin/stats (Obtener estadísticas del dashboard)
router.get('/stats', AdminController.getDashboardStats);

// PUT /api/admin/users/role (Actualizar el rol de un usuario)
router.put('/users/role', AdminController.manageUserRole);

// GET /api/admin/logs (NUEVA RUTA DE AUDITORÍA)
router.get('/logs', AdminController.getPropertyLogs);

export default router;