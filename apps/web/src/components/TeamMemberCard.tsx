import { useState } from 'react';
import type { TeamMember } from '../pages/AboutPage'; // Importamos el tipo desde la página principal

//1. Importamos los iconos para las redes sociales
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

interface TeamMemberCardProps {
    member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
    // Tu lógica para mostrar/ocultar detalles (se conserva intacta)
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    return (
        //2. Añadimos la clase 'group' al contenedor principal para activar el efecto hover en los hijos
        <div className="bg-transparent border border-white/20 rounded-xl p-6 text-center w-full max-w-sm mx-auto shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2">

            {/*3. Envolvemos la imagen en un 'div' con 'relative' para posicionar el overlay de iconos */}
            <div className="relative w-32 h-32 mx-auto mb-4 group">
                <img
                    src={member.image}
                    alt={`Foto de ${member.name}`}
                    className="w-full h-full rounded-full object-cover border-4 border-gold-500"
                />

                {/*4. Aquí está el overlay con los iconos que aparece al hacer hover sobre el 'group' */}
                <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Renderizamos cada icono solo si el enlace existe en los datos */}
                    {member.socials?.linkedin && (
                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-400 text-2xl transition-colors">
                            <FaLinkedin />
                        </a>
                    )}
                    {member.socials?.facebook && (
                        <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-400 text-2xl transition-colors">
                            <FaFacebook />
                        </a>
                    )}
                    {member.socials?.instagram && (
                        <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-400 text-2xl transition-colors">
                            <FaInstagram />
                        </a>
                    )}
                </div>
            </div>

            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-gold-400 mb-4">{member.role}</p>

            {/* Tu botón para mostrar/ocultar detalles (se conserva intacto) */}
            <button
                onClick={toggleDetails}
                className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-1 px-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
                {isDetailsVisible ? 'Ocultar Detalles' : 'Mostrar Detalles'}
            </button>

            {/* Tus detalles que se expanden/colapsan (se conservan intactos) */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isDetailsVisible ? 'max-h-40 mt-4' : 'max-h-0'}`}
            >
                <p className="text-gray-400 text-sm">
                    {member.bio}
                </p>
            </div>
        </div>
    );
}