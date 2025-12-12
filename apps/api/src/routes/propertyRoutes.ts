// /src/routes/propertyRoutes.ts
import { Router } from 'express';
import { PropertyController } from '../controllers/PropertyController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();
const maxImages = 10;

// --- Rutas Públicas ---

// GET /api/properties (Obtener todas) - Debe ir ANTES de /:id
router.get('/', PropertyController.getAllProperties);

// --- Rutas Protegidas (Requieren 'protect') ---

// POST /api/properties (Crear) - Protegido
router.post(
    '/',
    protect,
    upload.array('images', maxImages),
    PropertyController.createProperty
);

// --- ¡ORDEN CAMBIADO! ---
// GET /api/properties/my-properties (Ruta específica) - Debe ir ANTES de /:id
router.get(
    '/my-properties',
    protect,
    PropertyController.getMyProperties
);
// --- FIN DEL CAMBIO ---

// --- Rutas Públicas (Continuación) ---
// GET /api/properties/:id (Obtener una por ID) - Esta es la ruta genérica
router.get('/:id', PropertyController.getPropertyById);

// --- Rutas Protegidas (Continuación) ---

// PUT /api/properties/:id (Actualizar) - Protegido
router.put(
    '/:id',
    protect,
    upload.array('images', maxImages),
    PropertyController.updateProperty
);

// DELETE /api/properties/:id (Eliminar) - Protegido
router.delete('/:id', protect, PropertyController.deleteProperty);

// POST /api/properties/:id/sell (Marcar como vendida) - Protegido
router.post('/:id/sell', protect, PropertyController.sellProperty);

export default router;