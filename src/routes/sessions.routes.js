import BaseRouter from './BaseRouter.js';
import passport from 'passport';
import { generateToken } from '../utils/jwt.js';
import currentUser from '../middleware/currentUser.js';
import UserDTO from '../dtos/UserDTO.js';
import authorizeRole from '../middleware/guard.auth.js';

class SessionsRouter extends BaseRouter {
    constructor() {
        super();
        this.routes();
    }

    routes() {
        this.router.post('/login', (req, res, next) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return next(err);
                if (!user) return res.status(401).json({ message: info.message || 'Autenticación fallida' });
                req.logIn(user, (err) => {
                    if (err) return next(err);
                    const token = generateToken(user);
                    res.cookie('jwt', token, { httpOnly: true });
                    return res.status(200).json({ message: 'Autenticación exitosa', user, token });
                });
            })(req, res, next);
        });

        this.router.post('/logout', (req, res) => {
            res.clearCookie('jwt');
            res.status(200).json({ message: 'Sesión cerrada correctamente' });
        });

        this.router.get('/current', authorizeRole('admin'), currentUser, (req, res) => {
            if (req.user) {
                const userDTO = new UserDTO(req.user);
                return res.status(200).json({
                    message: 'Usuario autenticado',
                    user: userDTO,
                });
            } else {
                return res.status(401).json({ message: 'No autorizado' });
            }
        });
    }
}

export default new SessionsRouter().getRouter();
