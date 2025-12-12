// /src/pages/AdminLogsPage.tsx
import React, { useState, useEffect } from 'react';
import { getPropertyLogs } from '../services/adminService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Tipo para el Log (debe coincidir con la respuesta de la API)
type PropertyLog = {
    id: string;
    property_id: string;
    property_title: string;
    user_id: string;
    user_email: string;
    action_type: 'create' | 'edit' | 'delete' | 'sold';
    details: string;
    created_at: string;
};

const AdminLogsPage = () => {
    const [logs, setLogs] = useState<PropertyLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = () => {
        setLoading(true);
        getPropertyLogs()
            .then(setLogs)
            .catch(() => toast.error('Error al cargar el historial.'))
            .finally(() => setLoading(false));
    };

    if (loading) return <p className="p-8 text-center">Cargando historial...</p>;

    return ( //h-[600px]
        <div className="container mx-auto p-4 py-8 md:p-8">
            <div className="mb-6">
                <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
                    &larr; Volver al Dashboard
                </Link>
                <h1 className="mt-2 text-3xl font-bold text-gray-800">Historial de Auditoría</h1>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Propiedad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(log.created_at).toLocaleString('es-PE')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold
                    ${log.action_type === 'create' && 'bg-green-100 text-green-800'}
                    ${log.action_type === 'edit' && 'bg-yellow-100 text-yellow-800'}
                    ${log.action_type === 'delete' && 'bg-red-100 text-red-800'}
                    ${log.action_type === 'sold' && 'bg-blue-100 text-blue-800'}`}
                                    >
                                        {log.action_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.property_title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.user_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLogsPage;