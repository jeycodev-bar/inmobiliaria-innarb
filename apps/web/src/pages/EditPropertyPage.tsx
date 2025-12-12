// /src/pages/EditPropertyPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { getPropertyById, updateProperty } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';
import { toast } from 'react-toastify';

const EditPropertyPage = () => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loadingForm, setLoadingForm] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!id) {
            setError('No se proporcionó un ID de propiedad.');
            setLoadingData(false);
            return;
        }

        getPropertyById(id)
            .then((data) => {
                // --- Verificación de Permiso ---
                if (data.agent_id !== user?.id && user?.role !== 'administrador') {
                    setError('No tienes permiso para editar esta propiedad.');
                    toast.error('Acceso denegado.');
                    navigate(`/propiedades/${id}`);
                } else {
                    setProperty(data);
                }
            })
            .catch(() => setError('No se pudo cargar la propiedad.'))
            .finally(() => setLoadingData(false));

    }, [id, user, navigate]);

    const handleSave = async (formData: FormData) => {
        if (!id) return;
        setLoadingForm(true);
        try {
            const { property } = await updateProperty(id, formData);
            toast.success('¡Propiedad actualizada exitosamente!');
            navigate(`/propiedades/${property.id}`);
        } catch (err: any) {
            toast.error(err.message || 'Error al actualizar la propiedad.');
            setLoadingForm(false);
        }
    };

    if (loadingData) return <p className="p-8 text-center">Cargando datos...</p>;
    if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

    return (
        <section className='bg-radial-golden'>
            <div className="container mx-auto max-w-4xl p-4 py-8 md:p-8">
                <h1 className="mb-6 text-5xl font-bold text-center font-londri text-green-400">Editar Propiedad</h1>
                {property && (
                    <PropertyForm
                        onSave={handleSave}
                        isLoading={loadingForm}
                        initialData={property}
                    />
                )}
            </div>
        </section>

    );
};

export default EditPropertyPage;