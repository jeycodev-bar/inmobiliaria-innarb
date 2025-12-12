// /src/models/PropertyModel.ts
import pool from '../config/db.js';

// --- Definimos los tipos de datos ---

// Datos para crear una propiedad
type PropertyData = {
    agent_id: string;
    title: string;
    description?: string;
    address: string;
    city: string;
    country: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area?: number;
    type: 'casa' | 'departamento' | 'terreno' | 'local_comercial';
    image_urls: string[];
    status: 'en_venta' | 'en_alquiler' | 'vendido' | 'alquilado';
};

// La propiedad como existe en la BBDD (devuelta por la BBDD)
type Property = {
    id: string;
    agent_id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    country: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: 'casa' | 'departamento' | 'terreno' | 'local_comercial';
    image_urls: string[];
    status: 'en_venta' | 'en_alquiler' | 'vendido' | 'alquilado';
    created_at: string;
    updated_at: string;
    buyer_name?: string;
};

// Filtros para la búsqueda
type PropertyFilters = {
    type?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    limit?: string;
};

// --- NUEVO TIPO: Propiedad con datos del Agente ---
type PropertyWithAgent = Property & {
    agent_name: string;
    agent_phone: string | null; // El teléfono puede ser null
};

// --- Clase del Modelo ---

export class PropertyModel {
    /**
     * Crea una nueva propiedad en la base de datos.
     */
    static async create(propertyData: PropertyData): Promise<Property> {
        const {
            agent_id,
            title,
            description,
            address,
            city,
            country,
            price,
            bedrooms,
            bathrooms,
            area,
            type,
            image_urls,
            status,
        } = propertyData;

        try {
            const query = `
        INSERT INTO properties 
            (agent_id, title, description, address, city, country, price, bedrooms, bathrooms, area, type, image_urls, status)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *;
        `;
            const values = [
                agent_id,
                title,
                description,
                address,
                city,
                country,
                price,
                bedrooms,
                bathrooms,
                area,
                type,
                image_urls,
                status,
            ];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al crear la propiedad:', error);
            throw new Error('Error en el modelo al crear la propiedad.');
        }
    }

    /**
     * Obtiene todas las propiedades, opcionalmente filtradas.
     */
    static async getAll(filters: PropertyFilters = {}): Promise<Property[]> {
        let query =
            "SELECT * FROM properties WHERE status IN ('en_venta', 'en_alquiler')";
        const values: (string | number)[] = [];
        let paramIndex = 1;

        if (filters.type) {
            query += ` AND type = $${paramIndex++}`;
            values.push(filters.type);
        }
        if (filters.city) {
            query += ` AND city ILIKE $${paramIndex++}`;
            values.push(`%${filters.city}%`);
        }
        if (filters.minPrice) {
            query += ` AND price >= $${paramIndex++}`;
            values.push(Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            query += ` AND price <= $${paramIndex++}`;
            values.push(Number(filters.maxPrice));
        }
        if (filters.bedrooms) {
            query += ` AND bedrooms >= $${paramIndex++}`;
            values.push(Number(filters.bedrooms));
        }

        query += ' ORDER BY created_at DESC'; // Siempre ordenamos por más nuevo

        // --- ¡LA MEJORA DE EFICIENCIA! ---
        if (filters.limit) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(Number(filters.limit));
        }
        // --- FIN DE LA MEJORA ---

        try {
            const { rows } = await pool.query(query, values);
            return rows;
        } catch (error) {
            console.error('Error en el modelo al obtener propiedades:', error);
            throw new Error('Error en el modelo al obtener las propiedades.');
        }
    }

    /**
     * Busca una propiedad por su ID, INCLUYENDO nombre y teléfono del agente.
     */
    static async findById(id: string): Promise<PropertyWithAgent | undefined> { // <-- Cambiado tipo de retorno
        try {
            // --- CONSULTA CON JOIN ---
            const query = `
                SELECT 
                    p.*, 
                    u.full_name as agent_name, 
                    u.phone as agent_phone 
                FROM properties p
                JOIN users u ON p.agent_id = u.id
                WHERE p.id = $1 
                    AND p.status IN ('en_venta', 'en_alquiler', 'vendido', 'alquilado'); -- Aseguramos que solo traiga propiedades válidas
            `;
            const { rows } = await pool.query(query, [id]);
            return rows[0]; // Devuelve la propiedad con agent_name y agent_phone
        } catch (error) {
            console.error('Error en el modelo al buscar propiedad por ID (con JOIN):', error);
            // El error 'invalid input syntax for type uuid' puede ocurrir aquí si el ID no es UUID
            if ((error as any).code === '22P02') { // Código de error de PostgreSQL para sintaxis inválida
                console.error(`Intento de buscar propiedad con ID inválido: ${id}`);
                return undefined; // Devolver undefined si el ID no es válido en lugar de lanzar error
            }
            throw new Error('Error en el modelo al buscar la propiedad.');
        }
    }

    /**
     * Obtiene todas las propiedades de un agente específico.
     */
    static async findByAgentId(agentId: string): Promise<Property[]> {
        try {
            const query = 'SELECT * FROM properties WHERE agent_id = $1 ORDER BY created_at DESC';
            const { rows } = await pool.query(query, [agentId]);
            return rows;
        } catch (error) {
            console.error('Error en el modelo al buscar por ID de agente:', error);
            throw new Error('Error en el modelo al buscar propiedades por agente.');
        }
    }

    /**
     * Actualiza una propiedad en la base de datos.
     */
    static async update(
        id: string,
        fieldsToUpdate: Partial<PropertyData>
    ): Promise<Property> {
        const setClause: string[] = [];
        const values: (string | number | string[])[] = [];
        let paramIndex = 1;

        // Construye la cláusula SET dinámicamente
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (value !== undefined) {
                // Las claves (ej. 'agent_id') ya coinciden con la BBDD
                setClause.push(`${key} = $${paramIndex++}`);
                values.push(value);
            }
        }

        // Añadimos el ID de la propiedad al final de los valores para el WHERE
        values.push(id);

        // Si no hay campos para actualizar, busca y devuelve el objeto actual
        if (setClause.length === 0) {
            const existing = await this.findById(id);
            if (!existing) throw new Error('Propiedad no encontrada.');
            return existing;
        }

        const query = `
        UPDATE properties 
        SET ${setClause.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING *;
        `;

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al actualizar la propiedad:', error);
            throw new Error('Error en el modelo al actualizar la propiedad.');
        }
    }

    /**
     * Elimina una propiedad de la base de datos.
     */
    static async delete(id: string): Promise<Property> {
        try {
            const query = 'DELETE FROM properties WHERE id = $1 RETURNING *';
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al eliminar la propiedad:', error);
            throw new Error('Error en el modelo al eliminar la propiedad.');
        }
    }

    /**
     * Marca una propiedad como vendida.
     */
    static async markAsSold(id: string, buyerName: string): Promise<Property> {
        try {
            const query = `
            UPDATE properties 
            SET status = 'vendido', buyer_name = $1, updated_at = NOW() 
            WHERE id = $2
            RETURNING *;
            `;
            const { rows } = await pool.query(query, [buyerName, id]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al marcar como vendida:', error);
            throw new Error('Error en el modelo al marcar la propiedad como vendida.');
        }
    }
}