// /src/controllers/FavoriteController.ts
import { Request, Response } from 'express';
import { FavoriteModel } from '../models/FavoriteModel.js'; // .js
import { PropertyModel } from '../models/PropertyModel.js'; // .js

// Tipo para el payload del usuario en req.user
type UserPayload = {
    id: string;
    role: string;
};

export class FavoriteController {
    /**
     * Añade una propiedad a favoritos.
     */
    static async addFavorite(req: Request, res: Response) {
        try {
            const { propertyId } = req.body;
            const userId = (req.user as UserPayload).id;

            if (!propertyId) {
                return res
                    .status(400)
                    .json({ message: 'Se requiere el ID de la propiedad.' });
            }

            // 1. Verificar que la propiedad exista
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            // 2. Verificar si ya es favorito (Aunque el modelo también lo valida)
            const alreadyFavorite = await FavoriteModel.checkExists(
                userId,
                propertyId
            );
            if (alreadyFavorite) {
                return res
                    .status(409)
                    .json({ message: 'Esta propiedad ya está en tus favoritos.' });
            }

            // 3. Añadir a favoritos
            const newFavorite = await FavoriteModel.add(userId, propertyId);
            res.status(201).json({
                message: 'Propiedad añadida a favoritos.',
                favorite: newFavorite,
            });
        } catch (error) {
            console.error('Error al añadir favorito:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Elimina una propiedad de favoritos.
     */
    static async removeFavorite(req: Request, res: Response) {
        try {
            const { propertyId } = req.params; // Se toma de la URL
            const userId = (req.user as UserPayload).id;

            const deletedFavorite = await FavoriteModel.remove(userId, propertyId);

            if (!deletedFavorite) {
                return res
                    .status(404)
                    .json({ message: 'Favorito no encontrado.' });
            }

            res.status(200).json({ message: 'Propiedad eliminada de favoritos.' });
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Obtiene todas las propiedades favoritas del usuario logueado.
     */
    static async getMyFavorites(req: Request, res: Response) {
        try {
            const userId = (req.user as UserPayload).id;
            const favorites = await FavoriteModel.getByUserId(userId);
            res.status(200).json(favorites);
        } catch (error) {
            console.error('Error al obtener mis favoritos:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}