// /src/pages/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/adminService';
import { toast } from 'react-toastify';
import { FaUsers, FaHome, FaDollarSign, FaHandHoldingUsd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Stats = {
    totalUsers: number;
    totalProperties: number;
    totalSales: number;
    totalRevenue: number;
};

const AdminDashboardPage = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(() => toast.error('Error al cargar estadísticas.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-8 text-center">Cargando dashboard...</p>;
    if (!stats) return null;

    return (
        <div className="container h-[600px] mx-auto bg-radial-golden p-4 py-8 md:p-8">
            <h1 className="mb-6 text-5xl font-bold font-londri text-green-400">Admin Dashboard</h1>

            {/* --- Enlaces de Navegación Admin - ACTUALIZADO --- */}
            <div className="mb-6 flex flex-wrap gap-4">
                <Link
                    to="/admin/usuarios"
                    className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                    Gestionar Usuarios
                </Link>
                <Link
                    to="/admin/propiedades"
                    className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                    Gestionar Propiedades
                </Link>
                <Link
                    to="/admin/logs"
                    className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                    Historial de Auditoría
                </Link>
            </div>

            {/* --- Tarjetas de Estadísticas --- */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<FaUsers />} title="Total Usuarios" value={stats.totalUsers} />
                <StatCard icon={<FaHome />} title="Total Propiedades" value={stats.totalProperties} />
                <StatCard icon={<FaHandHoldingUsd />} title="Ventas Totales" value={stats.totalSales} />
                <StatCard
                    icon={<FaDollarSign />}
                    title="Ingresos Totales"
                    value={`S/ ${stats.totalRevenue.toLocaleString('es-PE')}`}
                />
            </div>
        </div>
    );
};

// Componente helper para las tarjetas
const StatCard = ({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
}) => (
    <div className="flex items-center bg-radial-sunset rounded-lg p-6 shadow-md">
        <div className="mr-4 rounded-full bg-blue-100 p-3 text-3xl text-blue-600">
            {icon}
        </div>
        <div>
            <span className="block text-lg text-gray-500">{title}</span>
            <span className="block text-2xl font-bold">{value}</span>
        </div>
    </div>
);

export default AdminDashboardPage;
