// /src/models/AdminModel.ts
import pool from '../config/db.js';
import { LogModel } from './LogModel.js';

// Tipo para la respuesta de las estadísticas
type DashboardStats = {
    totalUsers: number;
    totalProperties: number;
    totalSales: number;
    totalRevenue: number;
};

// Tipo para el rol de usuario
type UserRole = 'cliente' | 'agente' | 'administrador';

export class AdminModel {
    /**
     * Obtiene estadísticas agregadas para el dashboard de admin.
     */
    static async getDashboardStats(): Promise<DashboardStats> {
        try {
            const userQuery = 'SELECT COUNT(*) AS count FROM users';
            const propQuery = 'SELECT COUNT(*) AS count FROM properties';
            const salesQuery =
                "SELECT COUNT(*) AS count, SUM(price) AS revenue FROM properties WHERE status = 'vendido'";

            // Ejecutamos las consultas en paralelo para mayor eficiencia
            const [userRes, propRes, salesRes] = await Promise.all([
                pool.query(userQuery),
                pool.query(propQuery),
                pool.query(salesQuery),
            ]);

            const stats = {
                totalUsers: parseInt(userRes.rows[0].count, 10),
                totalProperties: parseInt(propRes.rows[0].count, 10),
                totalSales: parseInt(salesRes.rows[0].count, 10),
                totalRevenue: parseFloat(salesRes.rows[0].revenue) || 0,
            };

            return stats;
        } catch (error) {
            console.error('Error en el modelo al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas del dashboard.');
        }
    }

    /**
     * Actualiza el rol de un usuario específico.
     */
    static async updateUserRole(userId: string, newRole: UserRole) {
        try {
            const query = `
        UPDATE users 
        SET role = $1, updated_at = NOW() 
        WHERE id = $2 
        RETURNING id, full_name, email, role;
        `;
            const { rows } = await pool.query(query, [newRole, userId]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al actualizar rol:', error);
            throw new Error('Error al actualizar rol de usuario.');
        }
    }

    /**
   * Obtiene TODOS los logs de auditoría de propiedades.
   */
    static async getPropertyLogs() {
        // Reutilizamos el LogModel
        return LogModel.getAll();
    }
}