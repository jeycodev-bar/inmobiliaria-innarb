// /src/routes/favoriteRoutes.ts
import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController.js'; // .js
import { protect } from '../middlewares/authMiddleware.js'; // .js

const router = Router();

// Todas las rutas de favoritos requieren que el usuario esté autenticado.
router.use(protect);

// GET /api/favorites/ (Obtener mis favoritos)
router.get('/', FavoriteController.getMyFavorites);

// POST /api/favorites/ (Añadir un favorito)
router.post('/', FavoriteController.addFavorite);

// DELETE /api/favorites/:propertyId (Eliminar un favorito)
router.delete('/:propertyId', FavoriteController.removeFavorite);

export default router;