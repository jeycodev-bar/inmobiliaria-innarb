// /src/pages/MyFavoritesPage.tsx
import React, { useState, useEffect } from 'react';
import { getMyFavorites } from '../services/favoriteService';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { toast } from 'react-toastify';

const MyFavoritesPage = () => {
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const data = await getMyFavorites();
            setFavorites(data);
        } catch (err: any) {
            toast.error(err.message || 'Error al cargar favoritos.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-8 text-center">Cargando favoritos...</p>;

    return (
        <div className="container bg-radial-golden mx-auto p-4 py-8 md:p-8">
            <h1 className="mb-6 text-5xl font-bold text-center font-londri text-cyan-800">Mis Favoritos</h1>
            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((prop) => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-700">
                    Aún no has guardado ninguna propiedad en favoritos.
                </p>
            )}
        </div>
    );
};

export default MyFavoritesPage;