// /src/pages/AdminPropertiesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProperties, deleteProperty } from '../services/propertyService'; // Usa getProperties (todas)
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
// 1. Importar el modal
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminPropertiesPage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // --- 2. Añadir estados para el modal ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await getProperties(); // Trae TODAS las propiedades
            setProperties(data);
        } catch (err: any) {
            toast.error(err.message || 'Error al cargar las propiedades.');
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica de Acciones (Solo Admin) ---

    // 3. Modificar handleDelete para ABRIR el modal
    const handleDeleteClick = (propertyId: string, propertyTitle: string) => {
        setPropertyToDelete({ id: propertyId, title: propertyTitle });
        setIsDeleteModalOpen(true);
    };

    // 4. Nueva función para CONFIRMAR el borrado
    const confirmDelete = async () => {
        if (!propertyToDelete) return;
        setIsDeleting(true);
        try {
            await deleteProperty(propertyToDelete.id);
            setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
            toast.success(`ADMIN: Propiedad "${propertyToDelete.title}" eliminada.`);
            setIsDeleteModalOpen(false);
            setPropertyToDelete(null);
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (propertyId: string) => {
        navigate(`/editar-propiedad/${propertyId}`);
    };

    if (loading) return <p className="p-8 text-center">Cargando...</p>;

    // --- Estilos para los botones de acción ---
    const actionButtonClass = "flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition";
    const editBtnClass = `${actionButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`;
    const deleteBtnClass = `${actionButtonClass} bg-red-100 text-red-700 hover:bg-red-200`;

    return (
        <> {/* Necesitamos fragmento para el modal */}
            <div className="container bg-radial-golden mx-auto p-4 py-8 md:p-8">
                <div className="mb-6">
                    <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
                        &larr; Volver al Dashboard
                    </Link>
                    <h1 className="mt-2 text-5xl font-bold text-center font-londri text-gray-800">Gestionar Todas las Propiedades</h1>
                </div>

                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((prop) => (
                            <PropertyCard
                                key={prop.id}
                                property={prop}
                                // --- Aquí inyectamos los botones de acción del Admin ---
                                renderActions={(property) => (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(property.id)} className={editBtnClass}>
                                            <FaEdit className="mr-1" /> Editar (Admin)
                                        </button>
                                        {/* 5. Llamar a handleDeleteClick */}
                                        <button onClick={() => handleDeleteClick(property.id, property.title)} className={deleteBtnClass}>
                                            <FaTrash className="mr-1" /> Eliminar (Admin)
                                        </button>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-700">
                        No hay propiedades publicadas en el sistema.
                    </p>
                )}
            </div>

            {/* --- 6. Renderizar el Modal de Borrado --- */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={propertyToDelete?.title || ''}
                isLoading={isDeleting}
            />
        </>
    );
};

export default AdminPropertiesPage;