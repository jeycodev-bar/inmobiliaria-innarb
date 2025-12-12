// // /src/pages/ContactPage.tsx
// import React from 'react';
// import { useForm } from '@formspree/react';
// import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

// const ContactPage = () => {
//     // Conectamos Formspree usando la variable de entorno
//     const formId = import.meta.env.VITE_FORMSPREE_ID;
//     const [state, handleSubmit] = useForm(formId);

//     // Mensaje de éxito si el formulario se envió correctamente
//     if (state.succeeded) {
//         return (
//             <div className="container mx-auto max-w-2xl p-4 py-16 text-center">
//                 <FaCheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
//                 <h2 className="text-3xl font-bold text-gray-800">
//                     ¡Mensaje Enviado!
//                 </h2>
//                 <p className="mt-2 text-lg text-gray-600">
//                     Gracias por contactarnos. Te responderemos a la brevedad.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto max-w-3xl p-4 py-12 md:p-8">
//             <div className="rounded-lg bg-white p-8 shadow-md">
//                 <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
//                     Contáctanos
//                 </h1>
//                 <p className="mb-8 text-center text-gray-600">
//                     ¿Tienes alguna pregunta? Completa el formulario y nos pondremos en
//                     contacto.
//                 </p>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Fila 1: Nombre y Email */}
//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                         <div>
//                             <label htmlFor="fullName" className="mb-1 block font-medium text-gray-700">
//                                 Nombre Completo
//                             </label>
//                             <input
//                                 type="text"
//                                 id="fullName"
//                                 name="fullName"
//                                 className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="email" className="mb-1 block font-medium text-gray-700">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Fila 2: Teléfono y Asunto */}
//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                         <div>
//                             <label htmlFor="phone" className="mb-1 block font-medium text-gray-700">
//                                 Teléfono (Opcional)
//                             </label>
//                             <input
//                                 type="tel"
//                                 id="phone"
//                                 name="phone"
//                                 className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="subject" className="mb-1 block font-medium text-gray-700">
//                                 Asunto
//                             </label>
//                             <input
//                                 type="text"
//                                 id="subject"
//                                 name="subject"
//                                 className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Fila 3: Mensaje */}
//                     <div>
//                         <label htmlFor="message" className="mb-1 block font-medium text-gray-700">
//                             Mensaje
//                         </label>
//                         <textarea
//                             id="message"
//                             name="message"
//                             rows={6}
//                             className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         ></textarea>
//                     </div>

//                     {/* Errores de Formspree (si los hay) */}
//                     {state.errors && (
//                         <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
//                             <p>Ocurrió un error. Por favor, revisa los campos.</p>
//                         </div>
//                     )}

//                     {/* Botón de Enviar */}
//                     <div>
//                         <button
//                             type="submit"
//                             disabled={state.submitting}
//                             className="flex w-full items-center justify-center rounded bg-blue-600 px-6 py-3 text-white transition duration-300 hover:bg-blue-700 disabled:bg-gray-400"
//                         >
//                             <FaPaperPlane className="mr-2" />
//                             {state.submitting ? 'Enviando...' : 'Enviar Mensaje'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ContactPage;


// /src/pages/ContactPage.tsx
import { useForm } from '@formspree/react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import React from 'react';
import FloatingContactButton from '../components/FloatingContactButton';

