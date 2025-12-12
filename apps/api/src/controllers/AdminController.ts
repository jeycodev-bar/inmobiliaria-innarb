// /src/controllers/AdminController.ts
import { Request, Response } from 'express';
import { AdminModel } from '../models/AdminModel.js'; // .js

export class AdminController {
    /**
     * Obtiene las estadísticas del Dashboard.
     */
    static async getDashboardStats(req: Request, res: Response) {
        try {
            const stats = await AdminModel.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            console.error('Error en controlador (getDashboardStats):', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Gestiona (actualiza) el rol de un usuario.
     */
    static async manageUserRole(req: Request, res: Response) {
        try {
            const { userId, role } = req.body;

            // Validaciones
            if (!userId || !role) {
                return res
                    .status(400)
                    .json({ message: 'Se requieren el ID de usuario y el nuevo rol.' });
            }

            const validRoles = ['cliente', 'agente', 'administrador'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    message: 'Rol no válido. Debe ser: cliente, agente o administrador.',
                });
            }

            const updatedUser = await AdminModel.updateUserRole(userId, role);
            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // --- ¡CORRECCIÓN! ---
            // Mapeamos la respuesta
            res.status(200).json({
                message: 'Rol de usuario actualizado exitosamente.',
                user: {
                    id: updatedUser.id,
                    fullName: updatedUser.full_name, // <-- Mapeo
                    email: updatedUser.email,
                    role: updatedUser.role,
                },
            });
        } catch (error) {
            console.error('Error en controlador (manageUserRole):', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    // Nota: La obtención de todos los usuarios (getAllUsers)
    // ya la implementamos en `UserController` y la aseguramos
    // en `userRoutes` con el middleware `adminOnly`.

    /**
     * Obtiene el historial de auditoría de propiedades.
     */
    static async getPropertyLogs(req: Request, res: Response) {
        try {
            const logs = await AdminModel.getPropertyLogs();
            res.status(200).json(logs);
        } catch (error) {
            console.error('Error en controlador (getPropertyLogs):', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}
