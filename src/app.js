import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.routes.js';
import prodsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { ProductManager } from './managers/products.js';

// Creación de instancia de ProductManager
const productManager = new ProductManager();

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

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de las rutas
app.use('/', viewsRouter);
app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);

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
