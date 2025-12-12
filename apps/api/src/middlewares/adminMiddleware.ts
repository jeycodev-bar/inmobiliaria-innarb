// /src/middlewares/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    // Se asume que este middleware corre DESPUÉS de 'protect'
    if (req.user && (req.user as { role: string }).role === 'administrador') {
        next();
    } else {
        res
            .status(403)
            .json({ message: 'Acceso denegado. No tienes permisos de administrador.' });
    }
};