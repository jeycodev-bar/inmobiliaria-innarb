// src/components/FloatingLabelInput.tsx

import React from 'react';

// Definimos las props que nuestro componente aceptará
interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

export default function FloatingLabelInput({ label, id, ...props }: FloatingLabelInputProps) {
    return (
        <div className="relative">
            {/* El truco principal:
        - 'peer': Marca este input para que sus hermanos puedan reaccionar a su estado (focus, valid, etc.).
        - 'placeholder=" "': Un placeholder con un espacio es crucial para que la pseudo-clase :placeholder-shown funcione correctamente.
      */}
            <input
                id={id}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gold-600 peer"
                placeholder=" "
                {...props} // Pasamos el resto de las props (type, value, onChange, etc.)
            />
            {/*
        La etiqueta "flotante":
        - Se posiciona de forma absoluta dentro del div relativo.
        - Las clases 'peer-focus:*' y 'peer-placeholder-shown:*' reaccionan al estado del input 'peer'.
        - Cuando el placeholder se muestra (input vacío y sin foco), la etiqueta es grande y está en el centro.
        - Cuando el input tiene foco o está lleno (el placeholder ya no se muestra), la etiqueta se encoge (scale-75) y se mueve hacia arriba (-translate-y-4).
      */}
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-gold-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
                {label}
            </label>
        </div>
    );
}