// Componente reutilizable para la información de contacto
const ContactInfoItem = ({ icon, text, href, ariaLabel }: { icon: React.ReactNode, text: string, href?: string, ariaLabel?: string }) => (
    <a
        href={href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-gray-400 hover:text-gold-400 transition-colors"
        aria-label={ariaLabel || text} // Añadido aria-label
    >
        <span className="flex-shrink-0 w-5 h-5">{icon}</span>
        <span>{text}</span>
    </a>
);

export default function ContactPage() {
    // 1. Usar variable de entorno para el ID de Formspree (¡Más seguro!)
    const formId = import.meta.env.VITE_FORMSPREE_ID;
    const [state, handleSubmit] = useForm(formId); // Añadir un fallback opcional si VITE_FORMSPREE_ID no está definido
;
    // 2. Usar enlace mailto: universal
    const emailTo = 'jeycob.dev@gmail.com';
    const emailSubject = 'Consulta Institucional InmoApp';
    const emailBody = 'Hola InmoApp,\n\nQuisiera más información sobre sus servicios.\n\nSaludos.';
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Mensaje de éxito
    if (state.succeeded) {
        return (
            <div className="container mx-auto p-8 text-center py-40">
                <FaCheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h1 className="text-3xl font-bold text-green-500">¡Gracias por tu mensaje!</h1>
                <p className="mt-4 text-lg">Nos pondremos en contacto contigo muy pronto.</p>
            </div>
        );
    }

    return (
        <>
            <div className="container bg-hero-iluminary bg-cover bg-center mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-prevol text-green-400 font-bold">Contáctanos</h1>
                    <p className="text-lg text-white mt-2">¿Quieres vender tu propiedad? Llena el formulario y nuestro equipo te contactará.</p>
                </div>

                <div className="max-w-3xl mx-auto gap-12 bg-white p-8 rounded-lg shadow-xl">
                    {/* Columna Izquierda: Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input id="name" type="text" name="name" required className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input id="email" type="email" name="email" required className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                            <input id="phone" type="tel" name="phone" className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        {/* 3. Campo "Asunto" añadido de nuevo */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
                            <input id="subject" type="text" name="subject" required className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                            <textarea id="message" name="message" rows={4} required className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>

                        {/* 4. Mostrar errores de validación de Formspree */}
                        {state.errors && (
                            <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                                <p>Ocurrió un error al enviar el formulario. Por favor, revisa los campos e intenta de nuevo.</p>
                                {/* Opcional: Mostrar errores específicos por campo si Formspree los provee */}
                            </div>
                        )}

                        <button type="submit" disabled={state.submitting} className="w-full py-3 px-4 bg-gold-600 text-white font-bold rounded-md hover:bg-gold-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                            <FaPaperPlane />
                            {state.submitting ? 'Enviando...' : 'Enviar Mensaje'}
                        </button>
                    </form>

                    {/* Columna Derecha: Información de Contacto */}
                    {/* <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">Información Directa</h3>
                        <div className="space-y-4">
                            <ContactInfoItem
                                icon={<FaMapMarkerAlt />}
                                text="Jr. Asamblea 123, Ayacucho"
                                href="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3597.216356872145!2d-74.22445070898398!3d-13.149251910563454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91127df908ad3b23%3A0x9146a724360bcb70!2sBiblioteca%20Central!5e0!3m2!1ses-419!2spe!4v1759874693379!5m2!1ses-419!2spe" // <-- VERIFICAR URL
                                ariaLabel="Ver ubicación en Google Maps"
                            />
                            <ContactInfoItem
                                icon={<FaPhoneAlt />}
                                text="+51 967 323 050"
                                href="tel:+51967323050"
                                ariaLabel="Llamar al +51 967 323 050"
                            />
                            <ContactInfoItem
                                icon={<FaEnvelope />}
                                text={emailTo}
                                href={mailtoUrl}
                                ariaLabel={`Enviar correo a ${emailTo}`}
                            />
                        </div>
                    </div> */}
                </div>

                {/* Sección del Mapa */}
                <section className="mt-16">
                    <h2 className="text-5xl font-prevol text-green-400 text-center mb-6 font-bold">Nuestra Ubicación</h2>
                    <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl border-4 border-gray-200">
                        <iframe
                            title="Ubicación de Innarb en Google Maps" // Añadido title para accesibilidad
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3597.216356872145!2d-74.22445070898398!3d-13.149251910563454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91127df908ad3b23%3A0x9146a724360bcb70!2sBiblioteca%20Central!5e0!3m2!1ses-419!2spe!4v1759874693379!5m2!1ses-419!2spe" // <-- VERIFICAR URL DE EMBED
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </div>
            <FloatingContactButton />
        </>
    );
}