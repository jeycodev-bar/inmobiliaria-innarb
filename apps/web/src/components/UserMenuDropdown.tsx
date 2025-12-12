// // /src/components/UserMenuDropdown.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//     FaChevronDown, FaUser, FaSignOutAlt, FaHeart,
//     FaHome, FaTachometerAlt, FaUserShield, FaUserTie, FaUserCircle
// } from 'react-icons/fa';

// // Estilo para los enlaces del menú
// const dropdownLinkClass = "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center";

// // Helper para obtener la info del rol (Icono y Etiqueta)
// const getRoleInfo = (role: 'cliente' | 'agente' | 'administrador') => {
//     switch (role) {
//         case 'administrador':
//             return {
//                 icon: <FaUserShield className="mr-2" />,
//                 label: 'Admin',
//                 color: 'text-red-400'
//             };
//         case 'agente':
//             return {
//                 icon: <FaUserTie className="mr-2" />,
//                 label: 'Agente',
//                 color: 'text-blue-400'
//             };
//         case 'cliente':
//         default:
//             return {
//                 icon: <FaUserCircle className="mr-2" />,
//                 label: 'Cliente',
//                 color: 'text-green-400'
//             };
//     }
// };

// const UserMenuDropdown = () => {
//     const { user, logout } = useAuth();
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     if (!user) return null; // No renderizar nada si no hay usuario

//     const roleInfo = getRoleInfo(user.role);
//     const role = user.role;

//     // Hook para cerrar el menú si se hace clic fuera
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [dropdownRef]);

//     // --- ¡NUEVA FUNCIÓN! ---
//     // Cierra el menú al hacer clic en cualquier opción
//     const handleLinkClick = () => {
//         setIsOpen(false);
//     };

//     return (
//         <div className="relative" ref={dropdownRef}>
//             {/* 1. El botón que abre el menú (AHORA CON ICONO/LABEL DE ROL) */}
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
//             >
//                 {/* --- Icono y Label de Rol --- */}
//                 <span className={`flex items-center ${roleInfo.color}`}>
//                     {roleInfo.icon}
//                     {roleInfo.label}
//                 </span>

//                 <span className="mx-2 text-gray-500">|</span>

//                 {/* --- Nombre y Flecha --- */}
//                 <span>{user.fullName.split(' ')[0]}</span>
//                 <FaChevronDown className={`ml-2 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {/* 2. El panel del menú (AHORA CON onClick EN LOS ENLACES) */}
//             {isOpen && (
//                 <div
//                     className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50" // Añadido z-50
//                     role="menu"
//                 >
//                     {/* --- Enlaces Comunes --- */}
//                     <NavLink
//                         to="/perfil"
//                         className={dropdownLinkClass}
//                         onClick={handleLinkClick} // <-- Cierra al clic
//                     >
//                         <FaUser className="mr-3" /> Perfil
//                     </NavLink>

//                     {/* --- Enlaces Dinámicos por Rol --- */}
//                     {role === 'cliente' && (
//                         <NavLink
//                             to="/mis-favoritos"
//                             className={dropdownLinkClass}
//                             onClick={handleLinkClick} // <-- Cierra al clic
//                         >
//                             <FaHeart className="mr-3" /> Mis Favoritos
//                         </NavLink>
//                     )}

//                     {role === 'agente' && (
//                         <>
//                             <NavLink
//                                 to="/mis-propiedades"
//                                 className={dropdownLinkClass}
//                                 onClick={handleLinkClick} // <-- Cierra al clic
//                             >
//                                 <FaHome className="mr-3" /> Mis Propiedades
//                             </NavLink>
//                             <NavLink
//                                 to="/crear-propiedad"
//                                 className={dropdownLinkClass}
//                                 onClick={handleLinkClick} // <-- Cierra al clic
//                             >
//                                 <FaHome className="mr-3" /> Crear Propiedad
//                             </NavLink>
//                         </>
//                     )}

//                     {role === 'administrador' && (
//                         <NavLink
//                             to="/admin/dashboard"
//                             className={dropdownLinkClass}
//                             onClick={handleLinkClick} // <-- Cierra al clic
//                         >
//                             <FaTachometerAlt className="mr-3" /> Admin Dashboard
//                         </NavLink>
//                     )}

//                     {/* --- Cerrar Sesión --- */}
//                     <button
//                         onClick={() => {
//                             logout();
//                             handleLinkClick(); // <-- Cierra al clic
//                         }}
//                         className={`${dropdownLinkClass} text-red-600`}
//                         role="menuitem"
//                     >
//                         <FaSignOutAlt className="mr-3" /> Cerrar Sesión
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserMenuDropdown;

