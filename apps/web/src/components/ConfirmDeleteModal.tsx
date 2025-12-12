// /src/components/ConfirmDeleteModal.tsx
import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string; // Nombre del elemento a eliminar (ej. nombre de la propiedad)
    isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                {/* Botón Cerrar */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    aria-label="Cerrar modal"
                >
                    <FaTimes className="h-5 w-5" />
                </button>

                {/* Contenido */}
                <div className="flex flex-col items-center text-center">
                    <FaExclamationTriangle className="mb-4 h-12 w-12 text-red-500" />
                    <h2 className="mb-2 text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
                    <p className="mb-6 text-gray-600">
                        ¿Estás seguro de que quieres eliminar la propiedad{' '}
                        <strong className="font-semibold">"{itemName}"</strong>?
                        <br />
                        Esta acción no se puede deshacer.
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex w-full justify-center space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="rounded-md bg-red-600 px-6 py-2 text-white transition hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;