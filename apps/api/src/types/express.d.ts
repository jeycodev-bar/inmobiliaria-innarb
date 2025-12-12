// /src/types/express.d.ts

// Importamos los tipos de JwtPayload para extenderlo
import { JwtPayload } from 'jsonwebtoken';

// Extendemos el espacio de nombres 'Express'
declare global {
    namespace Express {
        export interface Request {
            // Añadimos la propiedad 'user' a la Request
            // Puede ser el payload de nuestro JWT o 'undefined'
            user?: string | (JwtPayload & { 
                id: string;
                role: string;
                email: string;
            });
        }
    }
}