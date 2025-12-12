// /src/services/propertyService.ts
import { Property } from '../types';

// Usamos rutas relativas (proxy de Vite)
const API_URL = '/api/properties';

// --- LA CORRECCIÓN ---
/**
 * Función helper para obtener el token del localStorage.
 * Devuelve un objeto de cabecera compatible con fetch (HeadersInit).
 */
const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {}; // 1. Creamos un objeto vacío tipado

    if (token) {
        // 2. Si hay token, añadimos la cabecera
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. Siempre devolvemos un Record<string, string> (vacío o con el token)
    return headers;
};
// --- FIN DE LA CORRECCIÓN ---

/**
 * Obtiene todas las propiedades (con filtros opcionales).
 * @param filters Objeto de filtros (ej. { city: 'Lima', maxPrice: '500000' })
 */
export const getProperties = async (
    filters: Record<string, string> = {}
): Promise<Property[]> => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}?${query}`);

    if (!response.ok) {
        throw new Error('Error al cargar las propiedades.');
    }
    return response.json();
};

/**
 * Obtiene una propiedad por su ID.
 */
export const getPropertyById = async (id: string): Promise<Property> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Propiedad no encontrada.');
    }
    return response.json();
};

/**
 * Crea una nueva propiedad.
 * @param formData FormData que contiene los datos y las imágenes.
 */
export const createProperty = async (formData: FormData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeader(), // Ahora 'headers' es un Record<string, string> válido
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la propiedad.');
    }
    return response.json();
};

/**
 * Actualiza una propiedad existente.
 * @param id ID de la propiedad a actualizar.
 * @param formData FormData con los campos a actualizar (incluye 'imagesToDelete').
 */
export const updateProperty = async (id: string, formData: FormData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(), // Ahora 'headers' es un Record<string, string> válido
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la propiedad.');
    }
    return response.json();
};

/**
 * Elimina una propiedad.
 */
export const deleteProperty = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(), // Ahora 'headers' es un Record<string, string> válido
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la propiedad.');
    }
    return response.json();
};

/**
 * Obtiene las propiedades del agente autenticado.
 */
export const getMyProperties = async (): Promise<Property[]> => {
    const response = await fetch(`${API_URL}/my-properties`, {
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        throw new Error('Error al cargar mis propiedades.');
    }
    return response.json();
};

/**
 * Marca una propiedad como vendida (solo para agentes).
 * Requiere el nombre del comprador y la contraseña del agente.
 */
export const sellProperty = async (
    propertyId: string,
    buyerName: string,
    password: string
) => {
    const response = await fetch(`${API_URL}/${propertyId}/sell`, {
        method: 'POST',
        headers: {
            ...getAuthHeader(), // Requiere token
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buyerName, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la venta.');
    }
    return response.json(); // Devuelve { message, property }
};