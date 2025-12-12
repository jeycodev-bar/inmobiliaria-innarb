// /src/pages/CreatePropertyPage.tsx
import React, { useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import { createProperty } from '../services/propertyService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePropertyPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSave = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const { property } = await createProperty(formData);
            toast.success('¡Propiedad creada exitosamente!');
            navigate(`/propiedades/${property.id}`); // Redirige a la página de detalle
        } catch (err: any) {
            toast.error(err.message || 'Error al crear la propiedad.');
            setIsLoading(false);
        }
    };

    return (
        <section className='bg-hero-iluminary'>

            <div className="container mx-auto max-w-4xl p-4 py-8 md:p-8">
                <h1 className="mb-6 text-5xl font-bold text-center font-londri text-yellow-400">Crear Nueva Propiedad</h1>
                <PropertyForm onSave={handleSave} isLoading={isLoading} />
            </div>

        </section>

    );
};

export default CreatePropertyPage;