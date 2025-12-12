// /src/pages/HomePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../services/propertyService';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { toast } from 'react-toastify';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState('');
    const swiperRef = useRef<SwiperInstance | null>(null);
    const navigate = useNavigate();

    // Cargar propiedades destacadas
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                // Pedimos las propiedades (la API ya las ordena por fecha)
                // Limitamos a 6 para el carrusel en el frontend o backend según prefieras
                const allProperties = await getProperties({ limit: '6' }); 
                setFeaturedProperties(allProperties);
            } catch (error: any) {
                console.error("Error al cargar propiedades destacadas:", error);
                toast.error("No se pudieron cargar las propiedades destacadas.");
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCity.trim()) {
            navigate('/propiedades');
        } else {
            navigate(`/propiedades?city=${encodeURIComponent(searchCity)}`);
        }
    };

    return (
        <div className="flex flex-col">
            {/* --- 1. Sección Hero con Video y Búsqueda --- */}
            <section className="relative h-screen min-h-[500px] flex flex-col justify-center items-center text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
                <video
                    src="/team/hero-video.mp4" // Ruta corregida a /team/
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 z-0 object-cover"
                ></video>

                <div className="relative z-20 text-center container mx-auto px-4">
                    <img src="/logo.webp" alt="InmoApp Logo" className="h-32 md:h-48 mx-auto mb-4 object-contain" />
                    <h1 className="text-5xl md:text-7xl font-bold font-rubik text-gold-500 tracking-widest drop-shadow-lg">
                        Innarb Corp
                    </h1>
                    <p className="text-xl md:text-2xl mt-4 font-prevol drop-shadow-md">Tu Hogar Ideal te Espera</p>

                    {/* Barra de Búsqueda Integrada */}
                    <form
                        onSubmit={handleSearch}
                        className="mx-auto mt-8 flex w-full max-w-xl rounded-full bg-white p-2 shadow-2xl"
                    >
                        <input
                            type="text"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            placeholder="¿En qué ciudad buscas? (ej. Lima)"
                            className="w-full bg-transparent px-6 text-gray-700 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="flex items-center rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                        >
                            <FaSearch className="mr-2" /> Buscar
                        </button>
                    </form>
                </div>
            </section>

            {/* --- 2. Sección de Propuesta de Valor (Tarjetas con brillo) --- */}
            <section className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {/* Card 1: Confianza */}
                    <div className="flex flex-col items-center p-4 border-2 border-cyan-300 rounded-lg shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-transform hover:-translate-y-2">
                        <svg className="w-16 h-16 text-gold-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-rose-200 mb-2">Confianza y Seguridad</h3>
                        <p className="text-gray-400">
                            Te acompañamos en cada paso del proceso con total transparencia y profesionalismo, asegurando tu tranquilidad.
                        </p>
                    </div>
                    {/* Card 2: Calidad */}
                    <div className="flex flex-col items-center p-4 border-2 border-orange-400 rounded-lg shadow-[0_0_40px_rgba(255,126,95,0.4)] transition-transform hover:-translate-y-2">
                        <svg className="w-16 h-16 text-gold-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M17 3h4M19 5v-2m-3.5 4.5l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-rose-200 mb-2">Propiedades de Calidad</h3>
                        <p className="text-gray-400">
                            Seleccionamos cuidadosamente cada propiedad de nuestro catálogo para garantizar los más altos estándares.
                        </p>
                    </div>
                    {/* Card 3: Asesoría */}
                    <div className="flex flex-col items-center p-4 border-2 border-green-400 rounded-lg shadow-[0_0_40px_rgba(74,222,128,0.4)] transition-transform hover:-translate-y-2">
                        <svg className="w-16 h-16 text-gold-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-rose-200 mb-2">Asesoría Personalizada</h3>
                        <p className="text-gray-400">
                            Nuestro equipo de expertos está listo para entender tus necesidades y guiarte hacia la mejor decisión.
                        </p>
                    </div>
                </div>
            </section>

            {/* Divisor con onda */}
            <div className="relative">
                <svg className="absolute top-0 left-0 w-full z-0" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-slate-900" d="M0,64L48,85.3C96,107,192,149,288,160C384,171,480,149,576,160C672,171,768,213,864,208C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192V0H0Z" />
                </svg>
            </div>

            {/* --- 3. Sección Carrusel de Propiedades (Swiper) --- */}
            <section className="bg-radial-turk pt-32 pb-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="relative text-green-500 text-5xl md:text-6xl font-prevol text-center mb-12">Propiedades Nuevas</h2>
                    
                    {loading && <p className="text-center text-lg text-gray-600">Cargando destacados...</p>}
                    
                    {!loading && featuredProperties.length > 0 ? (
                        <Swiper
                            // onSwiper={(swiper) => { swiperRef.current = swiper; }}
                            onSwiper={(swiper: SwiperInstance) => { swiperRef.current = swiper; }}
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={featuredProperties.length > 3} // Solo loop si hay suficientes items
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="pb-12" // Espacio para la paginación
                        >
                            {featuredProperties.map(prop => (
                                <SwiperSlide key={prop.id} className="h-auto">
                                    {/* Usamos nuestro PropertyCard robusto */}
                                    <PropertyCard property={prop} /> 
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : !loading && (
                        <p className="text-center text-gray-500">No hay propiedades destacadas en este momento.</p>
                    )}
                </div>
            </section>

            {/* --- 4. Sección de Llamada a la Acción (CTA) --- */}
            <section className="bg-[linear-gradient(to_bottom,_#cbd5e1_0%,_#cbd5e1_25%,_#0f172a_60%)]">

                <div className="relative">
                    <svg
                        className="absolute bottom-0 right-0 w-full z-0 rotate-180"
                        viewBox="0 0 1440 320"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            //fill="#003e4fff"
                            className="fill-slate-300"
                            d="M0,64L48,85.3C96,107,192,149,288,160C384,171,480,149,576,160C672,171,768,213,864,208C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192V0H0Z"
                        />
                    </svg>
                </div>

                <div className="container mx-auto px-6 pb-10 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Columna Izquierda: Texto */}
                    <div className="text-white text-center md:text-left">
                        <h2 className="text-5xl md:text-6xl text-green-400 font-bold font-prevol mb-6">
                            ¿Listo para encontrar tu <span className="text-gold-500">Nuevo Hogar</span>?
                        </h2>
                        <p className="text-cyan-900 text-lg mb-8 leading-relaxed md:text-gray-300">
                            Nuestro catálogo se actualiza constantemente con las mejores oportunidades del mercado. Explora todas las opciones que tenemos para ti y da el primer paso hacia la casa de tus sueños.
                        </p>
                        <Link
                            to="/propiedades"
                            className="inline-flex items-center gap-2 bg-gold-600 text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-gold-500 transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                        >
                            Explorar Propiedades <FaArrowRight />
                        </Link>
                    </div>
                    
                    {/* Columna Derecha: Imagen */}
                    <div className="flex items-center justify-center">
                        <img
                            src="/casa-campo-dama.webp"
                            alt="Interior de una casa moderna"
                            loading="lazy"
                            className="max-w-full md:max-w-[400px] h-auto block drop-shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}