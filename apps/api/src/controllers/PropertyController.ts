// /src/controllers/PropertyController.ts
import { Request, Response } from 'express';
import { PropertyModel } from '../models/PropertyModel.js';
import { UserModel } from '../models/UserModel.js';
import { LogModel } from '../models/LogModel.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

type UserPayload = {
    id: string;
    role: string;
    email: string;
};

export class PropertyController {
    /**
     * Obtiene todas las propiedades (con filtros).
     * (Público)
     */
    static async getAllProperties(req: Request, res: Response) {
        try {
            const filters = req.query; // ej: ?city=Lima&limit=3
            const properties = await PropertyModel.getAll(filters);
            res.status(200).json(properties);
        } catch (error) {
            console.error('Error al obtener las propiedades:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Obtiene una propiedad por su ID.
     * (Público)
     */
    static async getPropertyById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const property = await PropertyModel.findById(id);

            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            res.status(200).json(property);
        } catch (error) {
            console.error('Error al obtener la propiedad por ID:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Obtiene las propiedades del agente autenticado.
     * (Privado - Agente)
     */
    static async getMyProperties(req: Request, res: Response) {
        try {
            const agentId = (req.user as UserPayload).id;
            const properties = await PropertyModel.findByAgentId(agentId);
            res.status(200).json(properties);
        } catch (error) {
            console.error('Error al obtener mis propiedades:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Crea una nueva propiedad.
     * (PERMISO: Solo Agentes)
     */
    static async createProperty(req: Request, res: Response) {
        try {
            const { id: userId, role: userRole, email: userEmail } =
                req.user as UserPayload;

            // Restricción: los administradores no pueden crear propiedades
            if (userRole === 'administrador') {
                return res
                    .status(403)
                    .json({
                        message:
                            'Acción prohibida. Los administradores no pueden crear propiedades.',
                    });
            }

            // Validación de imágenes
            if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                return res.status(400).json({ message: 'Se requiere al menos una imagen.' });
            }

            const imageUrls = (req.files as Express.Multer.File[]).map(
                (file) => file.filename
            );

            const newPropertyData = {
                agent_id: userId,
                ...req.body,
                price: Number(req.body.price),
                bedrooms: Number(req.body.bedrooms),
                bathrooms: Number(req.body.bathrooms),
                area: Number(req.body.area),
                image_urls: imageUrls,
                status: 'en_venta',
            };

            const newProperty = await PropertyModel.create(newPropertyData);

            // --- REGISTRO DE AUDITORÍA ---
            await LogModel.create({
                property_id: newProperty.id,
                property_title: newProperty.title,
                user_id: userId,
                user_email: userEmail,
                action_type: 'create',
                details: 'Propiedad creada exitosamente.',
            });
            // --- FIN DE AUDITORÍA ---

            res.status(201).json({
                message: 'Propiedad creada exitosamente.',
                property: newProperty,
            });
        } catch (error) {
            console.error('Error al crear la propiedad:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Actualiza una propiedad.
     * (PERMISO: Agente propietario o Administrador)
     */
    static async updateProperty(req: Request, res: Response) {
        try {
            const { id: propertyId } = req.params;
            const { id: userId, role: userRole, email: userEmail } =
                req.user as UserPayload;

            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            if (property.agent_id !== userId && userRole !== 'administrador') {
                return res.status(403).json({ message: 'No tienes permiso.' });
            }

            // --- Manejo de imágenes ---
            const imagesToDelete: string[] = req.body.imagesToDelete
                ? JSON.parse(req.body.imagesToDelete)
                : [];

            imagesToDelete.forEach((filename: string) => {
                const filePath = path.join('uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            const newImageUrls = (req.files as Express.Multer.File[])
                ? (req.files as Express.Multer.File[]).map((file) => file.filename)
                : [];

            const currentImageUrls = property.image_urls.filter(
                (url: string) => !imagesToDelete.includes(url)
            );

            const fieldsToUpdate = {
                ...req.body,
                image_urls: [...currentImageUrls, ...newImageUrls],
            };

            delete fieldsToUpdate.imagesToDelete;

            if (fieldsToUpdate.price)
                fieldsToUpdate.price = Number(fieldsToUpdate.price);
            if (fieldsToUpdate.bedrooms)
                fieldsToUpdate.bedrooms = Number(fieldsToUpdate.bedrooms);
            if (fieldsToUpdate.bathrooms)
                fieldsToUpdate.bathrooms = Number(fieldsToUpdate.bathrooms);
            if (fieldsToUpdate.area)
                fieldsToUpdate.area = Number(fieldsToUpdate.area);

            const updatedProperty = await PropertyModel.update(propertyId, fieldsToUpdate);

            // --- REGISTRO DE AUDITORÍA ---
            await LogModel.create({
                property_id: propertyId,
                property_title: updatedProperty.title,
                user_id: userId,
                user_email: userEmail,
                action_type: 'edit',
                details: `Propiedad actualizada por ${userEmail} (${userRole}).`,
            });
            // --- FIN DE AUDITORÍA ---

            res.status(200).json({
                message: 'Propiedad actualizada exitosamente.',
                property: updatedProperty,
            });
        } catch (error) {
            console.error('Error al actualizar la propiedad:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Elimina una propiedad.
     * (PERMISO: Agente propietario o Administrador)
     */
    static async deleteProperty(req: Request, res: Response) {
        try {
            const { id: propertyId } = req.params;
            const { id: userId, role: userRole, email: userEmail } =
                req.user as UserPayload;

            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            if (property.agent_id !== userId && userRole !== 'administrador') {
                return res.status(403).json({ message: 'No tienes permiso.' });
            }

            // --- REGISTRO DE AUDITORÍA ---
            await LogModel.create({
                property_id: propertyId,
                property_title: property.title,
                user_id: userId,
                user_email: userEmail,
                action_type: 'delete',
                details: `Propiedad eliminada por ${userEmail} (${userRole}).`,
            });

            // Eliminar imágenes asociadas
            if (property.image_urls.length > 0) {
                property.image_urls.forEach((filename: string) => {
                    const filePath = path.join('uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            await PropertyModel.delete(propertyId);
            res.status(200).json({ message: 'Propiedad eliminada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Marca una propiedad como vendida.
     * (PERMISO: Solo Agente propietario)
     */
    static async sellProperty(req: Request, res: Response) {
        try {
            const { id: propertyId } = req.params;
            const { id: userId, email: userEmail } = req.user as UserPayload;
            const { buyerName, password } = req.body;

            if (!buyerName || !password) {
                return res
                    .status(400)
                    .json({ message: 'El nombre del comprador y tu contraseña son requeridos.' });
            }

            const agent = await UserModel.findWithPasswordById(userId);
            if (!agent) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, agent.password_hash);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Contraseña incorrecta.' });
            }

            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            if (property.agent_id !== userId) {
                return res.status(403).json({ message: 'No tienes permiso.' });
            }

            const soldProperty = await PropertyModel.markAsSold(propertyId, buyerName);

            // --- REGISTRO DE AUDITORÍA ---
            await LogModel.create({
                property_id: propertyId,
                property_title: soldProperty.title,
                user_id: userId,
                user_email: userEmail,
                action_type: 'sold',
                details: `Vendido a ${buyerName}.`,
            });
            // --- FIN DE AUDITORÍA ---

            res.status(200).json({
                message: 'Propiedad marcada como vendida.',
                property: soldProperty,
            });
        } catch (error) {
            console.error('Error al vender la propiedad:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}
