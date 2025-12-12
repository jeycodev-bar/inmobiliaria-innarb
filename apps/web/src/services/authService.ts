// /src/services/authService.ts
import { User } from '../types'; // Importamos nuestro tipo

// ¡Importante! Usamos rutas relativas. Vite las redirigirá.
const API_URL = '/api/users';

/**
 * Registra un nuevo usuario.
 * (Tipamos 'credentials' como 'any' por simplicidad,
 * pero idealmente creamos un tipo 'RegisterData')
 */
export const registerUser = async (credentials: any) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar.');
    }
    return response.json();
};

/**
 * Inicia sesión de un usuario.
 */
export const loginUser = async (credentials: any) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas.');
    }

    // La API devuelve { message, token, user }
    const data: { message: string; token: string; user: User } = await response.json();
    return data;
};

/**
 * Obtiene el perfil del usuario usando un token.
 */
export const getUserProfile = async (token: string) => {
    const response = await fetch(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el perfil.');
    }

    const user: User = await response.json();
    return user;
};

/**
 * Helper para obtener el encabezado de autorización.
 */
const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

/**
 * Actualiza el perfil del usuario (nombre y teléfono).
 */
export const updateProfile = async (data: { fullName: string; phone: string }) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil.');
    }

    // La API devuelve { message, user }
    const result: { message: string; user: User } = await response.json();
    return result.user; // Devolvemos el usuario actualizado
};
