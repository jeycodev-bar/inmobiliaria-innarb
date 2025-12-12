// /src/components/ImageLightbox.tsx
import React, { useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ImageLightboxProps {
    images: string[];          // URLs completas
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function ImageLightbox({ images, currentIndex, onClose, onNext, onPrev }: ImageLightboxProps) {
    const currentImageUrl = images[currentIndex];
    const isFirstImage = currentIndex === 0;
    const isLastImage = currentIndex === images.length - 1;

    // --- MEJORA UX: Navegación por teclado ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && !isFirstImage) onPrev();
            if (e.key === 'ArrowRight' && !isLastImage) onNext();
        };

        // Bloquear scroll del body cuando el lightbox está abierto
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset'; // Restaurar scroll
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onNext, onPrev, isFirstImage, isLastImage]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose} // Cerrar al clicar fondo
        >
            {/* Botón Cerrar */}
            <button
                className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:text-red-400 focus:outline-none"
                onClick={onClose}
                aria-label="Cerrar galería"
            >
                <FaTimes size={24} />
            </button>

            {/* Botón Anterior */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                disabled={isFirstImage}
                className="absolute left-4 z-50 rounded-full p-4 text-white transition hover:bg-white/10 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white md:left-8"
                aria-label="Imagen anterior"
            >
                <FaChevronLeft size={30} />
            </button>

            {/* Contenedor de Imagen */}
            <div 
                className="relative flex max-h-screen max-w-screen-xl flex-col items-center justify-center p-4" 
                onClick={(e) => e.stopPropagation()} // Evitar cierre al clicar imagen
            >
                <img
                    src={currentImageUrl}
                    alt={`Vista ampliada ${currentIndex + 1}`}
                    className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                />
                
                {/* Contador de imágenes */}
                <div className="mt-4 rounded-full bg-black/50 px-4 py-1 text-sm text-white backdrop-blur-md">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                disabled={isLastImage}
                className="absolute right-4 z-50 rounded-full p-4 text-white transition hover:bg-white/10 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white md:right-8"
                aria-label="Imagen siguiente"
            >
                <FaChevronRight size={30} />
            </button>
        </div>
    );
}