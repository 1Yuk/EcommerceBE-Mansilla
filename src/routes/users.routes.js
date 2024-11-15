// users.routes.js
import express from 'express';
import { createUser } from '../services/UserService.js';

const userRouter = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Juan"
 *               last_name:
 *                 type: string
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 example: "juan.perez@example.com"
 *               age:
 *                 type: integer
 *                 example: 30
 *               password:
 *                 type: string
 *                 example: "password123"
 *               cart:
 *                 type: string
 *                 example: "cart_id"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 user:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                       example: "Juan"
 *                     last_name:
 *                       type: string
 *                       example: "Pérez"
 *                     email:
 *                       type: string
 *                       example: "juan.perez@example.com"
 *                     age:
 *                       type: integer
 *                       example: 30
 *                     role:
 *                       type: string
 *                       example: "user"
 *       404:
 *         description: Error al crear el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear el usuario"
 */
userRouter.post('/', async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(200).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario', details: error.message });
    }
});


export default userRouter;
