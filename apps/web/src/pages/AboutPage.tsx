import TeamMemberCard from '../components/TeamMemberCard.js'; // Ajusta la ruta si es necesario
import { FaHandshake, FaEye, FaStar, FaBalanceScale, FaLightbulb, FaLeaf, FaUsers } from 'react-icons/fa';

// Definimos un tipo para los miembros del equipo para mayor seguridad de tipos
export interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    socials?: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
    };
}
interface ValueItem {
    title: string;
    description: string;
    icon: React.ElementType;
}

export default function AboutPage() {
    // Datos del equipo actualizados con la información relevante
    const team: TeamMember[] = [
        {
            name: 'Yeico B. Barrientos V.',
            role: 'Gerente General',
            image: '/team/ceo.jpg',
            bio: 'Especialista en gestión de proyectos, con enfoque en innovación, eficiencia y liderazgo técnico.',
            socials: {
                linkedin: 'https://www.linkedin.com/in/yeico-branny-barrientos-vila-087445243',
                facebook: 'https://www.facebook.com/Jacob.bbv',
                instagram: 'https://www.instagram.com/',
            }
        },
        {
            name: 'Huder De-la-cruz V.',
            role: 'Director de Ventas',
            image: '/team/sales.webp',
            bio: 'Arquitecto con visión contemporánea. Diseña espacios funcionales y estéticos que reflejan identidad local.',
            socials: {
                linkedin: 'https://linkedin.com/in/huder-delacruz',
                instagram: 'https://instagram.com/huder-delacruz',
                facebook: 'https://facebook.com/',
            }
        },
        {
            name: 'Rouss R. Mendieta B.',
            role: 'Jefa de Operaciones',
            image: '/team/ops.webp',
            bio: 'Estratega comercial con enfoque en la experiencia del cliente. Dirige campañas y asesoría personalizada.',
            socials: {
                linkedin: 'https://linkedin.com/in/Megan',
                instagram: 'https://instagram.com/',
                facebook: 'https://facebook.com/',
            }
        },
    ];


    const companyValues: ValueItem[] = [
        {
            title: "Calidad",
            description: "Superamos estándares en cada proyecto.",
            icon: FaStar,
        },
        {
            title: "Integridad",
            description: "Actuamos siempre con ética y transparencia.",
            icon: FaBalanceScale,
        },
        {
            title: "Innovación",
            description: "Buscamos nuevas ideas para crear mejores soluciones.",
            icon: FaLightbulb,
        },
        {
            title: "Sostenibilidad",
            description: "Comprometidos con el medio ambiente y el futuro.",
            icon: FaLeaf,
        },
        {
            title: "Cliente",
            description: "Ellos son el centro de todo lo que hacemos.",
            icon: FaUsers,
        },
        // 👉 aquí puedes seguir agregando más valores fácilmente
    ];

    return (
        <div className="bg-slate-900 text-white">
            {/* Sección ¿Quiénes Somos? con el estilo del HTML */}
            <section className="relative pt-10 pb-28 text-center bg-radial-cyabl overflow-hidden">
                <div className="container mx-auto px-6">
                    <h1 className="text-6xl font-prevol font-bold text-gold-500 mb-6">Sobre InmoApp</h1>
                    <div className="grid md:grid-cols-3 items-center gap-8">
                        <div className="hidden md:block">
                            <img src="/contrato-familia.webp" alt="Familia firmando contrato" className="rounded-lg shadow-xl opacity-80" />
                        </div>
                        <p className="text-lg text-gray-300 max-w-3xl mx-auto md:col-span-1">
                            Somos más que una inmobiliaria; somos tus socios en la búsqueda del lugar perfecto. Fundada con la pasión por conectar personas y propiedades, nuestra misión es hacer que el proceso de compra, venta o alquiler sea una experiencia transparente, segura y gratificante.
                        </p>
                        <div className="hidden md:block">
                            <img src="/condominio-moderno.webp" alt="Familia feliz con su nueva casa" className="rounded-lg shadow-xl opacity-80" />
                        </div>
                    </div>
                </div>
                {/* Onda SVG divisoria */}
                <div className="absolute bottom-0 left-0 w-full leading-[0]">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-24">
                        <path d="M0,60 C150,180 350,0 500,60 L500,150 L0,150 Z" style={{ stroke: 'none', fill: '#111827' }}></path>
                    </svg>
                </div>
            </section>

            {/* Sección Misión, Visión, Valores con iconos */}
            <section className="bg-[linear-gradient(to_top,_#003734ff_0%,_#004666ff_25%,_#0f172a_60%)] py-10">
                <div className="container mx-auto px-6">
                    <h2 className="text-5xl font-prevol text-green-400 mb-10 text-center">Nuestra Visión y Misión</h2>
                    <div className="grid md:grid-cols-2 gap-12 mb-16">
                        <div className="bg-radial-turk p-3 rounded-lg text-center shadow-lg">
                            <FaHandshake className="text-gold-500 text-5xl mx-auto mb-1" />
                            <h2 className="text-3xl font-bold text-gold-500 mb-3">Misión</h2>
                            <p className="text-gray-400">Facilitar el encuentro entre personas y sus futuros hogares a través de un servicio excepcional, tecnología de punta y un equipo humano comprometido.</p>
                        </div>
                        <div className="bg-radial-turk p-3 rounded-lg text-center shadow-lg">
                            <FaEye className="text-gold-500 text-5xl mx-auto mb-1" />
                            <h2 className="text-3xl font-bold text-gold-500 mb-3">Visión</h2>
                            <p className="text-gray-400">Ser la plataforma inmobiliaria líder y de mayor confianza, reconocida por nuestra innovación, integridad y el impacto positivo en la vida de nuestros clientes.</p>
                        </div>
                    </div>

                    {/* <div className="text-center">
                        <h2 className="text-5xl font-prevol text-green-400 mb-10">Nuestros Valores</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {renderValue("<b>Calidad:</b> Superamos estándares en cada proyecto.", FaStar)}
                            {renderValue("Integridad", FaBalanceScale)}
                            {renderValue("Innovación", FaLightbulb)}
                            {renderValue("Sostenibilidad", FaLeaf)}
                            {renderValue("Cliente", FaUsers)}
                        </div>
                    </div> */}
                    <div className="text-center">
                        <h2 className="text-5xl font-prevol text-green-400 mb-10 font-bold">
                            Nuestros Valores
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {companyValues.map((item) => (
                                <div key={item.title} className="flex flex-col items-center text-center">
                                    <item.icon className="text-4xl text-gold-400 mb-4" />
                                    <h3 className="font-bold text-yellow-200 text-lg">{item.title}</h3>
                                    <p className="text-slate-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Sección Conoce a Nuestro Equipo */}
            <section className="container mx-auto px-6 bg-[linear-gradient(to_bottom,#003734ff,#0f172a)] py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-5xl font-prevol text-green-400 mb-4">Conoce a Nuestro Equipo</h2>
                    <p className="text-gray-400 mb-12">
                        Nuestro equipo está compuesto por profesionales apasionados y dedicados a transformar sueños en realidad. Cada miembro aporta su experiencia y compromiso para garantizar que cada proyecto se ejecute con excelencia.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member) => (
                        <TeamMemberCard key={member.name} member={member} />
                    ))}
                </div>
            </section>
        </div>
    );
}

// Función helper para renderizar los valores y evitar repetición
// function renderValue(text: string, IconComponent: React.ElementType) {
//     return (
//         <div className="flex flex-col items-center">
//             <IconComponent className="text-gold-500 text-4xl mb-2" />
//             <p className="font-bold text-gray-300">{text}</p>
//         </div>
//     );
// }