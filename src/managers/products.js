import { promises as fs } from 'fs';

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = true;
    }
}

export class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
        this.path = './src/files/products.json';
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar en el archivo:', error);
            throw error;
        }
    }

    async recoverProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            if (data && data.length > 0) {
                this.products = JSON.parse(data);
                this.products = this.products.filter(product => product.status === true);
                const maxIdProduct = this.products.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr, { id: 0 });
                this.nextId = maxIdProduct.id + 1;
            } else {
                this.products = [];
                this.nextId = 1;
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('Error al leer el archivo:', error);
                this.products = [];
                this.nextId = 1;
            }
        }
    }

    async addProduct(title, id, description, price, thumbnail, code, stock) {
        await this.recoverProducts();

        const duplicateCode = this.products.some(product => product.code === code);
        if (duplicateCode) {
            console.log('El código ya existe');
            return { success: false, message: "El código ya existe" };
        }

        const newProduct = new Product(id, title, description, price, thumbnail, code, stock);
        this.products.push(newProduct);

        try {
            await this.saveToFile();
            console.log('Producto añadido correctamente');
            return { success: true, message: "Producto añadido correctamente", product: newProduct };
        } catch (error) {
            console.error('Error al guardar productos:', error.message);
            return { success: false, message: "Error al guardar productos" };
        }
    }

    async getProducts() {
        await this.recoverProducts();
        return this.products;
    }

    async removeProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index].status = false;
            await this.saveToFile();
        } else {
            console.log('Producto no encontrado');
        }
    }

    async updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            await this.saveToFile();
        } else {
            console.log('Producto no encontrado');
        }
    }

    async getProductById(id) {
        await this.recoverProducts();
        const product = this.products.find(product => product.id === id);
        return product || null;
    }

    async getProductByCode(code) {
        await this.recoverProducts();
        const product = this.products.find(product => product.code === code);
        return product || null;
    }
}
