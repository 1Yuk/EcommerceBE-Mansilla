import { cartManager } from "../models/cart.js";
import { Router } from 'express';

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    await cartManager.createCart();
    res.send( "Carrito creado");
})

cartsRouter.get('/', async (req, res) => {
    res.send( await cartManager.getAllCarts());
})

cartsRouter.get('/:id', async (req, res) => {
    res.send( await cartManager.getCartById(req.params.id));
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    res.send( await cartManager.addProductToCart(req.params.cid,req.params.pid));
})

export default cartsRouter