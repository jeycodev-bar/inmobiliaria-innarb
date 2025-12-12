// // /src/pages/LoginPage.tsx
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { loginUser } from '../services/authService.js';
// import { useNavigate, Link } from 'react-router-dom';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         try {
//             const { token, user } = await loginUser({ email, password });
//             login(token, user); // Guardamos en el contexto
//             navigate('/dashboard'); // Redirigimos al dashboard (o '/')
//         } catch (err: any) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div className="flex h-screen items-center justify-center bg-gray-100">
//             <form
//                 onSubmit={handleSubmit}
//                 className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
//             >
//                 {/*Logo + Marca */}
//                 <div className="flex flex-col items-center mb-10">
//                     <img
//                         src="/logo.webp" // coloca aquí la ruta de tu logo
//                         alt="Logo"
//                         className="w-40 h-40 object-contain mb-2"
//                     />
//                     <h2 className="text-3xl font-semibold font-rubik text-pink-600 tracking-wide">
//                         Innarb
//                     </h2>
//                 </div>

//                 <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
//                     Iniciar Sesión
//                 </h1>
//                 {error && (
//                     <p className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
//                         {error}
//                     </p>
//                 )}
//                 <div className="mb-4">
//                     <label className="mb-2 block text-gray-700" htmlFor="email">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         id="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                 </div>
//                 <div className="mb-6">
//                     <label className="mb-2 block text-gray-700" htmlFor="password">
//                         Contraseña
//                     </label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full rounded bg-blue-600 py-3 text-white transition duration-300 hover:bg-blue-700"
//                 >
//                     Entrar
//                 </button>
//                 <p className="mt-4 text-center">
//                     ¿No tienes cuenta?{' '}
//                     <Link to="/register" className="text-blue-600 hover:underline">
//                         Regístrate aquí
//                     </Link>
//                 </p>
//             </form>
//         </div>
//     );
// };
// export default LoginPage;





// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { loginUser } from '../services/authService';
// // 1. Importa useLocation para la redirección inteligente
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// // 2. Importa tu nuevo componente de input
// import FloatingLabelInput from '../components/FloatingLabelInput';
// import { FaSignInAlt } from 'react-icons/fa';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false); // Estado de carga

//     const { login } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();

//     // 3. Redirección Inteligente: Obtenemos la ruta de origen o usamos '/dashboard' por defecto
//     const from = location.state?.from?.pathname || '/dashboard';

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setIsLoading(true);
//         try {
//             const { token, user } = await loginUser({ email, password });
//             login(token, user);
//             // Redirigimos al usuario a la página que intentaba visitar
//             navigate(from, { replace: true });
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* Columna Izquierda: Imagen (Oculta en móviles) */}
//             <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/login-photo.png')" }}>
//                 <div className="flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-60 p-12 text-white">
//                     <div>
//                         <h1 className="text-4xl font-bold">Bienvenido de Nuevo</h1>
//                         <p className="mt-4 text-lg">Accede a tu cuenta para gestionar tus propiedades y descubrir nuevas oportunidades.</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Columna Derecha: Formulario */}
//             <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
//                 <div className="w-full max-w-md">
//                     {/* Logo + Marca */}
//                     {/* <div className="mb-8 flex flex-col items-center text-center">
//                         <Link to="/">
//                             <img
//                                 src="/logo.webp"
//                                 alt="Logo de Innarb"
//                                 className="w-24 h-24 object-contain"
//                                 loading="lazy"
//                             />
//                         </Link>
//                         <h2 className="mt-2 text-3xl font-bold font-rubik text-gray-800 tracking-wide">
//                             Iniciar Sesión en Innarb
//                         </h2>
//                     </div> */}

//                     <form
//                         onSubmit={handleSubmit}
//                         className="space-y-6 rounded-lg bg-white p-8 shadow-lg"
//                     >
//                         {/*Logo + Marca */}
//                         <div className="flex flex-col items-center mb-10">
//                             <img
//                                 src="/logo.webp" // coloca aquí la ruta de tu logo
//                                 alt="Logo"
//                                 className="w-40 h-40 object-contain mb-2"
//                             />
//                             <h2 className="text-3xl font-semibold font-rubik text-pink-600 tracking-wide">
//                                 Innarb
//                             </h2>
//                         </div>
//                         <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
//                             Iniciar Sesión
//                         </h1>
//                         {error && (
//                             <p className="rounded bg-red-100 p-3 text-center text-sm text-red-700">
//                                 {error}
//                             </p>
//                         )}
                        
//                         {/* 4. Usando el FloatingLabelInput */}
//                         <FloatingLabelInput
//                             id="email"
//                             label="Correo Electrónico"
//                             type="email"
//                             name="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                         <FloatingLabelInput
//                             id="password"
//                             label="Contraseña"
//                             type="password"
//                             name="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />

//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition duration-300 hover:bg-blue-700 disabled:bg-gray-400"
//                         >
//                             <FaSignInAlt />
//                             {isLoading ? 'Ingresando...' : 'Entrar'}
//                         </button>

//                         <p className="mt-6 text-center text-sm">
//                             ¿No tienes cuenta?{' '}
//                             <Link to="/register" className="font-medium text-blue-600 hover:underline">
//                                 Regístrate aquí
//                             </Link>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;




// /src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FloatingLabelInput from '../components/FloatingLabelInput';
import FloatingContactButton from '../components/FloatingContactButton'; // <-- Botón flotante de contacto
import { FaSignInAlt, FaArrowLeft } from 'react-icons/fa'; // <-- Iconos adicionales

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirección inteligente: vuelve a la página anterior o al dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { token, user } = await loginUser({ email, password });
            login(token, user);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-radial-greenight">
            {/* Columna Izquierda: Imagen (oculta en móviles) */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/login-photo.png')" }}
            >
                <div className="flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-60 p-12 text-white">
                    <div>
                        <h1 className="text-4xl text-green-300 font-prevol font-bold">Bienvenido de Nuevo</h1>
                        <p className="mt-4 text-lg">
                            Accede a tu cuenta para gestionar tus propiedades y descubrir nuevas oportunidades.
                        </p>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="relative flex w-full items-center justify-center p-4 lg:w-1/2">
                {/* Botón "Volver al Inicio" */}
                <Link
                    to="/"
                    className="absolute top-4 left-4 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors z-10"
                >
                    <FaArrowLeft />
                    Volver al Inicio
                </Link>

                <div className="w-full max-w-md">
                    {/* Logo + Marca */}
                    <div className="flex flex-col items-center mb-10">
                        <img
                            src="/logo.webp"
                            alt="Logo"
                            className="w-40 h-40 object-contain mb-2"
                        />
                        <h2 className="text-3xl font-semibold font-rubik text-pink-600 tracking-wide">
                            Innarb
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-lg bg-white p-8 shadow-lg"
                    >
                        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                            Iniciar Sesión
                        </h1>

                        {error && (
                            <p className="rounded bg-red-100 p-3 text-center text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        {/* Inputs flotantes */}
                        <FloatingLabelInput
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <FloatingLabelInput
                            id="password"
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition duration-300 hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            <FaSignInAlt />
                            {isLoading ? 'Ingresando...' : 'Entrar'}
                        </button>

                        {/* Enlace de registro */}
                        <p className="mt-6 text-center text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Botón Flotante de Contacto */}
            <FloatingContactButton />
        </div>
    );
};

export default LoginPage;
