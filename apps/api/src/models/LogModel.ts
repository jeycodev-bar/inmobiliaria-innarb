// /src/models/LogModel.ts
import pool from '../config/db.js';

type LogAction = 'create' | 'edit' | 'delete' | 'sold';

type LogData = {
    property_id: string;
    property_title: string;
    user_id: string;
    user_email: string;
    action_type: LogAction;
    details?: string;
};

export class LogModel {
    /**
     * Crea un nuevo registro de auditoría.
     */
    static async create(logData: LogData) {
        const {
            property_id,
            property_title,
            user_id,
            user_email,
            action_type,
            details,
        } = logData;

        try {
            const query = `
        INSERT INTO property_logs 
          (property_id, property_title, user_id, user_email, action_type, details)
        VALUES 
          ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;
            const values = [
                property_id,
                property_title,
                user_id,
                user_email,
                action_type,
                details,
            ];
            await pool.query(query, values);
        } catch (error) {
            console.error('Error en LogModel al crear el registro:', error);
            // No lanzamos un error, el log no debe detener la acción principal.
        }
    }

    /**
     * Obtiene todos los registros de auditoría (para el admin).
     * Ordenados por el más reciente primero.
     */
    static async getAll() {
        try {
            const query = 'SELECT * FROM property_logs ORDER BY created_at DESC';
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error en LogModel al obtener todos los logs:', error);
            throw new Error('Error al obtener el historial de auditoría.');
        }
    }
}