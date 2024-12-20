import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import viewsRouter from './routes/views.routes.js';
import prodsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import userRouter from './routes/users.routes.js'
import mocksRouter from './routes/mocks.router.js';
import sessionsRouter from './routes/sessions.routes.js';
import protectedRouter from './routes/protected.routes.js';
import { productManager } from './services/ProductService.js';
import currentUser from './middleware/currentUser.js'
import mongoose from 'mongoose';
import './utils/passport.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swaggerConfig.js';
import dotenv from 'dotenv';
dotenv.config();

// Variables para __dirname con ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Creación de la aplicación Express y del servidor HTTP
const app = express();
const server = createServer(app);
const PORT = 8080;

// Configuración del servidor HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Inicializar Passport y manejar sesiones
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Handlebars
const hbs = engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de las rutas
app.use('/', viewsRouter);
app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/user', userRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api', currentUser, protectedRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar servidor HTTP en el puerto especificado
server.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});

// Configuración de Socket.IO
const io = new SocketServer(server);

io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on('createProduct', async (data) => {
        try {
            console.log(data.stock);
            const product = await productManager.addProduct(data.title, data.description, data.price, data.thumbnail, data.code, data.stock);
            io.emit('productCreated', { message: 'Producto creado', product });
        } catch (error) {
            socket.emit('productError', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });

    socket.on('error', (error) => {
        console.error('Error WebSocket:', error);
    });
});

// Configuración de Mongoose
mongoose.connect('mongodb+srv://yukfly1:XTzXjRuLvxvZuLdn@ecommercebe.0gad27b.mongodb.net/?retryWrites=true&w=majority&appName=EcommerceBE', {
    // Validaciones ----
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB', err);
});