import { Router } from 'express';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import { generateMockUsers, generateMockPets } from '../utils/mocking.js';

const router = Router();

// Endpoint para "/mockingpets"
router.get('/mockingpets', (req, res) => {
    const pets = generateMockPets(20);
    res.json(pets);
});

// Endpoint para generar usuarios ficticios
router.get('/mockingusers', (req, res) => {
    const users = generateMockUsers(50);
    res.json(users);
});

router.post('/generateData', async (req, res) => {
    const { users = 0, pets = 0 } = req.body;

    try {
        const generatedUsers = generateMockUsers(users);
        const generatedPets = generateMockPets(pets);

        const userInsertResult = await User.insertMany(generatedUsers);
        const petInsertResult = await Pet.insertMany(generatedPets);

        res.status(201).json({
            message: 'Datos generados e insertados correctamente',
            usersInserted: userInsertResult.length,
            petsInserted: petInsertResult.length
        });
    } catch (error) {
        console.error('Error insertando los datos:', error);
        res.status(500).json({ message: 'Error al insertar los datos', error });
    }
});

export default router;
