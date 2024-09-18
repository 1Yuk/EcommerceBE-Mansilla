import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import UserDTO from '../dtos/UserDTO.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(options, async (payload, done) => {
        try {
            const user = await User.findById(payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

const currentUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la autenticación' });
        }
        if (!user) {
            return res.status(401).json({ message: 'No autorizado, token no válido o expirado' });
        }
        try {
            const fullUser = await User.findById(user._id);
            if (!fullUser) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }
            const userDTO = new UserDTO(fullUser);
            req.user = userDTO;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error al recuperar el usuario', error: error.message });
        }
    })(req, res, next);
};

export default currentUser;
