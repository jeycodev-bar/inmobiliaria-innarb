// /src/pages/PropertyDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, deleteProperty } from '../services/propertyService';
import { getMyFavorites, addFavorite, removeFavorite } from '../services/favoriteService';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt,
    FaEdit, FaTrash, FaHeart, FaRegHeart,
    FaArrowLeft, FaExpand // --- IMPORTADO FaExpand ---
} from 'react-icons/fa';
import AgentContactCard from '../components/AgentContactCard';
import ImageLightbox from '../components/ImageLightbox'; // --- IMPORTADO LIGHTBOX ---

// Helper de precio
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 0,
    }).format(price);
};

// Tipo extendido
type PropertyWithAgentData = Property & {
    agent_name: string;
    agent_phone?: string | null;
};

const PropertyDetailPage = () => {
    const [property, setProperty] = useState<PropertyWithAgentData | null>(null); // Tipado corregido
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState<string>('');

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    // --- ESTADOS PARA LIGHTBOX ---
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    // Array con todas las rutas completas de las imágenes
    const allImages = property?.image_urls.map(url => `/uploads/${url}`) || [];

    useEffect(() => {
        if (!id) {
            setError('No se proporcionó un ID de propiedad.');
            setLoading(false);
            return;
        }

        // 1. Cargar la propiedad
        getPropertyById(id)
            .then((data) => {
                setProperty(data as PropertyWithAgentData);
                if (data.image_urls && data.image_urls.length > 0) {
                    setMainImage(`/uploads/${data.image_urls[0]}`);
                }
            })
            .catch(() => setError('No se pudo cargar la propiedad.'))
            .finally(() => setLoading(false));

        // 2. Cargar favoritos
        if (isLoggedIn && user?.role === 'cliente') {
            getMyFavorites()
                .then((favorites) => {
                    if (favorites.some(fav => fav.id === id)) {
                        setIsFavorite(true);
                    }
                })
                .catch(() => console.error("Error al cargar favoritos."));
        }
    }, [id, isLoggedIn, user]);

    // --- FUNCIONES DEL LIGHTBOX ---
    const openLightbox = () => {
        // Encontrar el índice de la imagen que se está mostrando actualmente como principal
        const index = allImages.indexOf(mainImage);
        setLightboxIndex(index >= 0 ? index : 0);
        setIsLightboxOpen(true);
    };

    const handleNextImage = () => {
        if (lightboxIndex < allImages.length - 1) {
            setLightboxIndex(prev => prev + 1);
        }
    };

    const handlePrevImage = () => {
        if (lightboxIndex > 0) {
            setLightboxIndex(prev => prev - 1);
        }
    };

    // --- FUNCIONES EXISTENTES ---
    const handleDelete = async () => {
        if (!id || !window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return;
        try {
            await deleteProperty(id);
            toast.success('Propiedad eliminada exitosamente.');
            navigate('/propiedades');
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar la propiedad.');
        }
    };

    const handleToggleFavorite = async () => {
        if (!id || favoriteLoading) return;
        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                await removeFavorite(id);
                setIsFavorite(false);
                toast.info('Propiedad eliminada de favoritos.');
            } else {
                await addFavorite(id);
                setIsFavorite(true);
                toast.success('Propiedad guardada en favoritos.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error al procesar la solicitud.');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const canModify = isLoggedIn && (user?.role === 'administrador' || user?.id === property?.agent_id);
    const canFavorite = isLoggedIn && user?.role === 'cliente';

    if (loading) return <p className="p-8 text-center">Cargando...</p>;
    if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
    if (!property) return null;

    return (
        <div className="bg-radial-turk p-4 py-8 md:p-8 min-h-screen">
            <div className="container mx-auto">
                {/* BOTÓN "VOLVER" */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center rounded-md bg-white/50 px-3 py-1 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-white/80"
                        aria-label="Volver a la página anterior"
                    >
                        <FaArrowLeft className="mr-2 h-3 w-3" />
                        Volver
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-8">
                    {/* --- COLUMNA PRINCIPAL (Información) --- */}
                    <div className="rounded-lg bg-radial-silver p-6 shadow-xl lg:col-span-5">
                        
                        {/* Título y Acciones */}
                        <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
                            <h1 className="mb-2 text-4xl font-bold text-gray-800">{property.title}</h1>
                            <div className="flex space-x-4">
                                {canFavorite && (
                                    <button
                                        onClick={handleToggleFavorite}
                                        disabled={favoriteLoading}
                                        className={`flex items-center rounded mt-2 px-3 py-2 text-white transition
                                        ${isFavorite ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-500 hover:bg-gray-600'}
                                        ${favoriteLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                                        {isFavorite ? 'Guardado' : 'Guardar'}
                                    </button>
                                )}
                                {canModify && (
                                    <>
                                        <Link to={`/editar-propiedad/${property.id}`} className="flex items-center rounded bg-blue-600 mt-2 px-4 py-2 text-white transition hover:bg-blue-700">
                                            <FaEdit className="mr-2" /> Editar
                                        </Link>
                                        <button onClick={handleDelete} className="flex items-center rounded bg-red-600 mt-2 px-4 py-2 text-white transition hover:bg-red-700">
                                            <FaTrash className="mr-2" /> Eliminar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Precio y Ubicación */}
                        <div className="mb-4 flex flex-col md:flex-row md:items-center">
                            <span className="text-4xl font-extrabold text-cyan-700">
                                {formatPrice(property.price)}
                            </span>
                            <div className="ml-0 mt-2 flex items-center text-gray-600 md:ml-4 md:mt-0">
                                <FaMapMarkerAlt className="mr-2" />
                                <span>{`${property.address}, ${property.city}, ${property.country}`}</span>
                            </div>
                        </div>

                        {/* --- GALERÍA DE IMÁGENES (CON EFECTO LIGHTBOX) --- */}
                        <div className="mb-6 grid grid-cols-1 gap-4">
                            {/* Imagen Principal (Clickable) */}
                            <div 
                                className="group relative cursor-pointer overflow-hidden rounded-lg border-8 border-cyan-500 md:h-[500px]"
                                onClick={openLightbox} // Abre el lightbox
                            >
                                <img
                                    src={mainImage || '/images/no-image.jpg'}
                                    alt={property.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay con icono Expandir */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20">
                                    <FaExpand className="text-4xl text-white opacity-0 drop-shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
                                </div>
                            </div>

                            {/* Miniaturas */}
                            <div className="flex space-x-2 overflow-x-auto p-2">
                                {property.image_urls.map((imgName, index) => (
                                    <img
                                        key={index}
                                        src={`/uploads/${imgName}`}
                                        alt={`Miniatura ${index + 1}`}
                                        className={`h-24 w-24 cursor-pointer rounded object-cover transition hover:opacity-80 ${mainImage === `/uploads/${imgName}` ? 'ring-4 ring-blue-500' : ''}`}
                                        onClick={() => setMainImage(`/uploads/${imgName}`)} // Cambia la imagen principal
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Detalles Técnicos */}
                        <div className="mb-6 grid grid-cols-2 gap-4 border-y py-4 md:grid-cols-4">
                            <div className="text-center">
                                <span className="block text-sm text-gray-500">Tipo</span>
                                <span className="block text-lg font-semibold capitalize">{property.type.replace('_', ' ')}</span>
                            </div>
                            <div className="text-center">
                                <FaBed className="mx-auto mb-1 text-2xl text-blue-600" />
                                <span className="block text-lg font-semibold">{property.bedrooms} hab.</span>
                            </div>
                            <div className="text-center">
                                <FaBath className="mx-auto mb-1 text-2xl text-blue-600" />
                                <span className="block text-lg font-semibold">{property.bathrooms} baños</span>
                            </div>
                            <div className="text-center">
                                <FaRulerCombined className="mx-auto mb-1 text-2xl text-blue-600" />
                                <span className="block text-lg font-semibold">{property.area} m²</span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold text-gray-800">Descripción</h2>
                            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{property.description}</p>
                        </div>
                    </div>

                    {/* --- COLUMNA LATERAL (Agente) --- */}
                    <div className="lg:col-span-2">
                        {property.agent_name && (
                            <div className="mt-8 lg:mt-0 sticky top-8">
                                <AgentContactCard
                                    agentName={property.agent_name}
                                    agentPhone={property.agent_phone}
                                    propertyName={property.title}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- COMPONENTE LIGHTBOX --- */}
            {isLightboxOpen && (
                <ImageLightbox
                    images={allImages}
                    currentIndex={lightboxIndex}
                    onClose={() => setIsLightboxOpen(false)}
                    onNext={handleNextImage}
                    onPrev={handlePrevImage}
                />
            )}
        </div>
    );
};

export default PropertyDetailPage;