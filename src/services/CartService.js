import CartRepository from '../repositories/CartRepository.js';
import { CartDTO } from '../dtos/CartDTO.js';
import { productManager } from './ProductService.js';

class CartService {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    async getAllCarts() {
        const carts = await this.cartRepository.getAllCarts();
        return CartDTO.fromDocumentArray(carts); // Lógica para transformar la respuesta
    }

    async getCartById(cartId) {
        const cart = await this.cartRepository.getCartById(cartId);
        return CartDTO.fromDocument(cart);
    }

    async createCart() {
        const newCart = await this.cartRepository.createCart();
        return CartDTO.fromDocument(newCart);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.cartRepository.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.cartRepository.saveCart(cart);
        return CartDTO.fromDocument(cart);
    }

    async updateCart(cartId, products) {
        const cart = await this.cartRepository.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productUpdates = await Promise.all(products.map(async ({ productId, quantity }) => {
            const product = await productManager.getProductById(productId);
            return product ? { product: product._id, quantity } : null;
        }));
        const validProducts = productUpdates.filter(p => p !== null);
        cart.products = validProducts;

        await this.cartRepository.saveCart(cart);
        const populatedCart = await this.cartRepository.getCartById(cartId);
        return CartDTO.fromDocument(populatedCart);
    }

    async removeProductFromCart(cartId, productId) {
        return await this.cartRepository.removeProductFromCart(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await this.cartRepository.updateProductQuantity(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        const cart = await this.cartRepository.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        cart.products = [];
        await this.cartRepository.saveCart(cart);
        return CartDTO.fromDocument(cart);
    }
}

export default CartService;
