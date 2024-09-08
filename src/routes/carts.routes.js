import express from 'express';
import CartRepository from '../repositories/CartRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import authorizeRole from '../middleware/guard.auth.js';

const cartsRouter = express.Router();

const cartRepository = new CartRepository();
const ticketRepository = new TicketRepository();
const productRepository = new ProductRepository();

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartRepository.getAllCarts();
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartRepository.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartRepository.updateCart(req.params.cid, req.body.products);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: 'Cantidad no válida' });
    }
    try {
        const updatedCart = await cartRepository.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/:cid/products/:pid', authorizeRole('user'), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartRepository.addProductToCart(cid, pid, req.body.quantity || 1);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/:cid/purchase', authorizeRole('user'), async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepository.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const updatedProducts = [];
        const outOfStockProducts = [];

        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await productRepository.getProductById(item.productId);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productRepository.updateProduct(item.productId, product.stock);

                updatedProducts.push(item);
                totalAmount += product.price * item.quantity;
            } else {
                outOfStockProducts.push(item.productId);
            }
        }

        if (updatedProducts.length > 0) {
            const ticketData = {
                code: `TICKET-${Date.now()}`,
                purchase_datetime: Date.now(),
                amount: totalAmount,
                purchaser: req.user.email
            };

            const createdTicket = await ticketRepository.createTicket(ticketData);

            cart.products = cart.products.filter(item => outOfStockProducts.includes(item.productId));
            await cartRepository.updateCart(cid, cart.products);

            res.json({
                message: 'Compra finalizada con éxito para los productos disponibles',
                ticket: createdTicket,
                outOfStockProducts: outOfStockProducts
            });
        } else {
            res.status(400).json({
                error: 'No hay suficientes productos en stock para completar la compra.',
                outOfStockProducts: outOfStockProducts
            });
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const createdCart = await cartRepository.createCart();
        res.json(createdCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.delete('/', async (req, res) => {
    try {
        await cartRepository.clearAllCarts();
        res.json({ message: 'Todos los productos han sido eliminados de todos los carritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default cartsRouter;
