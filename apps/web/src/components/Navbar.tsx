// /src/components/Navbar.tsx
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Importa useLocation
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import UserMenuDropdown from './UserMenuDropdown';

// --- AYUDANTES DE ESTILO (ACTUALIZADOS) ---

// Estilo base para enlaces públicos (Escritorio)
const basePublicLinkClass =
    'px-3 py-2 border-b-2 font-medium text-sm transition duration-150 ease-in-out';
// Estilo para enlace público activo (Subrayado dorado)
const activePublicLinkClass = 'border-green-500 text-yellow-500'; // Subrayado dorado, texto blanco
// Estilo para enlace público inactivo
const inactivePublicLinkClass =
    'border-transparent text-gray-300 hover:border-gray-500 hover:text-white';

// Ayudante para combinar clases para enlaces públicos
const getPublicNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `${basePublicLinkClass} ${isActive ? activePublicLinkClass : inactivePublicLinkClass
        }`;
};

// Estilo para enlaces móviles (lógica similar)
const mobileLinkBase = 'block px-3 py-2 rounded-md text-base font-medium';
const mobileLinkActive = 'bg-gray-900 text-white';
const mobileLinkInactive = 'text-gray-300 hover:bg-gray-700 hover:text-white';
const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `${mobileLinkBase} ${isActive ? mobileLinkActive : mobileLinkInactive
        }`;
};
// --- FIN AYUDANTES DE ESTILO ---

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-radial-cyabl shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* 1. IZQUIERDA: Logo/Marca */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center text-2xl font-rubik text-gold-500">
                            <img className="h-12 w-auto mr-2" src="/logo.webp" alt="Logo INNARB" />
                            Innarb
                        </Link>
                    </div>

                    {/* 2. CENTRO: Enlaces Públicos (Escritorio) */}
                    <div className="hidden md:flex md:flex-grow md:justify-center">
                        <div className="flex items-baseline space-x-4">
                            <NavLink to="/" className={getPublicNavLinkClass} end>
                                Inicio
                            </NavLink>
                            <NavLink to="/nosotros" className={getPublicNavLinkClass}>Nosotros</NavLink>
                            <NavLink to="/propiedades" className={getPublicNavLinkClass}>
                                Propiedades
                            </NavLink>
                            <NavLink to="/contacto" className={getPublicNavLinkClass}>
                                Contacto
                            </NavLink>
                        </div>
                    </div>

                    {/* 3. DERECHA: Autenticación / Menú de Usuario (Escritorio) */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isLoggedIn ? (
                                <UserMenuDropdown />
                            ) : (
                                <div className="space-x-4">
                                    {/* <Link
                                        to="/login"
                                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Iniciar Sesión
                                    </Link> */}
                                        <Link
                                            to="/login"
                                            className="block w-full rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white
                                            transform transition-transform duration-200 ease-in-out
                                            hover:bg-cyan-900 scale-105 active:scale-95 focus:outline-none
                                            will-change-transform backface-hidden"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Botón Hamburguesa (Móvil) */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
                            aria-controls="mobile-menu"
                        >
                            <span className="sr-only">Abrir menú</span>
                            {isOpen ? (
                                <FaTimes className="block h-6 w-6" />
                            ) : (
                                <FaBars className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. Panel del Menú Móvil */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    <NavLink to="/" className={getMobileNavLinkClass}>Inicio</NavLink>
                    <NavLink to="/nosotros" className={getMobileNavLinkClass}>Nosotros</NavLink>
                    <NavLink to="/propiedades" className={getMobileNavLinkClass}>Propiedades</NavLink>
                    <NavLink to="/contacto" className={getMobileNavLinkClass}>Contacto</NavLink>
                </div>

                <div className="border-t border-gray-700 pb-3 pt-4">
                    {isLoggedIn ? (
                        <UserMenuMobile />
                    ) : (
                        <div className="space-y-2 px-2">
                            <Link
                                to="/login"
                                className="block w-full rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white hover:bg-blue-700"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

// --- Componente ayudante para el Menú Móvil de Usuario ---
const UserMenuMobile = () => {
    const { user, logout } = useAuth();
    const role = user?.role;

    return (
        <div className="px-5">
            <div className="mb-1 text-base font-medium leading-none text-white">{user?.fullName}</div>
            <div className="mb-2 text-sm font-medium leading-none text-gray-400">{user?.email}</div>

            {/* Enlaces comunes */}
            <NavLink
                to="/perfil"
                className={`${mobileLinkBase} mt-4 text-gray-300 hover:bg-gray-700 hover:text-white`}
            >
                Perfil
            </NavLink>

            {/* Enlaces por rol */}
            {role === 'cliente' && (
                <NavLink
                    to="/mis-favoritos"
                    className={`${mobileLinkBase} text-gray-300 hover:bg-gray-700 hover:text-white`}
                >
                    Mis Favoritos
                </NavLink>
            )}
            {role === 'agente' && (
                <>
                    <NavLink
                        to="/mis-propiedades"
                        className={`${mobileLinkBase} text-gray-300 hover:bg-gray-700 hover:text-white`}
                    >
                        Mis Propiedades
                    </NavLink>
                    <NavLink
                        to="/crear-propiedad"
                        className={`${mobileLinkBase} text-gray-300 hover:bg-gray-700 hover:text-white`}
                    >
                        Crear Propiedad
                    </NavLink>
                </>
            )}
            {role === 'administrador' && (
                <NavLink
                    to="/admin/dashboard"
                    className={`${mobileLinkBase} text-gray-300 hover:bg-gray-700 hover:text-white`}
                >
                    Admin Dashboard
                </NavLink>
            )}

            {/* Logout */}
            <button
                onClick={logout}
                className={`${mobileLinkBase} w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white`}
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Navbar;
