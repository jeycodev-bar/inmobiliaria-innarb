import { useState } from 'react';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { BsChatDotsFill } from 'react-icons/bs'; // Icono principal
import { IoClose } from 'react-icons/io5'; // Icono de 'X' para cerrar

export default function FloatingContactButton() {
    const [isOpen, setIsOpen] = useState(false);

    // Define aquí tus enlaces y números
    const whatsappUrl = `https://wa.me/51967323050?text=Hola,%20quisiera%20más%20información.`;
    const messengerUrl = `https://m.me/tuUsuarioDeFacebook`; // Reemplaza con tu usuario de Messenger

    return ( //bottom-6 right-6
        <div className="fixed bottom-14 right-8 z-40">
            {/* Contenedor para los botones secundarios que se animarán */}
            <div className="flex flex-col items-center space-y-2">

                {/* Botón de Messenger */}
                <a
                    href={messengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-all duration-300 ease-in-out bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-90 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'}`}
                >
                    <FaFacebookMessenger className="w-6 h-6" />
                </a>

                {/* Botón de WhatsApp */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-all duration-300 ease-in-out bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 active:scale-90 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'}`}
                >
                    <FaWhatsapp className="w-6 h-6" />
                </a>
            </div>

            {/* Botón Principal (el que siempre se ve) */}
            <button
                onClick={() => setIsOpen(!isOpen)} //w-16 h-16
                className="mt-2 w-12 h-12 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 transform hover:scale-110
                        flex items-center justify-center"
                aria-label="Abrir opciones de contacto"
            >
                {/* Cambia de ícono dependiendo si está abierto o cerrado */}
                {isOpen ? <IoClose className="w-9 h-9" /> : <BsChatDotsFill className="w-8 h-8" />}
            </button>
        </div>
    );
}