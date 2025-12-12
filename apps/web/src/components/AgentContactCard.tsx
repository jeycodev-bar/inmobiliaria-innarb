// /src/components/AgentContactCard.tsx
import React from 'react';
import { FaUserCircle, FaWhatsapp } from 'react-icons/fa';

interface AgentContactCardProps {
    agentName: string;
    agentPhone: string | null | undefined; // Puede ser null o undefined desde la API
    propertyName: string;
}

const AgentContactCard: React.FC<AgentContactCardProps> = ({ agentName, agentPhone, propertyName }) => {

    // Función para construir el enlace de WhatsApp
    const getWhatsAppLink = () => {
        if (!agentPhone) return null;

        // Limpiar y formatear número (asume formato local +51XXXXXXXXX o XXXXXXXXX)
        // Necesitarás ajustar esto si tus números tienen formatos diferentes
        let phoneNumber = agentPhone.replace(/\D/g, ''); // Quita todo lo que no sea dígito
        if (phoneNumber.length === 9) { // Asume número peruano sin código de país
            phoneNumber = `51${phoneNumber}`;
        } else if (phoneNumber.startsWith('51') && phoneNumber.length === 11) {
            // Ya tiene código de país, no hacer nada
        } else {
            console.warn("Número de teléfono del agente no tiene formato esperado:", agentPhone);
            return null; // O devuelve un enlace genérico si prefieres
        }


        const message = `Hola ${agentName.split(' ')[0]}, estoy interesado/a en la propiedad "${propertyName}". ¿Podría darme más información?`;
        const encodedMessage = encodeURIComponent(message);

        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    };

    const whatsappLink = getWhatsAppLink();

    return ( //p-6
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Contactar Agente</h3>
            <div className="mb-4 flex items-center gap-3">
                <FaUserCircle className="h-10 w-10 text-gray-400" />
                <div>
                    <p className="font-medium text-gray-900">{agentName || 'Agente Asignado'}</p>
                    <p className="text-sm text-gray-500">Agente Inmobiliario</p>
                </div>
            </div>

            {whatsappLink ? (
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-3 font-semibold text-white transition duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                    <FaWhatsapp className="h-5 w-5" />
                    Contactar
                </a>
            ) : (
                <p className="text-sm text-gray-500 italic">
                    El número de contacto del agente no está disponible.
                </p>
            )}
        </div>
    );
};

export default AgentContactCard;