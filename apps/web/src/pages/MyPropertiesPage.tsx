// /src/pages/MyPropertiesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyProperties, deleteProperty, sellProperty } from '../services/propertyService';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import SellPropertyModal from '../components/SellPropertyModal';
// 1. Importar el nuevo modal de confirmación
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaDollarSign, FaCheckCircle } from 'react-icons/fa';

const MyPropertiesPage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para SellModal
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isSelling, setIsSelling] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    // --- 2. Nuevos estados para el Modal de Borrado ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);

    const navigate = useNavigate();

    // --- Previene doble ejecución del fetch en modo estricto ---
    const fetchHasRun = useRef(false);

    useEffect(() => {
        if (!fetchHasRun.current) {
            fetchMyProperties();
            fetchHasRun.current = true;
        }
    }, []);

    const fetchMyProperties = async () => {
        try {
            setLoading(true);
            const data = await getMyProperties();
            setProperties(data);
        } catch (err: any) {
            toast.error(err.message || 'Error al cargar mis propiedades.');
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica de acciones (Venta y Edición sin cambios) ---

    const handleOpenSellModal = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
        setIsSellModalOpen(true);
    };

    const handleSellSubmit = async (buyerName: string, password: string) => {
        if (!selectedPropertyId) return;
        setIsSelling(true);
        try {
            const { property: soldProperty } = await sellProperty(selectedPropertyId, buyerName, password);
            setProperties(prev => prev.map(p => (p.id === selectedPropertyId ? soldProperty : p)));
            setIsSellModalOpen(false);
            setSelectedPropertyId(null);
            toast.success('¡Propiedad marcada como vendida!');
        } catch (err: any) {
            toast.error(err.message || 'Error al confirmar la venta.');
            throw err;
        } finally {
            setIsSelling(false);
        }
    };

    const handleEdit = (propertyId: string) => {
        navigate(`/editar-propiedad/${propertyId}`);
    };

    // --- 3. Modificar handleDelete para ABRIR el modal ---
    const handleDeleteClick = (propertyId: string, propertyTitle: string) => {
        setPropertyToDelete({ id: propertyId, title: propertyTitle }); // Guardar datos para el modal
        setIsDeleteModalOpen(true); // Abrir el modal
    };

    // --- 4. Nueva función para CONFIRMAR el borrado ---
    const confirmDelete = async () => {
        if (!propertyToDelete) return;

        setIsDeleting(true); // Indicar que estamos borrando
        try {
            await deleteProperty(propertyToDelete.id);
            // Actualizar UI localmente
            setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
            toast.success(`Propiedad "${propertyToDelete.title}" eliminada.`);
            setIsDeleteModalOpen(false); // Cerrar modal
            setPropertyToDelete(null); // Limpiar estado
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar.');
            // Opcional: no cerrar el modal si hay error
        } finally {
            setIsDeleting(false); // Terminar estado de carga
        }
    };


    if (loading) return <p className="p-8 text-center">Cargando...</p>;

    // --- Estilos de botones ---
    const actionButtonClass = "flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition";
    const editBtnClass = `${actionButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`;
    const deleteBtnClass = `${actionButtonClass} bg-red-100 text-red-700 hover:bg-red-200`;
    const sellBtnClass = `${actionButtonClass} bg-green-600 text-white hover:bg-green-700`;
    const soldBtnClass = `${actionButtonClass} bg-gray-200 text-gray-600 cursor-not-allowed`;

    return (
        <>
            <div className="container mx-auto bg-radial-golden p-4 py-8 md:p-8">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-5xl font-bold text-center font-londri text-green-400">Mis Propiedades Publicadas</h1>
                    <Link
                        to="/crear-propiedad"
                        className="flex items-center rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <FaPlus className="mr-2" /> Crear Nueva
                    </Link>
                </div>

                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((prop) => (
                            <PropertyCard
                                key={prop.id}
                                property={prop}
                                renderActions={(property) => (
                                    <div className="flex items-center justify-between">
                                        {/* Botones Izquierda */}
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(property.id)} className={editBtnClass}>
                                                <FaEdit className="mr-1" /> Editar
                                            </button>
                                            {/* 5. Llamar a handleDeleteClick */}
                                            <button onClick={() => handleDeleteClick(property.id, property.title)} className={deleteBtnClass}>
                                                <FaTrash className="mr-1" /> Eliminar
                                            </button>
                                        </div>

                                        {/* Botón Derecha (Vender/Vendido) */}
                                        {property.status === 'vendido' ? (
                                            <span className={soldBtnClass}>
                                                <FaCheckCircle className="mr-1" /> Vendido
                                            </span>
                                        ) : (
                                            <button onClick={() => handleOpenSellModal(property.id)} className={sellBtnClass}>
                                                <FaDollarSign className="mr-1" /> Vender
                                            </button>
                                        )}
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-700">
                        Aún no has publicado ninguna propiedad.
                    </p>
                )}
            </div>

            {/* Modal de Venta (existente) */}
            <SellPropertyModal
                isOpen={isSellModalOpen}
                onClose={() => setIsSellModalOpen(false)}
                onSubmit={handleSellSubmit}
                isLoading={isSelling}
            />

            {/* --- 6. Renderizar el Modal de Borrado --- */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)} // Simplemente cierra
                onConfirm={confirmDelete} // Llama a la función de borrado
                itemName={propertyToDelete?.title || ''} // Pasa el nombre
                isLoading={isDeleting} // Pasa el estado de carga
            />
        </>
    );
};

export default MyPropertiesPage;