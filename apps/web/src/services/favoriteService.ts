// /src/services/favoriteService.ts
import { Property } from '../types';

const API_URL = '/api/favorites';

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
 * Obtiene todas las propiedades favoritas del usuario logueado.
 */
export const getMyFavorites = async (): Promise<Property[]> => {
    const response = await fetch(API_URL, {
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        throw new Error('Error al cargar los favoritos.');
    }
    return response.json();
};

/**
 * Añade una propiedad a favoritos.
 */
export const addFavorite = async (propertyId: string) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al añadir a favoritos.');
    }
    return response.json();
};

/**
 * Elimina una propiedad de favoritos.
 */
export const removeFavorite = async (propertyId: string) => {
    const response = await fetch(`${API_URL}/${propertyId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar favorito.');
    }
    return response.json();
};