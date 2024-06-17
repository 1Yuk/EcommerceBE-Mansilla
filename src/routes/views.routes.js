import { Router } from "express";
import { ProductManager } from "../managers/products.js";

const productManager = new ProductManager();

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    if (!products) {
        throw new Error("No hay productos en el carrito", 404);
    } else {
        res.render('home', { products })
    }
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts()
    if (!products) {
        throw new Error("No hay productos en el carrito", 404);
    } else {
        res.render('realTimeProducts', { products })
    }
})

export default viewsRouter


