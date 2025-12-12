// /src/pages/ManageUsersPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, updateUserRole } from '../services/adminService';
import { User } from '../types';
import { toast } from 'react-toastify';
import { FaUserShield, FaUserTie, FaUser, FaSave, FaExclamationCircle } from 'react-icons/fa';
// 1. Importar useAuth para saber quién es el admin actual
import { useAuth } from '../context/AuthContext';

const ManageUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estado local para manejar los cambios de rol antes de guardar
    // Key: userId, Value: newRole
    const [roleChanges, setRoleChanges] = useState<Record<string, string>>({});
    
    // Estado para saber qué usuario se está actualizando actualmente (loading individual)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    // 2. Obtener el usuario actual (el administrador logueado)
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        getAllUsers()
            .then(setUsers)
            .catch(() => toast.error('Error al cargar usuarios.'))
            .finally(() => setLoading(false));
    };

    // Maneja el cambio en el select (solo actualiza el estado local, no la API)
    const handleRoleChange = (userId: string, newRole: string) => {
        setRoleChanges(prev => ({ ...prev, [userId]: newRole }));
    };

    // Envía los cambios a la API cuando se hace clic en guardar
    const handleUpdateRole = async (userId: string) => {
        const newRole = roleChanges[userId];
        if (!newRole) return; // No hubo cambios

        setUpdatingUserId(userId);
        try {
            await updateUserRole(userId, newRole);
            toast.success('Rol actualizado correctamente.');
            
            // Actualizar la lista de usuarios localmente con el nuevo rol
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, role: newRole as User['role'] } : u
            ));
            
            // Limpiar el estado de cambios pendientes para este usuario
            setRoleChanges(prev => {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            });
        } catch (err: any) {
            toast.error(err.message || 'Error al actualizar el rol.');
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Helper para iconos de rol
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'administrador': return <FaUserShield className="text-red-500" />;
            case 'agente': return <FaUserTie className="text-blue-500" />;
            default: return <FaUser className="text-green-500" />;
        }
    };

    if (loading) return <p className="p-8 text-center">Cargando usuarios...</p>;

    return (
        <div className="container mx-auto p-4 py-8 md:p-8">
            <div className="mb-6">
                <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
                    &larr; Volver al Dashboard
                </Link>
                <h1 className="mt-2 text-3xl font-bold text-gray-800">Gestionar Usuarios</h1>
            </div>
            
            <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Rol Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Cambiar Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => {
                            // 3. Determinar si este usuario es el admin actual para bloquear edición
                            const isCurrentUser = currentUser?.id === user.id;
                            
                            return (
                                <tr key={user.id} className={isCurrentUser ? "bg-yellow-50" : "hover:bg-gray-50"}>
                                    {/* Columna Nombre */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.fullName}
                                                {/* Etiqueta visual para el usuario actual */}
                                                {isCurrentUser && <span className="ml-2 rounded bg-yellow-200 px-2 py-0.5 text-xs font-bold text-yellow-800">(Tú)</span>}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Columna Email */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>

                                    {/* Columna Icono Rol */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-700 capitalize">
                                            <span className="mr-2 text-lg">{getRoleIcon(user.role)}</span>
                                            {user.role}
                                        </div>
                                    </td>

                                    {/* Columna Selector */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            // El valor es el cambio pendiente O el rol original si no hay cambios
                                            value={roleChanges[user.id] || user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={isCurrentUser || updatingUserId === user.id}
                                            className={`rounded border p-2 text-sm focus:border-blue-500 focus:outline-none ${
                                                isCurrentUser ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
                                            }`}
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="agente">Agente</option>
                                            <option value="administrador">Administrador</option>
                                        </select>
                                    </td>

                                    {/* Columna Botón Guardar */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isCurrentUser ? (
                                            <span className="flex items-center text-xs text-gray-400">
                                                <FaExclamationCircle className="mr-1" />
                                                No editable
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleUpdateRole(user.id)}
                                                // El botón se deshabilita si: 
                                                // 1. No hay cambios en el estado local 
                                                // 2. El cambio es igual al rol original (selección redundante)
                                                // 3. Se está procesando una actualización
                                                disabled={!roleChanges[user.id] || roleChanges[user.id] === user.role || updatingUserId === user.id}
                                                className={`flex items-center rounded px-3 py-1 text-sm font-medium text-white transition ${
                                                    !roleChanges[user.id] || roleChanges[user.id] === user.role
                                                        ? 'bg-gray-300 cursor-default'
                                                        : 'bg-green-600 hover:bg-green-700 shadow-sm'
                                                }`}
                                            >
                                                <FaSave className="mr-1" />
                                                {updatingUserId === user.id ? 'Guardando...' : 'Guardar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;