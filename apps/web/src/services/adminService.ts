// /src/services/adminService.ts
import { User } from '../types';

const API_URL = '/api'; // URL base

// Helper para la autenticación
const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Obtiene las estadísticas del dashboard (Admin)
 */
export const getDashboardStats = async () => {
    const response = await fetch(`${API_URL}/admin/stats`, {
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        throw new Error('Error al cargar las estadísticas.');
    }
    return response.json();
};

/**
 * Obtiene la lista de todos los usuarios (Admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, { // (Endpoint de /api/users)
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        throw new Error('Error al cargar los usuarios.');
    }
    return response.json();
};

/**
 * Actualiza el rol de un usuario (Admin)
 */
export const updateUserRole = async (userId: string, role: string) => {
    const response = await fetch(`${API_URL}/admin/users/role`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el rol.');
    }
    return response.json();
};

/**
 * Obtiene el historial de auditoría de propiedades (Admin)
 */
export const getPropertyLogs = async () => {
    const response = await fetch(`${API_URL}/admin/logs`, { // Endpoint que creamos
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        throw new Error('Error al cargar el historial de auditoría.');
    }
    return response.json();
};