import BaseRouter from './BaseRouter.js';
import { productManager as manager } from '../services/ProductService.js';
import Product from '../models/Product.js';
import authorizeRole from '../middleware/guard.auth.js';

class ProductRoutes extends BaseRouter {
    constructor() {
        super();
    }

    routes() {
        this.router.get('/', async (req, res) => {
            try {
                const { limit = 10, page = 1, sort, query } = req.query;
                const limitInt = parseInt(limit, 10);
                const pageInt = parseInt(page, 10);
                let filter = {};

                if (query) {
                    filter.$or = [
                        { title: new RegExp(query, 'i') },
                        { description: new RegExp(query, 'i') }
                    ];
                }

                let products = await Product.find(filter);

                if (sort) {
                    const sortOrder = sort === 'asc' ? 1 : -1;
                    products = products.sort((a, b) => (a.price - b.price) * sortOrder);
                }

                const startIndex = (pageInt - 1) * limitInt;
                const paginatedProducts = products.slice(startIndex, startIndex + limitInt);
                const totalPages = Math.ceil(products.length / limitInt);

                res.json({
                    status: 'success',
                    payload: paginatedProducts,
                    totalPages: totalPages,
                    prevPage: pageInt > 1 ? pageInt - 1 : null,
                    nextPage: pageInt < totalPages ? pageInt + 1 : null,
                    page: pageInt,
                    hasPrevPage: pageInt > 1,
                    hasNextPage: pageInt < totalPages,
                    prevLink: pageInt > 1 ? `/api/products?limit=${limitInt}&page=${pageInt - 1}&sort=${sort}&query=${query}` : null,
                    nextLink: pageInt < totalPages ? `/api/products?limit=${limitInt}&page=${pageInt + 1}&sort=${sort}&query=${query}` : null
                });
            } catch (error) {
                res.status(500).json({ status: 'error', error: error.message });
            }
        });

        this.router.get('/:id', async (req, res) => {
            res.send(await manager.getProductById(req.params.id));
        });

        this.router.post('/', authorizeRole('admin'), async (req, res) => {
            try {
                const { title, description, price, thumbnail, code, stock, category } = req.body;
                const confirmacion = await manager.getProductByCode(code);
                if (confirmacion) {
                    return res.status(400).send("Producto ya existente");
                }
                const newProduct = await manager.addProduct(title, description, price, thumbnail, code, stock, category);
                res.send(newProduct);
            } catch (error) {
                res.status(500).json({ status: 'error', error: error.message });
            }
        });

        this.router.put('/:id', authorizeRole('admin'), async (req, res) => {
            const { id } = req.params;
            const updatedProduct = req.body;
            const confirmacion = await manager.getProductById(id);

            if (confirmacion) {
                const result = await manager.updateProduct(id, updatedProduct);
                res.status(200).send(result);
            } else {
                res.status(404).send("Producto no encontrado");
            }
        });

        this.router.delete('/:id', authorizeRole('admin'), async (req, res) => {
            const { id } = req.params;
            const confirmacion = await manager.getProductById(id);

            if (confirmacion) {
                await manager.removeProduct(id);
                res.status(200).send("Producto eliminado");
            } else {
                res.status(404).send("Producto no encontrado");
            }
        });
    }
}

export default new ProductRoutes().getRouter();
