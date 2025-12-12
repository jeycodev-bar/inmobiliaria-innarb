// /src/models/UserModel.ts
import pool from '../config/db.js'; // Importamos el pool de ESM

// (Opcional pero recomendado) Definimos un tipo para el usuario
// Basado en el controlador original
type User = {
    id: string;
    full_name: string;
    email: string;
    role: 'cliente' | 'agente' | 'administrador';
    phone?: string;
    created_at: string;
    password_hash: string;
};

export class UserModel {
    /**
     * Busca un usuario por su email.
     * Devuelve todos los campos, incluido el hash de la contraseña.
     */
    static async findByEmail(email: string): Promise<User | undefined> {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const { rows } = await pool.query(query, [email]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al buscar usuario por email:', error);
            throw new Error('Error al buscar usuario por email.');
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     */
    static async create(userData: {
        fullName: string;
        email: string;
        passwordHash: string;
        phone?: string;
    }) {
        const { fullName, email, passwordHash, phone } = userData;
        try {
            const query = `
                INSERT INTO users (full_name, email, password_hash, phone) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, full_name, email, role, created_at, phone;
            `;
            const values = [fullName, email, passwordHash, phone];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al crear el usuario:', error);
            throw new Error('Error al crear el usuario.');
        }
    }

    /**
     * Busca un usuario por su ID.
     * NO devuelve la contraseña.
     */
    static async findById(id: string) {
        try {
            const query = `
                SELECT id, full_name, email, role, phone, created_at 
                FROM users 
                WHERE id = $1
            `;
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al buscar usuario por ID:', error);
            throw new Error('Error al buscar usuario por ID.');
        }
    }

    /**
     * Obtiene todos los usuarios.
     * NO devuelve contraseñas.
     */
    static async getAll() {
        try {
            const query = `
                SELECT id, full_name, email, role, phone, created_at 
                FROM users 
                ORDER BY created_at DESC
            `;
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error en el modelo al obtener todos los usuarios:', error);
            throw new Error('Error al obtener todos los usuarios.');
        }
    }

    /**
     * Busca un usuario por su ID e incluye el password_hash.
     * Usado internamente para validaciones de contraseña.
     */
    static async findWithPasswordById(id: string): Promise<User | undefined> {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al buscar usuario con contraseña por ID:', error);
            throw new Error('Error al buscar usuario por ID.');
        }
    }

    /**
   * Actualiza el perfil de un usuario (Nombre y Teléfono).
   * La contraseña y el rol se manejan por separado.
   */
    static async update(userId: string, data: { fullName?: string; phone?: string }) {
        const { fullName, phone } = data;

        // Construcción de consulta dinámica
        const fields: string[] = [];
        const values: (string | undefined)[] = [];
        let paramIndex = 1;

        // Mapeamos de camelCase (JS) a snake_case (BBDD)
        if (fullName !== undefined) {
            fields.push(`full_name = $${paramIndex++}`);
            values.push(fullName);
        }
        if (phone !== undefined) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(phone);
        }

        if (fields.length === 0) {
            return this.findById(userId); // Devuelve el usuario actual si no hay nada
        }

        values.push(userId); // El ID del usuario para el WHERE
        const query = `
        UPDATE users 
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING id, full_name, email, role, phone, created_at;
        `;

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error en el modelo al actualizar usuario:', error);
            throw new Error('Error al actualizar el perfil de usuario.');
        }
    }
}
