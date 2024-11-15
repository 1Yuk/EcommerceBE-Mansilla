import Cart from '../models/Cart.js'

class CartRepository {
    async getAllCarts() {
        return await Cart.find().populate('products.product');
    }

    async getCartById(cartId) {
        return await Cart.findById(cartId).populate('products.product');
    }

    async createCart() {
        const newCart = new Cart();
        return await newCart.save();
    }

    async saveCart(cart) {
        return await cart.save();
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await this.saveCart(cart);
    }

    async updateCart(cartId, products) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = products.map(({ productId, quantity }) => ({
            product: productId,
            quantity
        }));

        return await this.saveCart(cart);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error(`Cart with ID ${cartId} not found`);
        }
        const productExists = cart.products.some(p => p.product._id.toString() === productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found in cart`);
        }
        cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
        return await this.saveCart(cart);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await this.saveCart(cart);
    }

    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error(`Carrito con id ${cartId} no encontrado`);
        }
        cart.products = [];
        return await this.saveCart(cart);
    }
}

export default CartRepository;
