// /src/components/PropertyCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import {
    FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaCheckCircle,
    FaHeart, // Corazón lleno (rojo)
    FaRegHeart // Corazón vacío (borde)
} from 'react-icons/fa';

// (formatPrice sin cambios)
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 0,
    }).format(price);
};

type PropertyCardProps = {
    property: Property;
    renderActions?: (property: Property) => React.ReactNode;
    // --- 1. Añadir nuevas props para Favoritos ---
    showFavoriteButton?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: (propertyId: string) => void;
    isFavoriteLoading?: boolean; // Para deshabilitar el botón
};

const PropertyCard = ({
    property,
    renderActions,
    showFavoriteButton = false,
    isFavorite = false,
    onToggleFavorite = () => { },
    isFavoriteLoading = false,
}: PropertyCardProps) => {

    const imageUrl = property.image_urls.length > 0
        ? `/uploads/${property.image_urls[0]}`
        : '/images/no-image.jpg';

    const isSold = property.status === 'vendido';

    // --- 2. Función Handler para el botón de favorito ---
    // Detiene la propagación para no navegar a la página de detalles
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Previene que el <Link> se active
        e.stopPropagation(); // Detiene el evento
        onToggleFavorite(property.id);
    };

    return (
        // --- Contenedor principal con nuevo fondo y efecto hover ---
        <div className="flex flex-col overflow-hidden rounded-lg bg-radial-silver shadow-lg transition-transform duration-300 hover:scale-[1.02]">

            {/* 1. IMAGEN (Wrapper de Link) */}
            <Link to={`/propiedades/${property.id}`} className="flex-shrink-0">
                <div className="relative">

                    {/* --- 3. Botón de Favorito (Icono) --- */}
                    {showFavoriteButton && (
                        <button
                            onClick={handleFavoriteClick}
                            disabled={isFavoriteLoading}
                            className={`absolute top-3 right-3 z-10 rounded-full p-2 transition-transform duration-200 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed ${isFavorite ? 'text-red-500' : 'text-white' // Rojo si es favorito, blanco si no
                                }`}
                            aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                        >
                            {isFavorite ? (
                                <FaHeart className="h-6 w-6" /> // Corazón lleno
                            ) : (
                                <FaRegHeart className="h-6 w-6" /> // Corazón vacío
                            )}
                        </button>
                    )}

                    {/* Imagen de la propiedad */}
                    <img
                        src={imageUrl}
                        alt={property.title}
                        loading="lazy" // Añadido lazy loading
                        className={`h-56 w-full object-cover ${isSold ? 'opacity-40' : ''}`}
                    />

                    {/* Etiqueta de Vendido (Siempre visible si está vendido) */}
                    {isSold && (
                        <span className="absolute left-2 top-2 flex items-center rounded bg-green-600 px-3 py-1 text-sm font-bold text-white">
                            <FaCheckCircle className="mr-1" /> Vendido
                        </span>
                    )}
                </div>
            </Link>

            {/* 2. CUERPO DE LA TARJETA */}
            <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                    <div className="mb-2 flex items-baseline">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                            {property.type}
                        </span>
                        <span className="ml-auto text-2xl font-bold text-cyan-700">
                            {formatPrice(property.price)}
                        </span>
                    </div>
                    <h3 className="mb-2 truncate text-xl font-bold text-gray-900">
                        <Link to={`/propiedades/${property.id}`}>{property.title}</Link>
                    </h3>
                    <div className="mb-4 flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        <span>{property.city}</span>
                    </div>
                    <div className="flex justify-between border-t pt-4 text-sm text-gray-700">
                        <div className="flex items-center"><FaBed className="mr-2 text-blue-500" /> {property.bedrooms} hab.</div>
                        <div className="flex items-center"><FaBath className="mr-2 text-blue-500" /> {property.bathrooms} baños</div>
                        <div className="flex items-center"><FaRulerCombined className="mr-2 text-blue-500" /> {property.area} m²</div>
                    </div>
                </div>
            </div>

            {/* 3. "SLOT" DE ACCIONES */}
            {renderActions && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                    {renderActions(property)}
                </div>
            )}
        </div>
    );
};

export default PropertyCard;