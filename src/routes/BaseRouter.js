import { Router } from 'express';

class BaseRouter {
    constructor() {
        this.router = Router();
    }

    routes() {
        throw new Error('El método "routes()" debe ser implementado en la clase');
    }
    getRouter() {
        this.routes();
        return this.router;
    }
}

export default BaseRouter;
