// // /src/pages/PropertiesPage.tsx
// import React, { useState, useEffect } from 'react';
// import { getProperties } from '../services/propertyService';
// import PropertyCard from '../components/PropertyCard';
// import { Property } from '../types';
// import { FaSearch } from 'react-icons/fa';

// const PropertiesPage = () => {
//     const [properties, setProperties] = useState<Property[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Estado para los filtros
//     const [filters, setFilters] = useState({
//         city: '',
//         type: '',
//         minPrice: '',
//         maxPrice: '',
//         bedrooms: '',
//     });

//     // Carga inicial
//     useEffect(() => {
//         fetchProperties();
//     }, []);

//     const fetchProperties = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             // Prepara filtros (elimina los vacíos)
//             const activeFilters: Record<string, string> = {};
//             for (const [key, value] of Object.entries(filters)) {
//                 if (value) activeFilters[key] = value;
//             }

//             const data = await getProperties(activeFilters);
//             setProperties(data);
//         } catch (err: any) {
//             setError(err.message || 'No se pudieron cargar las propiedades.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => {
//         setFilters({
//             ...filters,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         fetchProperties();
//     };

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             {/* --- Filtros --- */}
//             <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow">
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-5">
//                     <input
//                         type="text" name="city" placeholder="Ciudad (ej. Lima)"
//                         value={filters.city} onChange={handleChange}
//                         className="rounded border px-3 py-2"
//                     />
//                     <select
//                         name="type" value={filters.type} onChange={handleChange}
//                         className="rounded border px-3 py-2"
//                     >
//                         <option value="">Tipo de Propiedad</option>
//                         <option value="casa">Casa</option>
//                         <option value="departamento">Departamento</option>
//                         <option value="terreno">Terreno</option>
//                         <option value="local_comercial">Local Comercial</option>
//                         <option value="habitación">Habitación</option>
//                     </select>
//                     <input
//                         type="number" name="minPrice" placeholder="Precio Mín."
//                         value={filters.minPrice} onChange={handleChange}
//                         className="rounded border px-3 py-2"
//                     />
//                     <input
//                         type="number" name="maxPrice" placeholder="Precio Máx."
//                         value={filters.maxPrice} onChange={handleChange}
//                         className="rounded border px-3 py-2"
//                     />
//                     <button
//                         type="submit"
//                         className="flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 md:col-span-1"
//                     >
//                         <FaSearch className="mr-2" /> Buscar
//                     </button>
//                 </form>
//             </div>

//             {/* --- Resultados --- */}
//             {loading && <p className="text-center">Cargando propiedades...</p>}
//             {error && <p className="text-center text-red-600">{error}</p>}

//             {!loading && !error && (
//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     {properties.length > 0 ? (
//                         properties.map((prop) => (
//                             <PropertyCard key={prop.id} property={prop} />
//                         ))
//                     ) : (
//                         <p className="col-span-full text-center text-gray-700">
//                             No se encontraron propiedades con esos criterios.
//                         </p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PropertiesPage;




// /src/pages/PropertiesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { getProperties } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
// --- 1. Imports para Favoritos ---
import { useAuth } from '../context/AuthContext';
import { getMyFavorites, addFavorite, removeFavorite } from '../services/favoriteService';

