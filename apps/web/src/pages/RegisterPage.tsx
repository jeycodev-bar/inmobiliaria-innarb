// /src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { registerUser } from '../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            await registerUser({ fullName, email, password, phone });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000); // Redirige al login
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-hero-blob py-12">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
            >
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Crear Cuenta
                </h2>
                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="mb-4 rounded bg-green-100 p-3 text-center text-green-700">
                        ¡Registro exitoso! Redirigiendo al login...
                    </p>
                )}
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700" htmlFor="fullName">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-2 block text-gray-700" htmlFor="phone">
                        Teléfono (Opcional)
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded bg-blue-600 py-3 text-white transition duration-300 hover:bg-blue-700"
                >
                    Registrarse
                </button>
                <p className="mt-4 text-center">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
};
export default RegisterPage;