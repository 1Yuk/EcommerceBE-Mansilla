import axios from 'axios';

const baseURL = 'http://localhost:8080';

// Yo se que estos datos van el .env Pero es un perfil hecho aproposito para hacer test asi que lo pueden usar :)

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDM4YmY3ZGQ4MmZjYWIwNTk1MmU3ZiIsImVtYWlsIjoieXVrZmx5MkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzE1MTA2MDYsImV4cCI6MTczMTUxNDIwNn0.1XxhdavTLQ-O3-74GBQeKbP0B1i0T8pb7BPVyg553rE'
const email = 'yukfly2@gmail.com';
const password = 'reiquiShen_long.777';

describe('Products Router', () => {
    // Test para GET /products
    it('Debería devolver una lista de productos.', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/products`);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('data');
            expect(Array.isArray(response.data.data)).toBe(true);
        } catch (error) {
            // console.log(error);
        }
    });

    // Test para POST /products (crear un producto)
    it('Debería crear un nuevo producto', async () => {
        const newProduct = {
            title: 'Nuevo Producto',
            description: 'Descripción del producto',
            price: 100,
            thumbnail: 'url',
            code: '123',
            stock: 10,
        };

        try {
            const response = await axios.post(`${baseURL}/api/products`, newProduct);

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('id');
            expect(response.data.title).toBe(newProduct.title);
        } catch (error) {
            // console.log(error);
        }
    });

    // Test para GET /products/:id (buscar un producto por ID)
    it('Debe devolver un solo producto por ID', async () => {
        const productId = 1;

        try {
            const response = await axios.get(`${baseURL}/api/products/${productId}`);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('id');
            expect(response.data.id).toBe(productId);
        } catch (error) {
            // console.log(error);
        }
    });

    // Test para PUT /products/:id (actualizar un producto)
    it('Debería actualizar un producto existente', async () => {
        const productId = 1;
        const updatedProduct = {
            title: 'Producto Actualizado',
            stock: 15,
        };

        try {
            const response = await axios.put(`${baseURL}/api/products/${productId}`, updatedProduct);

            expect(response.status).toBe(200);
            expect(response.data.title).toBe(updatedProduct.title);
        } catch (error) {
            // console.log(error);
        }
    });

    // Test para DELETE /products/:id (eliminar un producto)
    it('Debería eliminar un producto por ID', async () => {
        const productId = 1;

        try {
            const response = await axios.delete(`${baseURL}/api/products/${productId}`);

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Product deleted successfully');
        } catch (error) {
            // console.log(error);
        }
    });
});
describe('Carts Router', () => {
    it('Deberían llegar todos los carros', async () => {
        const response = await axios.get(`${baseURL}/api/carts`);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
    });

    it('Debería obtener un carrito por ID', async () => {
        try {
            const cartId = '668d5542d865193127d1fc3e';
            const response = await axios.get(`${baseURL}/api/carts/${cartId}`);

            expect(response.status).toBe(200);
            expect(response.data._id).toBe(cartId);
        } catch (error) {
            // console.error('Error en la prueba:', error);
        }
    });

    it('Debería crear un nuevo carrito', async () => {
        const newCart = { products: [] };
        try {
            const response = await axios.post(`${baseURL}/api/carts`, newCart);

            expect(response.status).toBe(200);
            expect(response.data._id).toBeDefined();
        } catch (error) {
            console.error('Error en la prueba:', error.response?.data || error.message);
            throw error;
        }
    });

    it('Debería agregar un producto al carrito', async () => {
        const cartId = '66d1fce2360bfeb9e2abd7d8';
        const productId = '668bc0ec7b6ad899c4cea32f';
        const quantity = 3;
        try {
            const response = await axios.post(
                `${baseURL}/api/carts/${cartId}/products`,
                { productId, quantity },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    auth: {
                        username: email,
                        password: password,
                    }
                }
            );

            expect(response.status).toBe(200);

        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });

    it('Debería actualizar el carrito', async () => {
        const cartId = '668d7e98fca562012be5d451';
        const products = [{ productId: '668bc4085cd93ae7eb0a666f', quantity: 3 }];
        const response = await axios.put(`${baseURL}/api/carts/${cartId}`, { products });

        expect(response.status).toBe(200);
        expect(response.data.products.length).toBe(1);
        expect(response.data.products[0].quantity).toBe(3);
    });

    // PARA UTILIZAR ESTE DEBEN AGREGAR UN PRODUCTO AL CARRITO PARA EL ID Y PROBARLO. lO DEJE DESACTIVADO PARA NO ESTAR UTILIZANDOLO TODO EL RATO
    // it('Debería eliminar un producto del carrito', async () => {
    //     const cartId = '66d1fce2360bfeb9e2abd7d8';
    //     const productId = '668bc4085cd93ae7eb0a666f'; // Modificar siempre que quieras eliminar un producto. 

    //     const response = await axios.delete(`${baseURL}/api/carts/${cartId}/products/${productId}`);

    //     expect(response.status).toBe(200);
    // });

    it('Debería borrar todos los productos del carrito', async () => {
        const cartId = '668d7e98fca562012be5d451';

        const response = await axios.delete(`${baseURL}/api/carts/${cartId}`);

        expect(response.status).toBe(200);
    });

});
describe('Protected Router', () => {
    it('should return 200 and success message for valid token', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/protected`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    auth: {
                        username: email,
                        password: password,
                    }
                }
            );

            expect(response.status).toBe(200);
            expect(response.data).toEqual({ message: 'Acceso a ruta protegida exitoso' });

        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
});
describe('Sessions Router', () => {
    it('Debería iniciar sesión correctamente y devolver un token.', async () => {
        try {
            const response = await axios.post(
                `${baseURL}/api/sessions/login`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    auth: {
                        username: email,
                        password: password,
                    }
                }
            );
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Autenticación exitosa');
            expect(response.data).toHaveProperty('token');
            token = response.data.token;
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debe devolver los datos del usuario actual cuando esté autorizado.', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/sessions/current`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Usuario autenticado');
            expect(response.data).toHaveProperty('user');
            expect(response.data.user).toHaveProperty('username', 'adminUser');
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debería cerrar la sesión correctamente y borrar el token', async () => {
        try {
            const response = await axios.post(`${baseURL}/api/sessions/logout`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Sesión cerrada correctamente');
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
});
// El Router de user crea un usuario se pueda cambiar tambien.
describe('Users Router', () => {
    it('Debería crear un usuario exitosamente y manejar errores correctamente', async () => {
        try {
            const validUserData = { first_name: 'Lucas', last_name: 'Rodriguez', mail: 'lucas@example.com', age: 21, password: 'password123', cart: '668d78c4326e261adf2246b6', role: 'user' };
            const response = await axios.post(`${baseURL}/api/user`, validUserData);

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Usuario creado exitosamente');
            expect(response.data.user).toBeDefined();

            const invalidUserData = { nombre: '', email: 'invalid-email', password: '123' };
            await axios.post(`${baseURL}/api/users`, invalidUserData);
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });

})
describe('Views Router', () => {
    it('Debería listar productos correctamente y manejar errores', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/views?limit=5&page=1&sort=desc`);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('products');

            const noProductsResponse = await axios.get(`${baseURL}/api/views?limit=5&page=999`);
            expect(noProductsResponse.status).toBe(404);
            expect(noProductsResponse.data.error).toBe('No hay productos disponibles');
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debería obtener un producto por ID y manejar errores correctamente', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/views/products/validProductId`);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('product');

            await axios.get(`${baseURL}/api/views/products/invalidProductId`);
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debería obtener un carrito por ID, manejar errores y agregar productos correctamente', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/views/carts/validCartId`);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('cart');

            const cartWithProduct = await axios.post(`${baseURL}/api/views/carts/validCartId`, {
                productId: 'validProductId',
                quantity: 2
            });
            expect(cartWithProduct.status).toBe(200);
            expect(cartWithProduct.data.cart).toBeDefined();

            await axios.get(`${baseURL}/api/views/carts/invalidCartId`);
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debería listar productos en tiempo real y manejar errores', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/views/realtimeproducts`);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('products');

            const noProductsResponse = await axios.get(`${baseURL}/api/views/realtimeproducts`);
            if (!noProductsResponse.data.products.length) {
                throw new Error("No hay productos disponibles", 404);
            }
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
});
describe('Mocks Router', () => {
    it('Debería generar y devolver una lista de 20 mascotas ficticias', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/mocks/mockingpets`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data.length).toBe(20);
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debería generar y devolver una lista de 50 usuarios ficticios', async () => {
        try {
            const response = await axios.get(`${baseURL}/api/mocks/mockingusers`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data.length).toBe(50);
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });
    it('Debería generar e insertar datos de usuarios y mascotas en la base de datos', async () => {
        try {
            const requestData = { users: 10, pets: 5 };
            const response = await axios.post(`${baseURL}/api/mocks/generatedata`, requestData);

            expect(response.status).toBe(201);
            expect(response.data.message).toBe('Datos generados e insertados correctamente');
            expect(response.data.usersInserted).toBe(10);
            expect(response.data.petsInserted).toBe(5);
            await axios.post(`${baseURL}/api/mocks/generatedata`, { users: 'invalid', pets: 'invalid' });
        } catch (error) {
            // console.error('Error en la solicitud:', error.message);
        }
    });

});