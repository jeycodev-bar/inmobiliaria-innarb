// /src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState, User } from '../types';
import { getUserProfile } from '../services/authService.js'; // .js

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// 1. Estado inicial
const initialState: AuthState = {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: true, // Empezamos cargando
};

// 2. Crear el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>(initialState);

    // --- OBTENER navigate ---
    const navigate = useNavigate(); // Hook para la redirección

    // 4. Efecto para cargar la sesión desde localStorage al iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            // Si hay token, validamos con la API
            getUserProfile(storedToken)
                .then((user) => {
                    setAuth({
                        user: user,
                        token: storedToken,
                        isLoggedIn: true,
                        isLoading: false,
                    });
                })
                .catch(() => {
                    // Si el token es inválido (ej. expiró)
                    localStorage.removeItem('authToken');
                    setAuth({ ...initialState, isLoading: false });
                });
        } else {
            // No hay token, terminamos de cargar
            setAuth({ ...initialState, isLoading: false });
        }
    }, []);

    // 5. Función de Login
    const login = (token: string, user: User) => {
        localStorage.setItem('authToken', token);
        setAuth({
            user: user,
            token: token,
            isLoggedIn: true,
            isLoading: false,
        });

        // AÑADIR NOTIFICACIÓN DE BIENVENIDA ---
        // Obtenemos solo el primer nombre
        const firstName = user.fullName.split(' ')[0];
        toast.success(`¡Bienvenido de nuevo, ${firstName}!`);
        // --- FIN DE LA MODIFICACIÓN ---
    };

    // 6. Función de Logout
    const logout = () => {
        // 1. Limpiar almacenamiento
        localStorage.removeItem('authToken');
        // 2. Resetear estado
        setAuth({ ...initialState, isLoading: false });
        // 3. Mostrar mensaje de éxito
        toast.success('¡Sesión cerrada con éxito! Hasta pronto.');
        // 4. Redirigir a la página de inicio
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {/* No renderizamos la app hasta saber si estamos logueados o no */}
            {!auth.isLoading && children}
        </AuthContext.Provider>
    );
};

// 7. Hook personalizado para consumir el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};