const PropertiesPage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        city: '',
        type: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
    });

    // Estado para controlar la visibilidad de la barra de filtros
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- 2. Estados para Favoritos ---
    const { isLoggedIn, user } = useAuth(); // Obtenemos el usuario
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set()); // Usamos un Set para eficiencia
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false); // Para deshabilitar clics rápidos

    const location = useLocation();
    const fetchHasRun = useRef(false);

    // Función para cargar propiedades
    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const activeFilters: Record<string, string> = {};
            for (const [key, value] of Object.entries(filters)) {
                if (value) activeFilters[key] = value;
            }
            const data = await getProperties(activeFilters);
            setProperties(data);
        } catch (err: any) {
            setError(err.message || 'No se pudieron cargar las propiedades.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchHasRun.current === false) {
            // Abre filtros si hay URL params
            if (location.search) setIsFilterOpen(true);

            // Carga las propiedades
            fetchProperties();

            // --- 3. Cargar Favoritos (SOLO si es cliente) ---
            if (isLoggedIn && user?.role === 'cliente') {
                getMyFavorites()
                    .then(favs => {
                        // Guardamos solo los IDs en un Set para búsquedas rápidas (O(1))
                        setFavoriteIds(new Set(favs.map(f => f.id)));
                    })
                    .catch(() => {
                        console.error("No se pudieron cargar los favoritos en PropertiesPage.");
                        // No mostramos toast de error aquí para no ser intrusivos
                    });
            }

            fetchHasRun.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, user]); // Depende del estado de login

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProperties();
    };

    // --- 4. Nueva Función para (Des)Marcar Favorito ---
    const handleToggleFavorite = async (propertyId: string) => {
        if (isTogglingFavorite) return; // Evitar doble clic
        if (!isLoggedIn || user?.role !== 'cliente') {
            toast.info('Debes iniciar sesión como cliente para guardar favoritos.');
            return;
        }

        setIsTogglingFavorite(true);

        // Copia actual del estado para rollback en caso de error
        const originalFavIds = new Set(favoriteIds);
        const isCurrentlyFavorite = favoriteIds.has(propertyId);

        // Actualización Optimista (actualiza la UI primero)
        setFavoriteIds(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyFavorite) {
                newSet.delete(propertyId);
            } else {
                newSet.add(propertyId);
            }
            return newSet;
        });

        // Llamada a la API
        try {
            if (isCurrentlyFavorite) {
                await removeFavorite(propertyId);
                toast.info('Eliminado de favoritos');
            } else {
                await addFavorite(propertyId);
                toast.success('Guardado en favoritos');
            }
        } catch (err) {
            // ¡Rollback! Si la API falla, revierte la UI
            setFavoriteIds(originalFavIds);
            toast.error('Error al actualizar favoritos. Intenta de nuevo.');
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    // Define si se debe mostrar el botón
    const canShowFavorite = isLoggedIn && user?.role === 'cliente';

    return (
        <div className="container bg-radial-greenight mx-auto p-4 md:p-8 relative min-h-[200px]">

            {/* --- SECCIÓN DE FILTROS --- */}
            <div className="mb-8">
                {!isFilterOpen ? (
                    // 1. Botón para MOSTRAR filtros
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-blue-600 shadow-lg transition-transform transition-colors duration-300 transform hover:scale-110 active:scale-90 ease-in-out hover:bg-gray-200 hover:shadow-lg hover:text-cyan-500"
                            aria-label="Abrir filtros de búsqueda"
                        >
                            <FaSearch className="h-6 w-6" />
                        </button>
                    </div>
                ) : (
                    // 2. Panel de filtros (cuando está ABIERTO)
                    <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
                        {/* Botón para CERRAR filtros */}
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-rose-200 text-gray-600 shadow-md transition duration-300 hover:scale-110 active:scale-90 ease-in-out hover:bg-gray-100 hover:text-red-500"
                            aria-label="Cerrar filtros de búsqueda"
                        >
                            <FaTimes className="h-6 w-6" />
                        </button>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <input
                                type="text" name="city" placeholder="Ciudad (ej. Lima)"
                                value={filters.city} onChange={handleChange}
                                className="rounded border px-3 py-2 shadow-sm focus:border-blue-500"
                            />
                            <select
                                name="type" value={filters.type} onChange={handleChange}
                                className="rounded border px-3 py-2 shadow-sm focus:border-blue-500"
                            >
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="departamento">Departamento</option>
                                <option value="terreno">Terreno</option>
                                <option value="local_comercial">Local Comercial</option>
                                <option value="habitación">Habitación</option>
                            </select>
                            <input
                                type="number" name="minPrice" placeholder="Precio Mín."
                                value={filters.minPrice} onChange={handleChange}
                                className="rounded border px-3 py-2 shadow-sm focus:border-blue-500"
                            />
                            <input
                                type="number" name="maxPrice" placeholder="Precio Máx."
                                value={filters.maxPrice} onChange={handleChange}
                                className="rounded border px-3 py-2 shadow-sm focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700 md:col-span-1"
                            >
                                <FaSearch className="mr-2" /> Buscar
                            </button>
                        </form>
                    </div>
                )}
            </div>
            {/* --- FIN DE SECCIÓN DE FILTROS --- */}


            {/* --- Resultados --- */}
            {loading && <p className="text-center text-lg">Cargando propiedades...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {properties.length > 0 ? (
                        properties.map((prop) => (
                            <PropertyCard
                                key={prop.id}
                                property={prop}
                                // --- 5. Pasar las nuevas props a la tarjeta ---
                                showFavoriteButton={canShowFavorite}
                                isFavorite={favoriteIds.has(prop.id)}
                                onToggleFavorite={handleToggleFavorite}
                                isFavoriteLoading={isTogglingFavorite}
                            />
                        ))
                    ) : (
                        <p className="col-span-full h-[270px] text-center text-gray-700">
                            No se encontraron propiedades con esos criterios.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;