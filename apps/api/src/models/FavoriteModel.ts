// /src/models/FavoriteModel.ts
import pool from '../config/db.js';

// No necesitamos un tipo 'Favorite' complejo, 
// ya que la tabla solo almacena IDs.
// Sin embargo, necesitamos el tipo 'Property' para la función getByUserId.
// (Asumimos que el tipo Property se define en PropertyModel.ts, 
// pero no necesitamos importarlo aquí, solo el resultado de la consulta)

export class FavoriteModel {
    /**
     * Añade una propiedad a los favoritos de un usuario.
     */
    static async add(userId: string, propertyId: string) {
        try {
            const query = `
        INSERT INTO favorites (user_id, property_id) 
        VALUES ($1, $2) 
        RETURNING *;
      `;
            const { rows } = await pool.query(query, [userId, propertyId]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al añadir favorito:', error);
            // Manejar error de duplicado (llave única)
            if ((error as any).code === '23505') {
                throw new Error('Esta propiedad ya está en tus favoritos.');
            }
            throw new Error('Error en el modelo al añadir favorito.');
        }
    }

    /**
     * Elimina una propiedad de los favoritos de un usuario.
     */
    static async remove(userId: string, propertyId: string) {
        try {
            const query = `
        DELETE FROM favorites 
        WHERE user_id = $1 AND property_id = $2 
        RETURNING *;
      `;
            const { rows } = await pool.query(query, [userId, propertyId]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al eliminar favorito:', error);
            throw new Error('Error en el modelo al eliminar favorito.');
        }
    }

    /**
     * Obtiene todas las propiedades favoritas de un usuario.
     * Devuelve la información completa de las propiedades.
     */
    static async getByUserId(userId: string) {
        try {
            const query = `
        SELECT p.* FROM properties p
        JOIN favorites f ON p.id = f.property_id
        WHERE f.user_id = $1;
      `;
            const { rows } = await pool.query(query, [userId]);
            return rows;
        } catch (error) {
            console.error('Error en el modelo al obtener favoritos:', error);
            throw new Error('Error en el modelo al obtener favoritos.');
        }
    }

    /**
     * Verifica si una propiedad ya está en favoritos.
     */
    static async checkExists(
        userId: string,
        propertyId: string
    ): Promise<boolean> {
        try {
            const query = 'SELECT 1 FROM favorites WHERE user_id = $1 AND property_id = $2';
            const { rows } = await pool.query(query, [userId, propertyId]);
            return rows.length > 0;
        } catch (error) {
            console.error('Error en el modelo al verificar favorito:', error);
            throw new Error('Error en el modelo al verificar favorito.');
        }
    }
}