// /src/components/UserMenuDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaChevronDown, FaUser, FaSignOutAlt, FaHeart,
    FaHome, FaTachometerAlt, FaUserShield, FaUserTie, FaUserCircle
} from 'react-icons/fa';

// Estilo base para los enlaces del menú
const dropdownLinkBaseClass = "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 flex items-center transition-colors duration-150";
// Estilo para el enlace ACTIVO
const dropdownLinkActiveClass = "bg-cyan-200 text-blue-700 font-semibold"; // Fondo azul claro, texto azul oscuro y negrita

// Helper para obtener la info del rol (Icono y Etiqueta)
const getRoleInfo = (role: 'cliente' | 'agente' | 'administrador') => {
    switch (role) {
        case 'administrador':
            return {
                icon: <FaUserShield className="mr-2" />,
                label: 'Admin',
                color: 'text-red-400'
            };
        case 'agente':
            return {
                icon: <FaUserTie className="mr-2" />,
                label: 'Agente',
                color: 'text-blue-400'
            };
        case 'cliente':
        default:
            return {
                icon: <FaUserCircle className="mr-2" />,
                label: 'Cliente',
                color: 'text-green-400'
            };
    }
};

const UserMenuDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    if (!user) return null; // No renderizar nada si no hay usuario

    const roleInfo = getRoleInfo(user.role);
    const role = user.role;

    // Hook para cerrar el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    // Cierra el menú al hacer clic en cualquier opción
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 1. El botón que abre el menú (CON ICONO/LABEL DE ROL) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
                {/* --- Icono y Label de Rol --- */}
                <span className={`flex items-center ${roleInfo.color}`}>
                    {roleInfo.icon}
                    {roleInfo.label}
                </span>

                <span className="mx-2 text-gray-500">|</span>

                {/* --- Nombre y Flecha --- */}
                <span>{user.fullName.split(' ')[0]}</span>
                <FaChevronDown className={`ml-2 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 2. El panel del menú (CON ESTILOS ACTIVOS) */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                >
                    {/* --- Enlace Perfil --- */}
                    <NavLink
                        to="/perfil"
                        className={({ isActive }) =>
                            `${dropdownLinkBaseClass} ${isActive ? dropdownLinkActiveClass : ''}`
                        }
                        onClick={handleLinkClick}
                        role="menuitem"
                    >
                        <FaUser className="mr-3" /> Perfil
                    </NavLink>

                    {/* --- Enlaces Dinámicos por Rol --- */}
                    {role === 'cliente' && (
                        <NavLink
                            to="/mis-favoritos"
                            className={({ isActive }) =>
                                `${dropdownLinkBaseClass} ${isActive ? dropdownLinkActiveClass : ''}`
                            }
                            onClick={handleLinkClick}
                            role="menuitem"
                        >
                            <FaHeart className="mr-3" /> Mis Favoritos
                        </NavLink>
                    )}

                    {role === 'agente' && (
                        <>
                            <NavLink
                                to="/mis-propiedades"
                                className={({ isActive }) =>
                                    `${dropdownLinkBaseClass} ${isActive ? dropdownLinkActiveClass : ''}`
                                }
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                <FaHome className="mr-3" /> Mis Propiedades
                            </NavLink>
                            <NavLink
                                to="/crear-propiedad"
                                className={({ isActive }) =>
                                    `${dropdownLinkBaseClass} ${isActive ? dropdownLinkActiveClass : ''}`
                                }
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                <FaHome className="mr-3" /> Crear Propiedad
                            </NavLink>
                        </>
                    )}

                    {role === 'administrador' && (
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `${dropdownLinkBaseClass} ${isActive ? dropdownLinkActiveClass : ''}`
                            }
                            onClick={handleLinkClick}
                            role="menuitem"
                        >
                            <FaTachometerAlt className="mr-3" /> Admin Dashboard
                        </NavLink>
                    )}

                    {/* --- Cerrar Sesión --- */}
                    <button
                        onClick={() => {
                            logout();
                            handleLinkClick(); // <-- Cierra al clic
                        }}
                        className={`${dropdownLinkBaseClass} text-red-600 hover:bg-rose-200`} // Estilo hover rojo claro
                        role="menuitem"
                    >
                        <FaSignOutAlt className="mr-3" /> Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenuDropdown;