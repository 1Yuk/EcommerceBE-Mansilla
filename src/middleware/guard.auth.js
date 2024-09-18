import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET
const authorizeRole = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token no proporcionado o formato incorrecto' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, secret);
            req.user = decodedToken;

            if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
                return next();
            } else {
                return res.status(403).json({ message: 'Acceso denegado, permisos insuficientes' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
        }
    };
};

export default authorizeRole;