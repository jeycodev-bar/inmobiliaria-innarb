// /src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

// Layout
import Layout from './components/Layout';

// --- Páginas de Autenticación (sin Layout) ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Páginas Públicas ---
import HomePage from './pages/HomePage'; // ✅ Página de inicio REAL
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

// --- Páginas Privadas ---
import ProfilePage from './pages/ProfilePage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';

// --- Páginas de Administración ---
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageUsersPage from './pages/ManageUsersPage';
import AdminLogsPage from './pages/AdminLogsPage';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

// --- Componente de Protección de Rutas ---
const ProtectedRoute = ({
    children,
    roles,
}: {
    children: React.ReactNode;
    roles?: string[];
}) => {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn) {
        //toast.error('Debes iniciar sesión para ver esta página.');
        return <Navigate to="/login" replace />;
    }

    if (roles && user && !roles.includes(user.role)) {
        toast.error('No tienes permiso para acceder a esta página.');
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// --- Componente Principal ---
function App() {
    return (
        <>
            <Routes>
                {/* --- Rutas Públicas (Con Layout) --- */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} /> {/* ✅ Nueva página principal */}
                    <Route path="propiedades" element={<PropertiesPage />} />
                    <Route path="propiedades/:id" element={<PropertyDetailPage />} />
                    
                    <Route path="nosotros" element={<AboutPage />} />
                    <Route path="contacto" element={<ContactPage />} />

                    {/* --- Rutas Privadas --- */}
                    <Route
                        path="perfil"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="mis-favoritos"
                        element={
                            <ProtectedRoute>
                                <MyFavoritesPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- Rutas de Agente --- */}
                    <Route
                        path="mis-propiedades"
                        element={
                            <ProtectedRoute roles={['agente']}>
                                <MyPropertiesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="crear-propiedad"
                        element={
                            <ProtectedRoute roles={['agente']}>
                                <CreatePropertyPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="editar-propiedad/:id"
                        element={
                            <ProtectedRoute roles={['agente', 'administrador']}>
                                <EditPropertyPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- Rutas de Administración --- */}
                    <Route
                        path="admin/dashboard"
                        element={
                            <ProtectedRoute roles={['administrador']}>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/usuarios"
                        element={
                            <ProtectedRoute roles={['administrador']}>
                                <ManageUsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/logs"
                        element={
                            <ProtectedRoute roles={['administrador']}>
                                <AdminLogsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/propiedades"
                        element={
                            <ProtectedRoute roles={['administrador']}>
                                <AdminPropertiesPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* --- Rutas Sin Layout (Login/Registro) --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* --- Redirección 404 --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* --- Contenedor de Notificaciones --- */}
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
        </>
    );
}

export default App;
