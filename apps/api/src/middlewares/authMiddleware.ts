// /src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Obtener el token
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);

            // 4. Adjuntar el usuario al request (¡Gracias a /types/express.d.ts, esto es válido!)
            req.user = decoded as {
                id: string;
                role: string;
                email: string;
            };

            next();
        } catch (error) {
            return res
                .status(401)
                .json({ message: 'No autorizado, token inválido.' });
        }
    }

    if (!token) {
        return res
            .status(401)
            .json({ message: 'No autorizado, no se encontró un token.' });
    }
};