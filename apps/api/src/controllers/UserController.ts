// /src/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel.js'; // ESM requiere .js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserController {
    /**
     * Registra un nuevo usuario.
     */
    static async register(req: Request, res: Response) {
        try {
            const { fullName, email, password, phone } = req.body;

            if (!fullName || !email || !password) {
                return res
                    .status(400)
                    .json({ message: 'Nombre, email y contraseña son requeridos.' });
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res
                    .status(409)
                    .json({ message: 'El correo electrónico ya está en uso.' });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = await UserModel.create({
                fullName,
                email,
                passwordHash,
                phone,
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente.',
                user: newUser,
            });
        } catch (error) {
            console.error('Error en el registro de usuario:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Autentica un usuario (inicia sesión).
     */
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: 'Email y contraseña son requeridos.' });
            }

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password_hash
            );
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role, email: user.email },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login exitoso.',
                token,
                user: {
                    id: user.id,
                    fullName: user.full_name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error('Error en el login de usuario:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado.
     */
    static async getProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as { id: string }).id;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // Mapeo snake_case → camelCase
            const userProfile = {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                created_at: user.created_at,
            };

            res.status(200).json(userProfile);
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Obtiene una lista de todos los usuarios (solo para admins).
     */
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserModel.getAll();

            const mappedUsers = users.map((user) => ({
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                created_at: user.created_at,
            }));

            res.status(200).json(mappedUsers);
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    /**
     * Actualiza el perfil del usuario autenticado (nombre y teléfono).
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const { id: userId } = req.user as { id: string };
            const { fullName, phone } = req.body;

            if (fullName === undefined && phone === undefined) {
                return res
                    .status(400)
                    .json({ message: 'No se proporcionaron datos para actualizar.' });
            }

            const updatedUser = await UserModel.update(userId, { fullName, phone });

            const userProfile = {
                id: updatedUser.id,
                fullName: updatedUser.full_name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                created_at: updatedUser.created_at,
            };

            res.status(200).json({
                message: 'Perfil actualizado exitosamente.',
                user: userProfile,
            });
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}
