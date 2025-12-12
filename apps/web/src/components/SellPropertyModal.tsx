// /src/components/SellPropertyModal.tsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

type SellPropertyModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (buyerName: string, password: string) => Promise<void>;
    isLoading: boolean;
};

const SellPropertyModal = ({ isOpen, onClose, onSubmit, isLoading }: SellPropertyModalProps) => {
    const [buyerName, setBuyerName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!buyerName || !password) {
            setError('Ambos campos son obligatorios.');
            return;
        }
        try {
            await onSubmit(buyerName, password);
            // El componente padre (PropertyDetailPage) se encargará de cerrar
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error.');
        }
    };

    if (!isOpen) return null;

    return (
        // Fondo oscuro (overlay)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            {/* Panel del Modal */}
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                {/* Botón de Cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <FaTimes className="h-5 w-5" />
                </button>

                <h2 className="mb-4 text-2xl font-bold text-gray-800">Confirmar Venta</h2>
                <p className="mb-6 text-sm text-gray-600">
                    Para marcar esta propiedad como vendida, ingresa el nombre del
                    comprador y tu contraseña de agente para confirmar.
                </p>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-center text-sm text-red-700">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="buyerName"
                            className="mb-1 block font-medium text-gray-700"
                        >
                            Nombre del Comprador
                        </label>
                        <input
                            type="text"
                            id="buyerName"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block font-medium text-gray-700"
                        >
                            Tu Contraseña (Confirmación)
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Confirmando...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellPropertyModal;