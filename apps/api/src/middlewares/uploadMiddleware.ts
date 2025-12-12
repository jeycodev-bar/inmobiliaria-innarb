// /src/middlewares/uploadMiddleware.ts
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadDir = 'uploads/';

// Asegurarse de que el directorio de 'uploads' exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // La carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

// Filtro para aceptar solo imágenes
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: ¡Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB por archivo
});

export default upload;