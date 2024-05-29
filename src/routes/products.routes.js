import { Router } from 'express';
import { ProductManager } from '../models/products.js';

const prodsRouter = Router();
const manager = new ProductManager();

prodsRouter.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit);
    console.log(limit)
    if (limit) {
        let allproducts = (await manager.getProducts()).slice(0, limit)
        res.send(allproducts);
    } else {
        res.send(await manager.getProducts());
    }
});

prodsRouter.get('/:id', async (req, res) => {

    res.send(await manager.getProductById(parseInt(req.params.id)))
});

prodsRouter.post('/', async (req, res) => {
    console.log(req.body);
    const { code } = req.body;
    const confirmacion = await manager.getProductByCode(code)
    if (confirmacion) {
        res.status(400).send("producto ya existente");
    } else {
        const { title, description, price, thumbnail, code, stock } = req.body;
        res.send(await manager.addProduct(title, description, price, thumbnail, code, stock));

    }
});

prodsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const confirmacion = await manager.getProductById(parseInt(req.params.id));
    if (confirmacion) {
        console.log("ingreso")
        await manager.updateProduct(parseInt(id), req.body)
        res.status(200).send("producto actualizado")
    } else {
        res.status(404).send("producto no encontrado")

    }
});

prodsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const confirmacion = await manager.getProductById(parseInt(req.params.id));
    if (confirmacion) {
        console.log("ingreso")
        await manager.updateProduct(parseInt(id), req.body)
        res.status(200).send("producto actualizado")
    } else {
        res.status(404).send("producto no encontrado")
    }
});

prodsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const confirmacion = await manager.getProductById(parseInt(req.params.id));
    if (confirmacion) {
        console.log("ingreso")
        await manager.removeProduct(parseInt(id))
        res.status(200).send("producto eliminado")
    } else {
        res.status(404).send("producto no encontrado")
    }
});

export default prodsRouter