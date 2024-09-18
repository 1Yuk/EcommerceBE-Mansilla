import BaseRouter from './BaseRouter.js';
import CartRepository from '../repositories/CartRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import authorizeRole from '../middleware/guard.auth.js';

class CartRoutes extends BaseRouter {
    constructor() {
        super();
        this.cartRepository = new CartRepository();
        this.ticketRepository = new TicketRepository();
        this.productRepository = new ProductRepository();
    }

    routes() {
        this.router.get('/', async (req, res) => {
            try {
                const carts = await this.cartRepository.getAllCarts();
                res.json(carts);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.router.delete('/:cid/products/:pid', async (req, res) => {
            const { cid: cartId, pid: productId } = req.params;
            try {
                const cart = await this.cartRepository.removeProductFromCart(cartId, productId);
                res.json(cart);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.router.put('/:cid', async (req, res) => {
            try {
                const updatedCart = await this.cartRepository.updateCart(req.params.cid, req.body.products);
                res.json(updatedCart);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.router.put('/:cid/products/:pid', async (req, res) => {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (typeof quantity !== 'number' || quantity <= 0) {
                return res.status(400).json({ error: 'Cantidad no válida' });
            }
            try {
                const updatedCart = await this.cartRepository.updateProductQuantity(cid, pid, quantity);
                res.json(updatedCart);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.router.post('/:cid/products/:pid', authorizeRole('user'), async (req, res) => {
            try {
                const { cid, pid } = req.params;
                const updatedCart = await this.cartRepository.addProductToCart(cid, pid, req.body.quantity || 1);
                res.json(updatedCart);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.router.post('/:cid/purchase', authorizeRole('user'), async (req, res) => {
            try {
                const { cid } = req.params;
                const cart = await this.cartRepository.getCartById(cid);
                if (!cart) {
                    return res.status(404).json({ error: 'Carrito no encontrado' });
                }

                const updatedProducts = [];
                const outOfStockProducts = [];
                let totalAmount = 0;

                for (const item of cart.products) {
                    const product = await this.productRepository.getProductById(item.product._id);

                    if (product.stock >= item.quantity) {
                        product.stock -= item.quantity;
                        await this.productRepository.updateProduct(item.product._id, product.stock);

                        updatedProducts.push(item);
                        totalAmount += product.price * item.quantity;
                    } else {
                        outOfStockProducts.push(item.product._id);
                    }
                }

                if (updatedProducts.length > 0) {
                    const ticketData = {
                        code: `TICKET-${Date.now()}`,
                        purchase_datetime: Date.now(),
                        amount: totalAmount,
                        purchaser: req.user.email
                    };

                    const createdTicket = await this.ticketRepository.createTicket(ticketData);

                    cart.products = cart.products.filter(item => !outOfStockProducts.includes(item.product._id));
                    await this.cartRepository.updateCart(cid, cart.products);

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
                res.status(500).json({ error: error.message });
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                const createdCart = await this.cartRepository.createCart();
                res.json(createdCart);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.router.delete('/:cartId', async (req, res) => {
            const { cartId } = req.params;
            try {
                await this.cartRepository.clearCart(cartId);
                res.json({ message: 'Todos los productos han sido eliminados del carrito' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}

export default new CartRoutes().getRouter();
