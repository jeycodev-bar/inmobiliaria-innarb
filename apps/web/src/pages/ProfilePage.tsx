// /src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateProfile } from '../services/authService';
import { User } from '../types';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfilePage = () => {
    const { user, token, login } = useAuth(); // ¡Importante! Traemos 'login' para actualizar el contexto

    const [profile, setProfile] = useState<User | null>(user);
    const [loading, setLoading] = useState(!user); // Si no hay usuario en contexto, cargamos

    // --- Estados para el modo edición ---
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });

    // Cargar datos frescos al montar la página
    useEffect(() => {
        if (token) {
            getUserProfile(token)
                .then((freshProfile) => {
                    setProfile(freshProfile);
                    // Actualizamos el estado del formulario con los datos frescos
                    setFormData({
                        fullName: freshProfile.fullName,
                        phone: freshProfile.phone || '',
                    });
                })
                .catch(() => toast.error('No se pudo cargar la información del perfil.'))
                .finally(() => setLoading(false));
        }
    }, [token]);

    // Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsLoading(true);
        try {
            const updatedUser = await updateProfile(formData);

            // --- ¡Paso Crítico! ---
            // Actualizamos el contexto global para que el Navbar vea el nuevo nombre
            login(token, updatedUser);

            setProfile(updatedUser);
            setIsEditing(false);
            toast.success('¡Perfil actualizado exitosamente!');
        } catch (err: any) {
            toast.error(err.message || 'Error al actualizar.');
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar edición
    const handleCancel = () => {
        setIsEditing(false);
        // Restauramos el formulario a los datos originales
        if (profile) {
            setFormData({ fullName: profile.fullName, phone: profile.phone || '' });
        }
    };

    if (loading) return <p className="p-8 text-center">Cargando perfil...</p>;
    if (!profile) return <p className="p-8 text-center text-red-600">No se encontró el perfil.</p>;

    return (
        <div className="container bg-radial-golden mx-auto  p-4 py-8 md:p-8">
            <div className="rounded-lg bg-white mx-auto max-w-2xl p-8 shadow-md">

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isEditing ? 'Editar Perfil' : 'Mi Perfil'}
                    </h1>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            <FaEdit className="mr-2" /> Editar
                        </button>
                    ) : (
                        <button
                            onClick={handleCancel}
                            className="flex items-center rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                        >
                            <FaTimes className="mr-2" /> Cancelar
                        </button>
                    )}
                </div>

                {isEditing ? (
                    // --- MODO EDICIÓN (Formulario) ---
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="mb-1 block font-bold text-gray-700">Nombre Completo</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="mb-1 block font-bold text-gray-700">Teléfono (Opcional)</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Campo Email (Solo lectura) */}
                        <div>
                            <label className="mb-1 block font-bold text-gray-400">Email (No se puede cambiar)</label>
                            <input
                                type="email"
                                value={profile.email}
                                className="w-full rounded border bg-gray-100 p-3 text-gray-500"
                                disabled
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center rounded bg-green-600 px-6 py-3 text-white transition hover:bg-green-700 disabled:bg-gray-400"
                        >
                            <FaSave className="mr-2" />
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </form>
                ) : (
                    // --- MODO VISTA (Solo lectura) ---
                    <div className="space-y-6">
                        <InfoItem icon={<FaUser />} label="Nombre Completo" value={profile.fullName} />
                        <InfoItem icon={<FaEnvelope />} label="Email" value={profile.email} />
                        <InfoItem icon={<FaPhone />} label="Teléfono" value={profile.phone || 'No registrado'} />
                        <InfoItem icon={<FaBuilding />} label="Rol" value={profile.role} className="capitalize" />
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente helper para la vista de solo lectura
const InfoItem = ({ icon, label, value, className = '' }:
    { icon: React.ReactNode; label: string; value: string; className?: string }
) => (
    <div className="flex items-center border-b pb-4">
        <div className="mr-4 text-2xl text-gray-500">{icon}</div>
        <div>
            <span className="block text-sm text-gray-600">{label}</span>
            <span className={`text-lg font-medium ${className}`}>{value}</span>
        </div>
    </div>
);

export default ProfilePage;