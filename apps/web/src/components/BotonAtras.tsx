import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BotonAtras() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)} //to-rose-600
            className="
                    flex items-center gap-1
                    px-2 py-2
                    bg-gradient-to-r from-pink-500 to-rose-400
                    text-white font-medium
                    rounded-3xl shadow-md
                    hover:from-pink-600 hover:to-rose-700
                    hover:scale-105
                    active:scale-95
                    transition-all duration-200 ease-in-out"
        >
            <FaArrowLeft className="text-lg" />
            <span>Volver</span>
        </button>
    );
}
//hover:scale-105 → crece un poco al pasar el mouse.
//active:scale-95 → se hunde al hacer click.