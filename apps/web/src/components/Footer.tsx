// // /src/components/Footer.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//     return (
//         <footer className="bg-gray-800 text-gray-300">
//             <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//                 <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//                     {/* Sobre Nosotros */}
//                     <div>
//                         <h3 className="text-xl font-bold text-white">INNARB</h3>
//                         <p className="mt-4 text-sm">
//                             Tu socio ideal para encontrar la propiedad de tus sueños. Calidad,
//                             confianza y el mejor servicio.
//                         </p>
//                     </div>

//                     {/* Enlaces Rápidos */}
//                     <div>
//                         <h4 className="font-semibold text-white">Enlaces Rápidos</h4>
//                         <ul className="mt-4 space-y-2">
//                             <li>
//                                 <Link to="/propiedades" className="hover:text-white">
//                                     Propiedades
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link to="/nosotros" className="hover:text-white">
//                                     Sobre Nosotros
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link to="/contacto" className="hover:text-white">
//                                     Contacto
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Contacto */}
//                     <div>
//                         <h4 className="font-semibold text-white">Contacto</h4>
//                         <ul className="mt-4 space-y-2">
//                             <li>Email: info@innarb.com</li>
//                             <li>Teléfono: +123 456 7890</li>
//                         </ul>
//                     </div>
//                 </div>

//                 <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
//                     <p>
//                         &copy; {new Date().getFullYear()} Inmobiliaria INNARB. Todos los
//                         derechos reservados.
//                     </p>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaTiktok,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from 'react-icons/fa';

// ✅ Componente reutilizable y tipado para los elementos de contacto
const ContactInfoItem = ({
    icon,
    text,
    href,
}: {
    icon: React.ReactNode;
    text: string;
    href?: string;
}) => (
    <a
        href={href || '#'}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
    >
        <span className="w-5 h-5 flex-shrink-0">{icon}</span>
        <span>{text}</span>
    </a>
);

const Footer: React.FC = () => {
    // Links públicos
    const publicLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Nosotros', path: '/nosotros' },
        { name: 'Propiedades', path: '/propiedades' },
        { name: 'Contacto', path: '/contacto' },
    ];

    // Redes sociales
    const socialLinks = [
        { name: 'Facebook', icon: <FaFacebookF />, url: 'https://facebook.com/yourcompany' },
        { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com/yourcompany' },
        { name: 'YouTube', icon: <FaYoutube />, url: 'https://youtube.com/yourcompany' },
        { name: 'TikTok', icon: <FaTiktok />, url: 'https://tiktok.com/@yourcompany' },
        { name: 'WhatsApp', icon: <FaWhatsapp />, url: 'https://wa.me/51967323050' },
    ];

    // Gmail personalizado
    const emailTo = 'jeycob.dev@gmail.com';
    const emailSubject = 'Consulta Institucional InmoApp';
    const emailBody = 'Hola InmoApp,\n\nQuisiera más información sobre sus servicios.\n\nSaludos.';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(
        emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    return (
        <footer className="bg-radial-cyabl text-white">
            <div className="max-w-7xl mx-auto px-6 py-5 sm:px-8 lg:px-10">
                {/* === GRID PRINCIPAL === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Marca */}
                    <div>
                        <Link to="/" className="flex flex-col items-center md:items-start mb-4">
                            <img
                                src="/logo.webp"
                                alt="Logo de Innarb"
                                loading="lazy"
                                className="h-[90px] w-auto object-contain"
                            />
                            <span className="text-2xl font-bold text-gold-500 font-rubik">
                                Innarb
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Construyendo hogares para el futuro con excelencia, tecnología y calidad.
                        </p>
                    </div>

                    {/* Enlaces */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-300 mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            {publicLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Redes Sociales */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-300 mb-4">Síguenos</h3>
                        <div className="flex space-x-4 text-2xl">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="text-gray-400 hover:text-yellow-400 transition-transform duration-200 hover:scale-110"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-300 mb-4">Contáctanos</h3>
                        <div className="space-y-3 text-sm">
                            <ContactInfoItem
                                icon={<FaMapMarkerAlt />}
                                text="Jr. Asamblea 123, Ayacucho, Perú"
                                href="https://maps.google.com?q=Ayacucho+Peru"
                            />
                            <ContactInfoItem
                                icon={<FaPhoneAlt />}
                                text="+51 967 323 050"
                                href="tel:+51967323050"
                            />
                            <ContactInfoItem
                                icon={<FaEnvelope />}
                                text={emailTo}
                                href={gmailUrl}
                            />
                        </div>
                    </div>
                </div>

                {/* === Línea inferior === */}
                <div className="mt-5 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} InmoApp por{' '}
                        <span className="text-yellow-400 font-semibold">Jacodev</span>. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
