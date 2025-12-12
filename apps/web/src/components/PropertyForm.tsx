// /src/components/PropertyForm.tsx
import React, { useState, useEffect } from 'react';
import { Property } from '../types';
// 1. Importar iconos necesarios y useNavigate
import { FaUpload, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type PropertyFormProps = {
    onSave: (formData: FormData) => Promise<any>; // Mantenemos any si onSave no tiene tipo específico aún
    initialData?: Property | null;
    isLoading: boolean;
};

const PropertyForm = ({ onSave, initialData = null, isLoading }: PropertyFormProps) => {
    // Estado para campos de texto
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        city: '',
        country: 'Perú',
        price: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        type: 'casa',
        status: 'en_venta',
    });

    const [newImages, setNewImages] = useState<FileList | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    // 2. Obtener la función navigate
    const navigate = useNavigate();

    // Llenar el formulario si estamos en modo "Editar"
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '', // Añadir fallback por si acaso
                description: initialData.description || '',
                address: initialData.address || '',
                city: initialData.city || '',
                country: initialData.country || 'Perú',
                price: initialData.price?.toString() || '',
                bedrooms: initialData.bedrooms?.toString() || '',
                bathrooms: initialData.bathrooms?.toString() || '',
                area: initialData.area?.toString() || '',
                type: initialData.type || 'casa',
                status: initialData.status || 'en_venta',
            });
            // Previsualizaciones de imágenes existentes
            setPreviews(initialData.image_urls?.map(imgName => `/uploads/${imgName}`) || []);
        }
    }, [initialData]);

    // Manejar cambios en campos de texto/select
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar selección de nuevas imágenes
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages(e.target.files);
            const newFilePreviews = Array.from(e.target.files).map(file => URL.createObjectURL(file));

            if (initialData) {
                const existingPreviews = initialData.image_urls
                    .filter(imgName => !imagesToDelete.includes(imgName))
                    .map(imgName => `/uploads/${imgName}`);
                setPreviews([...existingPreviews, ...newFilePreviews]);
            } else {
                setPreviews(newFilePreviews);
            }
        }
    };

    // Marcar una imagen existente para eliminar
    const markImageForDeletion = (imgSrc: string) => {
        const imgName = imgSrc.split('/').pop()!;
        setImagesToDelete(prev => [...prev, imgName]);
        setPreviews(prev => prev.filter(previewSrc => previewSrc !== imgSrc));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (newImages) {
            Array.from(newImages).forEach(file => {
                data.append('images', file);
            });
        }
        if (initialData) {
            data.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }
        await onSave(data);
    };

    // --- 3. NUEVA FUNCIÓN PARA CANCELAR ---
    const handleCancel = () => {
        // Navega a la página anterior en el historial
        navigate(-1);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 text-cyan-600 shadow-md">
            {/* ... (Todos tus campos: Título, Descripción, Grid detalles, Dirección) ... */}
            <div>
                <label htmlFor="title" className="mb-1 block font-bold text-gray-700">Título</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full rounded border p-2" />
            </div>
            <div>
                <label htmlFor="description" className="mb-1 block font-bold text-gray-700">Descripción</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} className="w-full rounded border p-2"></textarea>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                    <label htmlFor="price" className="mb-1 block font-bold text-gray-700">Precio (S/.)</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="w-full rounded border p-2" />
                </div>
                <div>
                    <label htmlFor="bedrooms" className="mb-1 block font-bold text-gray-700">Habitaciones</label>
                    <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} required className="w-full rounded border p-2" />
                </div>
                <div>
                    <label htmlFor="bathrooms" className="mb-1 block font-bold text-gray-700">Baños</label>
                    <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} required className="w-full rounded border p-2" />
                </div>
                <div>
                    <label htmlFor="area" className="mb-1 block font-bold text-gray-700">Área (m²)</label>
                    <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} className="w-full rounded border p-2" />
                </div>
                <div>
                    <label htmlFor="type" className="mb-1 block font-bold text-gray-700">Tipo</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full rounded border p-2">
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="terreno">Terreno</option>
                        <option value="local_comercial">Local Comercial</option>
                        <option value="habitación">Habitación</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="mb-1 block font-bold text-gray-700">Estado</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full rounded border p-2">
                        <option value="en_venta">En Venta</option>
                        <option value="en_alquiler">En Alquiler</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                    <label htmlFor="address" className="mb-1 block font-bold text-gray-700">Dirección</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="w-full rounded border p-2" />
                </div>
                <div>
                    <label htmlFor="city" className="mb-1 block font-bold text-gray-700">Ciudad</label>
                    <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="w-full rounded border p-2" />
                </div>
                <div>
                    <label htmlFor="country" className="mb-1 block font-bold text-gray-700">País</label>
                    <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="w-full rounded border p-2" />
                </div>
            </div>

            {/* Carga de Imágenes */}
            <div>
                <label className="mb-2 block font-bold text-gray-700">Imágenes</label>
                <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                    <label htmlFor="images" className="flex cursor-pointer flex-col items-center">
                        <FaUpload className="text-3xl text-gray-400" />
                        <span className="text-gray-600">Haz clic para subir (máx 10)</span>
                        <input type="file" id="images" name="images" onChange={handleImageChange} multiple accept="image/*" className="hidden" />
                    </label>
                </div>
            </div>

            {/* Previsualización de Imágenes */}
            {previews.length > 0 && (
                <div>
                    <h4 className="mb-2 font-medium text-gray-700">Previsualización:</h4> {/* Ajustado color de texto */}
                    <div className="flex flex-wrap gap-4">
                        {previews.map((src, index) => (
                            <div key={src || index} className="relative group"> {/* Añadido group para hover */}
                                <img src={src} alt={`Preview ${index}`} className="h-32 w-32 rounded object-cover border" />
                                {/* Botón de borrar (existentes en edición) */}
                                {initialData && src.startsWith('/uploads/') && (
                                    <button
                                        type="button"
                                        onClick={() => markImageForDeletion(src)}
                                        className="absolute right-1 top-1 rounded-full bg-red-600 p-1.5 text-white opacity-75 group-hover:opacity-100 transition-opacity"
                                        title="Marcar para eliminar"
                                    >
                                        <FaTrash className="h-3 w-3" />
                                    </button>
                                )}
                                {/* 💡 Opcional: Podrías añadir un botón similar para borrar previsualizaciones NUEVAS antes de guardar */}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 4. SECCIÓN DE BOTONES (MODIFICADA) --- */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t mt-8"> {/* Responsive: botones apilados en móvil */}
                {/* Botón Cancelar (Izquierda en desktop, arriba en móvil) */}
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-gray-500 px-6 py-3 text-white transition duration-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaTimes />
                    Cancelar
                </button>

                {/* Botón Guardar/Crear (Derecha en desktop, abajo en móvil) */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaSave />
                    {isLoading
                        ? (initialData ? 'Actualizando...' : 'Creando...')
                        : (initialData ? 'Actualizar Propiedad' : 'Crear Propiedad')}
                </button>
            </div>
        </form>
    );
};

export default PropertyForm;