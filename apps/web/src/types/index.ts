// /src/types/index.ts

// Tipo de Usuario (devuelto por la API al hacer login o /profile)
export type User = {
    id: string;
    fullName: string; // La API devuelve fullName
    email: string;
    role: 'cliente' | 'agente' | 'administrador';
    phone?: string;
    created_at?: string; // Opcional, /profile lo devuelve
};

// Tipo para el estado global de autenticación
export type AuthState = {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
};

// Tipo para las funciones del AuthContext
export type AuthContextType = AuthState & {
    login: (token: string, user: User) => void;
    logout: () => void;
    // (Podríamos añadir 'register' aquí si el contexto lo manejara)
};

// Tipo de Propiedad (basado en la respuesta de la API)
export type Property = {
    id: string;
    agent_id: string; // ID del agente
    title: string;
    description: string;
    address: string;
    city: string;
    country: string;
    price: number; // Corregido a number (la API lo convierte)
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: 'casa' | 'departamento' | 'terreno' | 'local_comercial'| 'habitacion';
    image_urls: string[]; // Lista de nombres de archivo de imagen
    status: 'en_venta' | 'en_alquiler' | 'vendido' | 'alquilado';
    created_at: string;
    updated_at: string;
    buyer_name?: string; // Opcional

    agent_name?: string; // Nombre del agente (puede no venir en todas las llamadas)
    agent_phone?: string | null;
};