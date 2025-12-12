// /src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // <-- Importación corregida
import Footer from './Footer'; // <-- Importación corregida

const Layout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">
                {/* 'Outlet' renderizará la ruta hija que coincida */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;